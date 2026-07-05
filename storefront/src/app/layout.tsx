import { getBaseURL } from "@lib/util/env"
import {
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  JsonLd,
} from "@lib/util/json-ld"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "VectraCompute | AI Workstations & GPU Servers",
    template: "%s",
  },
  applicationName: "VectraCompute",
  // Social defaults inherited by every page that doesn't set its own. The
  // file-based opengraph-image.tsx supplies the default share image.
  openGraph: {
    type: "website",
    siteName: "VectraCompute",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VectraCompute | AI Workstations & GPU Servers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
