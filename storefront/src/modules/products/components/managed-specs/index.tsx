import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

const SPEC_FIELDS = [
  ["lead_time", "Lead time"],
  ["warranty", "Warranty"],
  ["power_draw", "Power draw"],
  ["rack_units", "Rack units"],
  ["gpu_memory", "GPU memory"],
  ["cpu_platform", "CPU platform"],
  ["networking", "Networking"],
  ["support_level", "Support level"],
] as const

const ManagedSpecs = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const metadata = product.metadata as
    | Record<string, unknown>
    | null
    | undefined
  const specs: { key: string; label: string; value: string }[] = []

  SPEC_FIELDS.forEach(([key, label]) => {
    const value = metadata?.[key]
    if (typeof value === "string" && value.trim()) {
      specs.push({ key, label, value: value.trim() })
    }
  })

  if (!specs.length) {
    return null
  }

  return (
    <section
      id="deployment-details"
      className="rounded-md border border-ui-border-base bg-grey-5 p-5 small:p-6 scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-5">
        <div>
          <Text className="text-small-semi uppercase text-brand-700 mb-2">
            Operational details
          </Text>
          <Heading level="h2" className="text-xl mb-2">
            Deployment details
          </Heading>
          <Text className="text-ui-fg-subtle text-small-regular leading-6">
            These fields are managed from product metadata in the admin
            dashboard so buyers see current operational details.
          </Text>
        </div>
        <dl className="grid grid-cols-1 gap-3">
          {specs.map((spec) => (
            <div
              key={spec.key}
              className="border border-ui-border-base rounded-md p-4 bg-white"
            >
              <dt className="text-small-regular text-ui-fg-subtle mb-1">
                {spec.label}
              </dt>
              <dd className="text-base-semi text-ui-fg-base">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default ManagedSpecs
