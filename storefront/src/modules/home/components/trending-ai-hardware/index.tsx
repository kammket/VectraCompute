import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"

const TRENDING_HANDLES = [
  "vectraforge-rtx-5090-ai-workstation",
  "vectraforge-dual-rtx-5090-workstation",
  "vectraforge-rtx-pro-6000-studio",
  "vectrarack-liquid-h200-node",
  "vectrarack-h200-nvl-inference-appliance",
  "vectrarack-gb300-nvl72-quote-ready-rack",
  "vectralocal-llm-inference-appliance",
  "vectrajetson-thor-robotics-ai-kit",
  "vectrahailo-edge-npu-gateway",
  "vectramem-1tb-ddr5-ecc-ai-memory-kit",
  "vectrastore-120tb-nvme-dataset-expansion-kit",
  "vectrastore-500tb-nvme-ai-storage-server",
  "vectrapower-60kw-ai-rack-pdu-kit",
  "vectracool-cdu-liquid-cooling-package",
  "vectravision-ai-video-analytics-server",
]

const TRENDING_SIGNALS = [
  "GB300, B200, and H200 NVL quote demand",
  "Jetson Thor, Hailo NPU, and edge robotics",
  "DDR5 ECC memory and NVMe dataset growth",
  "Power, CDU cooling, and monitoring for AI racks",
]

export default async function TrendingAiHardware({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 100,
    },
  })

  const productMap = new Map(
    products.map((product) => [product.handle, product])
  )
  const trendingProducts = TRENDING_HANDLES.map((handle) =>
    productMap.get(handle)
  ).filter((product): product is HttpTypes.StoreProduct => Boolean(product))

  if (!trendingProducts.length) {
    return null
  }

  return (
    <section className="bg-grey-5 border-y border-ui-border-base">
      <div className="content-container py-14">
        <div className="grid grid-cols-1 large:grid-cols-[340px_minmax(0,1fr)] gap-8 items-start">
          <div className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              Trending AI hardware
            </Text>
            <Heading level="h2" className="text-2xl mb-3">
              New infrastructure buyers are searching for now
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-5">
              Beyond GPUs, AI teams are buying cooling, storage, networking,
              private RAG systems, and edge inference kits. These products are
              organized around those high-intent searches.
            </Text>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {TRENDING_SIGNALS.map((signal) => (
                <div
                  key={signal}
                  className="rounded-md border border-ui-border-base bg-grey-5 px-3 py-2 text-small-semi text-ui-fg-base"
                >
                  {signal}
                </div>
              ))}
            </div>
            <LocalizedClientLink href="/resources/trending-ai-hardware">
              <Button variant="secondary" className="w-full justify-center">
                Read the trend guide
              </Button>
            </LocalizedClientLink>
          </div>
          <ul className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-5">
            {trendingProducts.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
