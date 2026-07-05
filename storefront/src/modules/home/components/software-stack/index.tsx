import { CheckCircleMiniSolid } from "@medusajs/icons"
import { Heading, Text } from "@modules/common/components/ui"

const STACK = [
  "Ubuntu LTS",
  "NVIDIA Drivers",
  "CUDA",
  "cuDNN",
  "Docker",
  "PyTorch",
  "TensorFlow",
  "Hugging Face Transformers",
  "vLLM",
  "Ollama",
  "JupyterLab",
  "Anaconda",
]

const SoftwareStack = () => {
  return (
    <section className="bg-grey-90 text-white border-y border-grey-80">
      <div className="content-container py-8 small:py-14">
        <div className="grid grid-cols-1 large:grid-cols-[360px_1fr] gap-8 items-start">
          <div>
            <Text className="text-small-semi uppercase text-brand-200 mb-2">
              Software validation
            </Text>
            <Heading level="h2" className="text-2xl text-white mb-3">
              Ships ready to train
            </Heading>
            <Text className="text-grey-20 leading-7">
              Every VectraCompute system arrives with a validated AI software
              stack pre-installed — operating system, GPU drivers, and the
              frameworks your team already uses. No driver troubleshooting, no
              CUDA version mismatches. Power on and run your first job.
            </Text>
          </div>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-2.5">
            {STACK.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-small-regular text-grey-10"
              >
                <CheckCircleMiniSolid className="text-brand-200" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SoftwareStack
