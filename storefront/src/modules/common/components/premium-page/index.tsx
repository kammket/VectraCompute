import { ReactNode } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"
import {
  ArrowRightMini,
  CheckCircle,
  Server,
  ShieldCheck,
} from "@medusajs/icons"

type PremiumPageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  actions?: { label: string; href: string }[]
  highlights?: string[]
}

export const PremiumPageHeader = ({
  eyebrow,
  title,
  description,
  actions = [],
  highlights = [],
}: PremiumPageHeaderProps) => {
  return (
    <section className="relative overflow-hidden rounded-md border border-grey-80 bg-grey-90 p-6 text-white shadow-elevation-card-rest small:p-8">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_42%),linear-gradient(135deg,transparent,rgba(255,255,255,0.05))]" />
      <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div className="relative z-10">
          <Text className="text-small-semi uppercase tracking-wide text-brand-200 mb-3">
            {eyebrow}
          </Text>
          <Heading level="h1" className="text-3xl leading-tight mb-4 text-white">
            {title}
          </Heading>
          <Text className="text-base-regular text-grey-20 leading-7 max-w-3xl">
            {description}
          </Text>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {actions.map((action, index) => (
                <LocalizedClientLink
                  key={action.href}
                  href={action.href}
                  className={
                    index === 0
                      ? "inline-flex h-10 items-center gap-2 rounded-md bg-brand-500 px-4 text-small-semi text-white hover:bg-brand-600"
                      : "inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 text-small-semi text-white hover:bg-white/15"
                  }
                >
                  {action.label}
                  <ArrowRightMini />
                </LocalizedClientLink>
              ))}
            </div>
          )}
        </div>
        {highlights.length > 0 && (
          <div className="relative z-10 grid grid-cols-1 gap-3">
            {highlights.map((item, index) => {
              const Icon =
                index === 0 ? ShieldCheck : index === 1 ? Server : CheckCircle

              return (
                <div
                  key={item}
                  className="grid grid-cols-[36px_1fr] items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3 backdrop-blur"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-700">
                    <Icon />
                  </span>
                  <Text className="text-small-semi text-white">
                    {item}
                  </Text>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export const PremiumCard = ({
  title,
  body,
  href,
  icon,
}: {
  title: string
  body: string
  href?: string
  icon?: ReactNode
}) => {
  const content = (
    <div className="flex h-full flex-col rounded-md border border-ui-border-base bg-white p-5 transition-shadow hover:shadow-elevation-card-hover">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
        {icon ?? <CheckCircle />}
      </div>
      <Heading level="h2" className="text-xl mb-2">
        {title}
      </Heading>
      <Text className="text-small-regular text-ui-fg-subtle leading-6">
        {body}
      </Text>
      {href && (
        <span className="mt-auto pt-5 inline-flex items-center gap-1 text-small-semi text-ui-fg-interactive">
          View details
          <ArrowRightMini />
        </span>
      )}
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <LocalizedClientLink href={href} className="block h-full">
      {content}
    </LocalizedClientLink>
  )
}
