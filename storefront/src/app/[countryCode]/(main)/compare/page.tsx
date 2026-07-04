import { Metadata } from "next"

import CompareList from "@modules/compare/components/compare-list"
import { PremiumPageHeader } from "@modules/common/components/premium-page"

export const metadata: Metadata = {
  title: "Compare AI Workstations & GPU Servers | VectraCompute",
  description:
    "Compare VectraCompute AI workstations, GPU rack servers, and components before requesting a quote or checking out.",
}

export default function ComparePage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Compare systems"
          title="Compare AI hardware by workload, trust signals, and fit"
          description="Build a shortlist of workstations, GPU servers, edge systems, storage, networking, and upgrade hardware. Use the comparison to review technical fit before requesting engineering guidance."
          actions={[
            { label: "Shop products", href: "/store" },
            { label: "Ask an expert", href: "/contact" },
          ]}
          highlights={[
            "Shortlist high-value systems",
            "Review validation and support",
            "Confirm workload fit",
          ]}
        />
        <div className="mt-8 rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest small:p-6">
          <CompareList />
        </div>
      </div>
    </div>
  )
}
