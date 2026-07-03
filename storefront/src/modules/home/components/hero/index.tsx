import { Button, Heading, Text } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="min-h-[680px] w-full border-b border-ui-border-base relative bg-grey-90 overflow-hidden">
      <Image
        src="/images/gpu-hero-opt.png"
        alt="GPU server rack with accelerator hardware for AI training and inference"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-grey-90 via-grey-90/82 to-grey-90/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-grey-90/15 to-grey-90" />
      <div className="content-container relative z-10 min-h-[680px] grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_420px] items-center gap-10 py-20">
        <div className="max-w-3xl">
          <Text className="text-small-semi uppercase tracking-[0.16em] text-brand-200 mb-4">
            Premium AI workstations, refurbished GPU servers, and AI hardware
          </Text>
          <Heading
            level="h1"
            className="text-4xl small:text-5xl leading-tight text-white font-semibold"
          >
            AI Workstations & Refurbished GPU Servers,
            <br />
            Built for Serious Compute
          </Heading>
          <Text className="text-lg text-grey-20 mt-4 max-w-2xl">
            VectraCompute engineers deep-learning workstations, multi-GPU rack
            servers, refurbished enterprise systems, and upgrade components.
            Every configuration is reviewed, stress-tested, benchmarked, and
            prepared for production AI workloads.
          </Text>
          <div className="flex flex-col small:flex-row gap-3 mt-8">
            <LocalizedClientLink href="/categories/ai-deep-learning-workstations">
              <Button
                variant="primary"
                className="bg-brand-600 hover:bg-brand-700 border-none w-full small:w-auto"
              >
                Shop Workstations
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories/gpu-rack-servers">
              <Button variant="secondary" className="w-full small:w-auto">
                Shop GPU Servers
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 rounded-large border border-white/15 bg-white/10 p-5 backdrop-blur">
          {[
            ["01", "Workload-first sizing"],
            ["02", "Refurbished hardware validation"],
            ["03", "Burn-in, CUDA, and thermal testing"],
            ["04", "Procurement-ready warranty options"],
          ].map(([number, item]) => (
            <div
              key={item}
              className="grid grid-cols-[44px_1fr] items-center gap-4 border-b border-white/15 pb-3 last:border-b-0 last:pb-0"
            >
              <Text className="text-small-semi text-brand-200">{number}</Text>
              <Text className="text-base-semi text-white">{item}</Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
