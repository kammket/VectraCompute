import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-grid"
import FeatureCards from "@modules/home/components/feature-cards"
import SoftwareStack from "@modules/home/components/software-stack"
import TargetedBuyerScripts from "@modules/home/components/targeted-buyer-scripts"
import TrendingAiHardware from "@modules/home/components/trending-ai-hardware"
import WorkloadConfigurator from "@modules/home/components/workload-configurator"
import TrustBar from "@modules/common/components/trust-bar"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "VectraCompute | AI Workstations & GPU Servers Built to Order",
  description:
    "Custom deep-learning workstations, multi-GPU rack servers, and render workstations from VectraCompute. Stress-tested, benchmarked, and shipped ready to train.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoryGrid />
      <TrendingAiHardware region={region} />
      <TargetedBuyerScripts />
      <WorkloadConfigurator />
      {collections && collections.length > 0 && (
        <section className="bg-white">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </section>
      )}
      <FeatureCards />
      <SoftwareStack />
      <TrustBar />
      <section className="content-container py-14">
        <div className="grid grid-cols-1 large:grid-cols-[1fr_auto] items-center gap-6 rounded-md bg-grey-90 text-white px-6 small:px-8 py-10">
          <div>
            <Text className="text-small-semi uppercase text-brand-200 mb-2">
              Need help choosing?
            </Text>
            <Heading level="h2" className="text-2xl text-white mb-2">
              Get a configuration reviewed by an engineer.
            </Heading>
            <Text className="text-grey-20 max-w-2xl">
              Tell us about your models, users, timeline, power, cooling, and
              budget. We will help you size the system before you buy.
            </Text>
          </div>
          <LocalizedClientLink href="/configure">
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 border-none w-full small:w-auto"
            >
              Use Configurator
            </Button>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
