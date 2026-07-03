import { Metadata } from "next"
import { CreditCard, Server, ShieldCheck } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Button, Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Financing for AI Workstations & GPU Servers | VectraCompute",
  description:
    "Flexible financing and leasing options for VectraCompute workstations and rack servers, including options for academic and research institutions.",
}

export default function FinancingPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Financing and procurement"
          title="Flexible buying paths for AI workstations and GPU servers"
          description="Get production AI hardware without slowing down purchasing. VectraCompute supports quote workflows, purchase orders, leasing conversations, and academic procurement needs."
          actions={[
            { label: "Talk to sales", href: "/contact" },
            { label: "Compare systems", href: "/compare" },
          ]}
          highlights={[
            "Net terms for qualified buyers",
            "Leasing paths for larger systems",
            "Academic and research support",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <article className="rounded-md border border-ui-border-base bg-white p-6 small:p-8 text-base-regular leading-7">
            <Text className="mb-5">
              A fully configured multi-GPU workstation or rack server is a
              meaningful capital expense. We offer financing and leasing paths
              so teams can get hardware in production without tying up cash
              that's better spent elsewhere.
            </Text>
            <Heading level="h2" className="text-xl mt-4">
              Options available
            </Heading>
            <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
              {[
                [
                  CreditCard,
                  "Net terms",
                  "Net-30 / Net-60 terms for established business accounts.",
                ],
                [
                  Server,
                  "Equipment leasing",
                  "12 to 36 month paths for workstation and rack deployments.",
                ],
                [
                  ShieldCheck,
                  "Institutional buying",
                  "Academic, research, lab, and PO-based ordering support.",
                ],
              ].map(([Icon, title, body]) => (
                <div
                  key={title as string}
                  className="rounded-md border border-ui-border-base bg-grey-5 p-4"
                >
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                    <Icon />
                  </span>
                  <Heading level="h3" className="text-base mb-1">
                    {title as string}
                  </Heading>
                  <Text className="text-small-regular text-ui-fg-subtle leading-6">
                    {body as string}
                  </Text>
                </div>
              ))}
            </div>
            <Text className="mt-5">
              Financing is handled on a case-by-case basis depending on order
              size and use case. Reach out with the configuration you're
              considering and our team will put together options within one
              business day.
            </Text>
            <div className="mt-2">
              <LocalizedClientLink href="/contact">
                <Button
                  variant="primary"
                  className="bg-brand-600 hover:bg-brand-700 border-none"
                >
                  Talk to Sales About Financing
                </Button>
              </LocalizedClientLink>
            </div>
          </article>
          <aside className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-4">
              Useful procurement links
            </Heading>
            <div className="grid grid-cols-1 gap-3 text-small-regular">
              {[
                [
                  "Enterprise procurement guide",
                  "/resources/enterprise-ai-procurement",
                ],
                [
                  "AI hardware buying guide",
                  "/resources/ai-hardware-buying-guide",
                ],
                ["Warranty and support", "/resources/warranty-support"],
                ["Compare systems", "/compare"],
                ["GPU rack servers", "/categories/gpu-rack-servers"],
              ].map(([label, href]) => (
                <LocalizedClientLink
                  key={href}
                  href={href}
                  className="rounded-md border border-ui-border-base bg-grey-5 px-3 py-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
