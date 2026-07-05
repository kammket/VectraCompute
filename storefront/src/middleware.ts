import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
const SUPPORTED_COUNTRIES = [DEFAULT_REGION.toLowerCase()]

const regionMapCache = {
  regionMap: new Map<string, true>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(_cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    regionMapCache.regionMap.clear()
    SUPPORTED_COUNTRIES.forEach((country) => {
      regionMapCache.regionMap.set(country, true)
    })
    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, true>
) {
  let countryCode

  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    countryCode = urlCountryCode
  } else if (regionMap.has(DEFAULT_REGION)) {
    countryCode = DEFAULT_REGION
  } else if (regionMap.keys().next().value) {
    countryCode = regionMap.keys().next().value
  }

  return countryCode
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = await getCountryCode(request, regionMap)

  // if the country code is available, use it, otherwise use the default region
  const country = countryCode || DEFAULT_REGION
  const firstPathSegment = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  const urlHasCountry = firstPathSegment === country.toLowerCase()

  if (urlHasCountry) {
    if (!cacheIdCookie) {
      const response = NextResponse.next()
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    return NextResponse.next()
  }

  const unsupportedCountryPath =
    firstPathSegment?.length === 2 && !regionMap.has(firstPathSegment)

  const redirectPath = unsupportedCountryPath
    ? request.nextUrl.pathname.replace(`/${firstPathSegment}`, "") || ""
    : request.nextUrl.pathname === "/"
    ? ""
    : request.nextUrl.pathname
  const queryString = request.nextUrl.search || ""
  const redirectUrl = `${request.nextUrl.origin}/${country}${redirectPath}${queryString}`

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    // Exclude metadata routes (opengraph-image, sitemap, robots, etc.) so the
    // country-prefix redirect doesn't turn them into 404s for crawlers.
    "/((?!api|admin|_next/static|_next/image|favicon.ico|images|assets|opengraph-image|twitter-image|sitemap.xml|robots.txt|manifest.webmanifest|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
