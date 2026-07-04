import { Heading, Text } from "@modules/common/components/ui"

const TRUST_ITEMS = [
  {
    title: "24-hour burn-in",
    body: "CPU, GPU, memory, storage, and thermals checked under sustained load.",
  },
  {
    title: "Engineer support",
    body: "Help with drivers, CUDA, frameworks, networking, and deployment.",
  },
  {
    title: "Warranty options",
    body: "Labor and parts coverage with advance replacement planning.",
  },
  {
    title: "Procurement ready",
    body: "Clear SKUs, configuration notes, approval support, and quote review.",
  },
]

const TrustBar = ({ compact = false }: { compact?: boolean }) => {
  return (
    <section
      className={
        compact
          ? "border border-ui-border-base rounded-md bg-white p-5"
          : "bg-grey-5 border-y border-ui-border-base py-12"
      }
    >
      <div className={compact ? "" : "content-container"}>
      {!compact && (
        <div className="mb-6">
          <Heading level="h2" className="text-xl mb-2">
            Trusted for AI infrastructure
          </Heading>
          <Text className="text-ui-fg-subtle max-w-2xl">
            Every system is sold with the practical proof technical buyers look
            for before committing to high-value AI hardware.
          </Text>
        </div>
      )}
      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-4">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className={
              compact
                ? ""
                : "rounded-md border border-ui-border-base bg-white p-4"
            }
          >
            <Heading level="h3" className="text-base mb-1">
              {item.title}
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6">
              {item.body}
            </Text>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

export default TrustBar
