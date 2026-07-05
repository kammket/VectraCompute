import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-grid"
import FeatureCards from "@modules/home/components/feature-cards"
import SoftwareStack from "@modules/home/components/software-stack"
import TrendingAiHardware from "@modules/home/components/trending-ai-hardware"
import WorkloadConfigurator from "@modules/home/components/workload-configurator/lazy"
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

  if (!region) {
    return null
  }

  // Section order tells one story without repeating it: what we sell
  // (categories, trending), why buy here (feature cards), what you get
  // (software stack), then the guided path (configurator) and a human CTA.
  return (
    <>
      <Hero />
      <CategoryGrid />
      <TrendingAiHardware region={region} />
      <FeatureCards />
      <SoftwareStack />
      <WorkloadConfigurator />
      <section className="content-container py-8 small:py-14">
        <div className="grid grid-cols-1 large:grid-cols-[1fr_auto] items-center gap-6 rounded-md bg-grey-90 text-white px-6 small:px-8 py-6 small:py-10">
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
          <LocalizedClientLink href="/contact">
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 border-none w-full small:w-auto"
            >
              Talk to an Engineer
            </Button>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
