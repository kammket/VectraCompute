import { Metadata } from "next"
import { Server, ShieldCheck, SparklesMini } from "@medusajs/icons"

import { SOLUTIONS } from "@lib/data/solutions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  PremiumCard,
  PremiumPageHeader,
} from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Solutions by Workload | VectraCompute",
  description:
    "Find the right VectraCompute hardware for your workload: AI & deep learning, large-scale training and inference, or data science and engineering.",
}

export default function SolutionsPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Solutions by workload"
          title="Hardware paths organized around real AI bottlenecks"
          description="Every workload has a different constraint: VRAM, interconnect, CPU throughput, storage, power, or procurement. Start with the closest use case and move into matched systems and buying guidance."
          actions={[
            {
              label: "Shop workstations",
              href: "/categories/ai-deep-learning-workstations",
            },
            { label: "Shop GPU servers", href: "/categories/gpu-rack-servers" },
          ]}
          highlights={[
            "Workload-specific recommendations",
            "Internal links to matching products",
            "Engineering quote path built in",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 small:grid-cols-3 gap-5">
          {SOLUTIONS.map((solution) => (
            <PremiumCard
              key={solution.slug}
              title={solution.title}
              body={solution.tagline}
              href={`/solutions/${solution.slug}`}
              icon={
                solution.slug.includes("training") ? (
                  <Server />
                ) : solution.slug.includes("data") ? (
                  <SparklesMini />
                ) : (
                  <ShieldCheck />
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
