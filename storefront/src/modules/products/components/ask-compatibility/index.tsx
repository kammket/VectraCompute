"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"

// Two ways to get a compatibility answer: instant chat with the AI engineer,
// or send the details for human engineer review through the contact form
// (already prefilled with the product via query params).
const AskCompatibility = ({ productTitle }: { productTitle: string }) => {
  const openChat = () => {
    window.dispatchEvent(
      new CustomEvent("vectra:open-chat", {
        detail: {
          message: `Is the ${productTitle} compatible with my setup? `,
        },
      })
    )
  }

  const contactHref = `/contact?product=${encodeURIComponent(
    productTitle
  )}&constraints=${encodeURIComponent(
    `Compatibility review for ${productTitle}`
  )}`

  return (
    <div className="flex flex-col gap-2 medium:flex-row">
      <Button
        type="button"
        onClick={openChat}
        className="w-full bg-brand-600 hover:bg-brand-700 border-none medium:w-auto"
      >
        Chat with an AI engineer now
      </Button>
      <LocalizedClientLink href={contactHref} className="w-full medium:w-auto">
        <Button
          variant="secondary"
          className="w-full medium:w-auto"
        >
          Send details for review
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default AskCompatibility
