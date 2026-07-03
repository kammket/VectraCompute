import { Metadata } from "next"

import CompareList from "@modules/compare/components/compare-list"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Compare AI Workstations & GPU Servers | VectraCompute",
  description:
    "Compare VectraCompute AI workstations, GPU rack servers, and components before requesting a quote or checking out.",
}

export default function ComparePage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-3xl mb-10">
        <Heading level="h1" className="text-3xl mb-3">
          Compare AI Hardware
        </Heading>
        <Text className="text-ui-fg-subtle text-lg leading-8">
          Build a shortlist of systems, review trust signals, and send the
          shortlist to VectraCompute for quote and configuration guidance.
        </Text>
      </div>
      <CompareList />
    </div>
  )
}
