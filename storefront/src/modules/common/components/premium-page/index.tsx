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
    <section className="rounded-md border border-ui-border-base bg-white p-6 small:p-8 shadow-elevation-card-rest">
      <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div>
          <Text className="text-small-semi uppercase tracking-wide text-brand-600 mb-3">
            {eyebrow}
          </Text>
          <Heading level="h1" className="text-3xl leading-tight mb-4">
            {title}
          </Heading>
          <Text className="text-base-regular text-ui-fg-subtle leading-7 max-w-3xl">
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
                      ? "inline-flex h-10 items-center gap-2 rounded-md bg-brand-600 px-4 text-small-semi text-white hover:bg-brand-700"
                      : "inline-flex h-10 items-center gap-2 rounded-md border border-ui-border-base px-4 text-small-semi text-ui-fg-base hover:bg-grey-5"
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
          <div className="grid grid-cols-1 gap-3">
            {highlights.map((item, index) => {
              const Icon =
                index === 0 ? ShieldCheck : index === 1 ? Server : CheckCircle

              return (
                <div
                  key={item}
                  className="grid grid-cols-[36px_1fr] items-center gap-3 rounded-md border border-ui-border-base bg-grey-5 p-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                    <Icon />
                  </span>
                  <Text className="text-small-semi text-ui-fg-base">
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
