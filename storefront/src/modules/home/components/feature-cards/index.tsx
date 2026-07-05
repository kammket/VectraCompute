import { CheckCircle, Server, ShieldCheck, SparklesMini } from "@medusajs/icons"
import { Heading, Text } from "@modules/common/components/ui"

const FEATURES = [
  {
    title: "Stress-tested before shipping",
    body: "Every system runs a 24-hour burn-in under full GPU and CPU load, with thermal validation across all configured cards, before it leaves our facility.",
  },
  {
    title: "Lifetime support",
    body: "Talk to engineers who can help with drivers, multi-GPU configuration, and cluster networking — not a ticket queue. Included with every system.",
  },
  {
    title: "Up to 5-year warranty",
    body: "Coverage on labor and parts, with an advance-replacement option so a hardware fault never stalls a multi-day training run.",
  },
  {
    title: "Built to order",
    body: "Configure GPU model and count, RAM, storage, and CPU platform to match your workload. We don't sell whichever card happens to be in stock.",
  },
  {
    title: "Ships ready to train",
    body: "Ubuntu, NVIDIA drivers, CUDA, cuDNN, and the common PyTorch/TensorFlow stack are pre-installed and validated. Power on and start training.",
  },
  {
    title: "Fast build times",
    body: "Most configurations build and ship within 3–7 business days, with white-glove express options when you need hardware in production sooner.",
  },
]

const FeatureCards = () => {
  return (
    <section className="bg-grey-5 border-y border-ui-border-base">
      <div className="content-container py-8 small:py-14">
      <div className="grid grid-cols-1 large:grid-cols-[320px_1fr] gap-8 items-start">
        <div className="rounded-md border border-grey-80 bg-grey-90 p-6 text-white">
          <Text className="text-small-semi uppercase text-brand-200 mb-2">
            Trust signals
          </Text>
          <Heading level="h2" className="text-2xl mb-2 text-white">
            Built for serious AI teams
          </Heading>
          <Text className="text-grey-20">
            Clear validation, support, warranty, and deployment expectations
            make high-value AI hardware easier to approve.
          </Text>
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-4">
          {FEATURES.map((f, index) => {
            const Icon =
              index === 0
                ? ShieldCheck
                : index === 1
                ? Server
                : index === 2
                ? SparklesMini
                : index === 3
                ? CheckCircle
                : CheckCircle

            return (
              <div
                key={f.title}
                className="border border-ui-border-base rounded-md p-5 bg-white min-h-[220px] shadow-elevation-card-rest transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevation-card-hover"
              >
                <div className="w-10 h-10 rounded-md bg-brand-50 border border-brand-200 mb-4 flex items-center justify-center text-brand-700">
                  <Icon />
                </div>
                <Heading level="h3" className="text-base mb-2">
                  {f.title}
                </Heading>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {f.body}
                </Text>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </section>
  )
}

export default FeatureCards
