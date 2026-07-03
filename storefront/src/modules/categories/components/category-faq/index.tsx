import { Heading } from "@modules/common/components/ui"

type QA = { q: string; a: string }

// Per-category FAQ copy. Falls back to a general set for categories added later in
// Medusa Admin. The FAQPage JSON-LD makes these eligible for rich results, and the
// on-page text adds substantive, keyword-relevant content for ranking.
const FAQ_BY_HANDLE: Record<string, QA[]> = {
  "ai-deep-learning-workstations": [
    {
      q: "What GPU should I choose for a deep learning workstation?",
      a: "Size VRAM to your largest model and batch size first. An RTX 4090 (24GB) is the best price-per-GB option for fine-tuning and mid-size models; step up to the RTX 5090 (32GB) or RTX 6000 Ada (48GB, ECC) when you're VRAM-constrained or running long unattended training jobs.",
    },
    {
      q: "Can I run multiple GPUs in one workstation?",
      a: "Yes. Our VectraForge workstations scale from a single GPU up to four GPUs in a desktop chassis, with NVLink-ready options and isolated thermal zones for sustained multi-GPU training.",
    },
    {
      q: "Does the workstation come ready to train?",
      a: "Every system ships with Ubuntu, NVIDIA drivers, CUDA, cuDNN, Docker, and the common PyTorch/TensorFlow stack pre-installed and validated, after a 24-hour burn-in test.",
    },
  ],
  "gpu-rack-servers": [
    {
      q: "When should I move from a workstation to a GPU rack server?",
      a: "Move to a rack server when you need more than four GPUs, multi-node networking (100GbE) for distributed training, or server-grade redundancy for production inference. Below that, a multi-GPU workstation is usually more cost-effective.",
    },
    {
      q: "Which data center GPUs do you offer?",
      a: "Our VectraRack servers support NVIDIA H100 and H200 for training, and L40S for inference and edge deployment, in 4 to 8 GPU configurations with NVSwitch fabric.",
    },
    {
      q: "Do you offer liquid-cooled servers?",
      a: "Yes. The VectraRack R8 Liquid is a liquid-cooled 8-GPU training server built for high-density racks and sustained full-load operation in warmer data center environments.",
    },
  ],
}

const DEFAULT_FAQ: QA[] = [
  {
    q: "Are systems built to order?",
    a: "Yes. Every VectraCompute system is configured to your specification, assembled, and stress-tested under full load before it ships.",
  },
  {
    q: "What warranty and support is included?",
    a: "Systems include lifetime technical support and a warranty of up to 5 years on labor and 3 years on parts, with an advance-replacement option.",
  },
  {
    q: "How long does it take to ship?",
    a: "Most configurations build and ship within 3–7 business days, with white-glove express options when you need hardware sooner.",
  },
]

const CategoryFaq = ({ handle }: { handle?: string }) => {
  const faqs = (handle && FAQ_BY_HANDLE[handle]) || DEFAULT_FAQ

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <section className="border-t border-ui-border-base mt-12 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Heading level="h2" className="text-xl mb-6">
        Frequently asked questions
      </Heading>
      <div className="flex flex-col gap-6 max-w-3xl">
        {faqs.map((f) => (
          <div key={f.q}>
            <Heading level="h3" className="text-base mb-1">
              {f.q}
            </Heading>
            <p className="text-small-regular text-ui-fg-subtle leading-6">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryFaq
