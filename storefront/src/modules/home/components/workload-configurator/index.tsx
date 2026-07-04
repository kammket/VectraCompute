"use client"

import { useMemo, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

type WorkloadKey = "llm" | "vision" | "data" | "inference" | "rag"
type ScaleKey = "starter" | "team" | "rack"
type BudgetKey = "under10" | "mid" | "enterprise" | "notSure"
type DeploymentKey = "office" | "lab" | "rack" | "edge"
type ModelSizeKey = "small" | "medium" | "large" | "frontier" | "unknown"
type DataSizeKey = "light" | "growing" | "heavy" | "video"
type ConditionKey = "new" | "refurbished" | "either"
type UrgencyKey = "now" | "month" | "planning"

const WORKLOADS: {
  key: WorkloadKey
  label: string
  description: string
}[] = [
  {
    key: "llm",
    label: "LLM fine-tuning",
    description: "Open-weight models, LoRA runs, RAG experiments, agents",
  },
  {
    key: "vision",
    label: "Vision & generative AI",
    description: "Diffusion, video, image models, simulation and rendering",
  },
  {
    key: "data",
    label: "Data science",
    description: "Large notebooks, preprocessing, CPU-heavy pipelines",
  },
  {
    key: "inference",
    label: "Inference service",
    description: "vLLM, Ollama, private model serving, batch jobs",
  },
  {
    key: "rag",
    label: "Private RAG",
    description: "Document AI, embeddings, vector search, secure local data",
  },
]

const SCALES: {
  key: ScaleKey
  label: string
  description: string
}[] = [
  {
    key: "starter",
    label: "One developer",
    description: "Compact local AI box or single-GPU workstation",
  },
  {
    key: "team",
    label: "Small team",
    description: "Multi-GPU tower with more VRAM, RAM and storage",
  },
  {
    key: "rack",
    label: "Lab or production",
    description: "Rack GPU server with redundant power and networking",
  },
]

const BUDGETS: {
  key: BudgetKey
  label: string
  description: string
}[] = [
  {
    key: "under10",
    label: "Under $10k",
    description: "Workstations, starter kits, and focused local AI builds",
  },
  {
    key: "mid",
    label: "$10k - $50k",
    description: "High-VRAM workstations, inference appliances, small servers",
  },
  {
    key: "enterprise",
    label: "$50k+",
    description: "Multi-GPU rack servers, clusters, storage, and networking",
  },
  {
    key: "notSure",
    label: "Need guidance",
    description: "Use workload fit first and let an engineer size the budget",
  },
]

const DEPLOYMENTS: {
  key: DeploymentKey
  label: string
  description: string
}[] = [
  {
    key: "office",
    label: "Office / desk-side",
    description: "Noise, heat, and standard power matter",
  },
  {
    key: "lab",
    label: "Shared lab",
    description: "Multi-user access, support, and validation matter",
  },
  {
    key: "rack",
    label: "Rack / datacenter",
    description: "Power, cooling, rails, networking, and uptime matter",
  },
  {
    key: "edge",
    label: "Edge site",
    description: "Small footprint, camera/robotics inputs, and remote support",
  },
]

const MODEL_SIZES: {
  key: ModelSizeKey
  label: string
  description: string
}[] = [
  {
    key: "small",
    label: "7B-13B",
    description: "Small LLMs, agents, embeddings, local testing",
  },
  {
    key: "medium",
    label: "34B-70B",
    description: "Serious local inference, RAG, larger fine-tunes",
  },
  {
    key: "large",
    label: "120B+ / long context",
    description: "High-memory inference, multi-GPU, RAG at scale",
  },
  {
    key: "frontier",
    label: "Cluster / frontier",
    description: "Multi-node training, rack planning, fabric and cooling",
  },
  {
    key: "unknown",
    label: "Not sure",
    description: "Use workload and deployment constraints first",
  },
]

const DATA_SIZES: {
  key: DataSizeKey
  label: string
  description: string
}[] = [
  {
    key: "light",
    label: "Light data",
    description: "Notebooks, small document sets, local experiments",
  },
  {
    key: "growing",
    label: "Growing data",
    description: "Team datasets, embeddings, checkpoints, shared projects",
  },
  {
    key: "heavy",
    label: "Heavy storage",
    description: "Large RAG indexes, model checkpoints, NVMe-heavy work",
  },
  {
    key: "video",
    label: "Video / cameras",
    description: "Multi-camera streams, retention, vision analytics",
  },
]

const CONDITIONS: {
  key: ConditionKey
  label: string
  description: string
}[] = [
  {
    key: "new",
    label: "New hardware",
    description:
      "Best for warranty, availability planning, and enterprise buys",
  },
  {
    key: "refurbished",
    label: "Validated refurbished",
    description: "Best for budget control with burn-in and condition notes",
  },
  {
    key: "either",
    label: "Either",
    description: "Show the best technical fit first",
  },
]

const URGENCIES: {
  key: UrgencyKey
  label: string
  description: string
}[] = [
  {
    key: "now",
    label: "Need it soon",
    description: "Prefer in-stock, refurb, and simpler deployment paths",
  },
  {
    key: "month",
    label: "2-6 weeks",
    description: "Built-to-order systems and validation are acceptable",
  },
  {
    key: "planning",
    label: "Planning / quote",
    description: "Optimize architecture, power, cooling, and procurement",
  },
]

const getStoreHref = (
  workload: WorkloadKey,
  scale: ScaleKey,
  budget: BudgetKey,
  deployment: DeploymentKey,
  modelSize: ModelSizeKey,
  dataSize: DataSizeKey,
  condition: ConditionKey
) => {
  const params = new URLSearchParams()

  if (workload === "llm") params.set("workload", "local-llm")
  if (workload === "rag") params.set("workload", "rag")
  if (workload === "vision") params.set("workload", "vision")
  if (workload === "inference") params.set("workload", "inference")
  if (workload === "data") params.set("workload", "storage")

  if (modelSize === "frontier") {
    params.set("infrastructure", "next-gen-rack")
  } else if (dataSize === "heavy") {
    params.set("infrastructure", "memory-storage")
  } else if (scale === "rack" || deployment === "rack") {
    params.set("formFactor", "rack-server")
  } else if (deployment === "edge") {
    params.set("infrastructure", "edge-robotics")
  } else {
    params.set("formFactor", "workstation")
  }

  if (budget === "under10") params.set("budget", "under-10k")
  if (budget === "mid") params.set("budget", "10k-25k")
  if (budget === "enterprise") params.set("budget", "50k-plus")
  if (condition !== "either") params.set("condition", condition)

  const query = params.toString()
  return `/store${query ? `?${query}` : ""}`
}

const quoteHref = ({
  workload,
  scale,
  budget,
  deployment,
  constraints,
  details,
}: {
  workload: string
  scale: string
  budget: string
  deployment: string
  constraints: string
  details?: string[]
}) => {
  const message = [
    "I used the AI system selector and want an engineer to review this recommendation.",
    `Workload: ${workload}`,
    `Scale: ${scale}`,
    `Budget: ${budget}`,
    `Deployment: ${deployment}`,
    constraints,
    ...(details ?? []),
  ].join("\n")

  const params = new URLSearchParams({
    workload,
    scale,
    budget,
    deployment,
    constraints: [
      constraints,
      `Deployment: ${deployment}`,
      ...(details ?? []),
    ].join(". "),
    message,
  })

  return `/contact?${params.toString()}`
}

const getRecommendation = (
  workload: WorkloadKey,
  scale: ScaleKey,
  budget: BudgetKey,
  deployment: DeploymentKey,
  modelSize: ModelSizeKey,
  dataSize: DataSizeKey,
  condition: ConditionKey
) => {
  const storeHref = getStoreHref(
    workload,
    scale,
    budget,
    deployment,
    modelSize,
    dataSize,
    condition
  )

  if (workload === "llm" && scale === "starter") {
    return {
      title: "High-VRAM AI workstation",
      href: "/categories/ai-deep-learning-workstations",
      storeHref,
      quoteHref: quoteHref({
        workload: "LLM fine-tuning",
        scale: "One developer",
        budget: budget === "under10" ? "Under $10k" : "Need guidance",
        deployment,
        constraints:
          "Need help choosing VRAM, RAM, storage, and software stack",
      }),
      category: "VectraForge local AI systems",
      products: [
        {
          title: "RTX 5090 AI Workstation",
          href: "/products/vectraforge-rtx-5090-ai-workstation",
          reason: "Best first stop for local LLM inference and prototyping",
        },
        {
          title: "Budget VRAM 128GB",
          href: "/products/vectraforge-budget-vram-128gb",
          reason: "Good when aggregate VRAM matters more than flagship GPU",
        },
      ],
      specs: [
        "24GB-96GB VRAM",
        "64GB-256GB RAM",
        "Fast NVMe scratch",
        "CUDA stack review",
      ],
      questions: [
        "What model size do you need to run locally?",
        "Do you need fine-tuning, inference, or both?",
        "Will the system sit in an office or lab?",
      ],
      rationale:
        "Best when a technical user needs private local iteration, model testing, notebooks, embeddings, and fast experimentation before moving jobs to shared infrastructure.",
    }
  }

  if (workload === "rag") {
    return {
      title: "Private RAG appliance or storage-backed inference node",
      href: "/products/vectrarag-private-ai-appliance",
      storeHref,
      quoteHref: quoteHref({
        workload: "Private RAG",
        scale: scale === "rack" ? "Production service" : "Small team",
        budget: budget === "enterprise" ? "$50k+" : "Need guidance",
        deployment,
        constraints:
          "Need document volume, vector database, storage, backup, and security review",
      }),
      category: "VectraRAG and NVMe AI data systems",
      products: [
        {
          title: "Private RAG Appliance",
          href: "/products/vectrarag-private-ai-appliance",
          reason: "Most direct fit for sensitive document AI",
        },
        {
          title: "Legal AI Appliance",
          href: "/products/vectrarag-legal-ai-appliance",
          reason: "Built around contract review and private document search",
        },
        {
          title: "Vector Database Server",
          href: "/products/vectravector-database-server",
          reason: "Useful when embeddings and indexes dominate the workload",
        },
      ],
      specs: [
        "Local document AI",
        "Vector database planning",
        "30TB-60TB NVMe options",
        "Private deployment review",
      ],
      questions: [
        "How much document data needs to be indexed?",
        "Does data need to stay fully on-prem?",
        "Which users, apps, or identity systems will connect?",
      ],
      rationale:
        "Best when the buying decision is not just GPU size. Private RAG projects need storage, embeddings, backup, access control, and deployment planning around sensitive data.",
    }
  }

  if (scale === "rack" || workload === "inference") {
    return {
      title: "GPU rack server",
      href: "/categories/gpu-rack-servers",
      storeHref,
      quoteHref: quoteHref({
        workload: "Private inference",
        scale: "Production service",
        budget: budget === "enterprise" ? "$50k+" : "$10k - $50k",
        deployment,
        constraints:
          "Need rack, power, cooling, networking, and deployment review",
      }),
      category: "VectraRack systems",
      products: [
        {
          title: "Refurbished L40S Inference Server",
          href: "/products/vectrarack-refurb-l40s-inference-server",
          reason: "Strong fit for production inference on a controlled budget",
        },
        {
          title: "Refurbished A100 Server",
          href: "/products/vectrarack-refurb-a100-server",
          reason: "High-VRAM option for labs, startups, and training jobs",
        },
        {
          title: "Local LLM Inference Appliance",
          href: "/products/vectralocal-llm-inference-appliance",
          reason: "Appliance route for private model serving",
        },
      ],
      specs: [
        "4-8 GPUs",
        "100GbE options",
        "Redundant power",
        "Remote deployment",
      ],
      questions: [
        "How many users or requests will share the server?",
        "Do you have rack power, cooling, rails, and network ready?",
        "Will this connect to shared storage or a cluster fabric?",
      ],
      rationale:
        "Best when uptime, shared access, networking, and sustained full-load thermals matter more than desk-side convenience.",
    }
  }

  if (workload === "data") {
    return {
      title: "CPU-platform workstation",
      href: "/categories/workstations-by-cpu-platform",
      storeHref,
      quoteHref: quoteHref({
        workload: "Data science",
        scale: "Small team",
        budget: budget === "under10" ? "Under $10k" : "$10k - $50k",
        deployment,
        constraints: "Need CPU, memory, PCIe, and storage sizing",
      }),
      category: "Threadripper PRO, EPYC or Xeon W builds",
      products: [
        {
          title: "CPU-platform workstations",
          href: "/categories/workstations-by-cpu-platform",
          reason: "Best when preprocessing, RAM, and PCIe lanes are limiting",
        },
        {
          title: "500TB NVMe AI Storage Server",
          href: "/products/vectrastore-500tb-nvme-ai-storage-server",
          reason: "For larger datasets, checkpoints, and shared AI storage",
        },
      ],
      specs: [
        "High memory bandwidth",
        "More PCIe lanes",
        "ECC memory options",
        "Mixed CPU/GPU pipelines",
      ],
      questions: [
        "Is the bottleneck CPU preprocessing, memory, storage, or GPU?",
        "How large are the datasets in RAM and on disk?",
        "Do you need ECC memory or many PCIe devices?",
      ],
      rationale:
        "Best when the bottleneck is preprocessing, simulation, large in-memory datasets, or feeding GPUs efficiently.",
    }
  }

  return {
    title:
      scale === "team"
        ? "Multi-GPU AI workstation"
        : "AI development workstation",
    href: "/categories/ai-deep-learning-workstations",
    storeHref,
    quoteHref: quoteHref({
      workload: workload === "vision" ? "Computer vision" : "LLM fine-tuning",
      scale: scale === "team" ? "Small team" : "One developer",
      budget: budget === "enterprise" ? "$50k+" : "$10k - $50k",
      deployment,
      constraints: "Need GPU, VRAM, RAM, NVMe, and upgrade-path review",
    }),
    category: "VectraForge workstations",
    products: [
      {
        title: "Dual RTX 5090 Workstation",
        href: "/products/vectraforge-dual-rtx-5090-workstation",
        reason: "Good for multi-GPU development and visual AI",
      },
      {
        title: "RTX PRO 6000 Studio",
        href: "/products/vectraforge-rtx-pro-6000-studio",
        reason: "Better when professional VRAM and reliability matter",
      },
      {
        title: "Camera AI Server",
        href: "/products/vectraedge-camera-ai-server",
        reason: "Best fit if vision runs near camera feeds or edge sites",
      },
    ],
    specs:
      scale === "team"
        ? [
            "2-4 GPUs",
            "256GB+ RAM",
            "Large NVMe scratch",
            "CUDA stack installed",
          ]
        : [
            "Single RTX GPU",
            "64-128GB RAM",
            "Fast NVMe storage",
            "Quiet tower options",
          ],
    questions: [
      "How much VRAM does your model or image pipeline need?",
      "Will multiple people share the workstation?",
      "Do you need Windows, Linux, or a container-first setup?",
    ],
    rationale:
      "Best for local experimentation, fine-tuning, data prep, notebooks, and fast iteration before scaling to a server.",
  }
}

type Recommendation = ReturnType<typeof getRecommendation>

const labelFor = <T extends string>(
  items: { key: T; label: string }[],
  key: T
) => items.find((item) => item.key === key)?.label ?? key

const enhanceRecommendation = (
  base: Recommendation,
  options: {
    workload: WorkloadKey
    scale: ScaleKey
    budget: BudgetKey
    deployment: DeploymentKey
    modelSize: ModelSizeKey
    dataSize: DataSizeKey
    condition: ConditionKey
    urgency: UrgencyKey
  }
) => {
  const {
    workload,
    scale,
    budget,
    deployment,
    modelSize,
    dataSize,
    condition,
    urgency,
  } = options

  let fitScore = 78
  const tradeoffs: string[] = []
  const accessories: { title: string; href: string; reason: string }[] = []

  if (modelSize === "large") {
    fitScore += scale === "rack" || budget === "enterprise" ? 10 : -8
    accessories.push({
      title: "H200 NVL inference appliance",
      href: "/products/vectrarack-h200-nvl-inference-appliance",
      reason: "Useful when long context or KV-cache memory becomes the limiter",
    })
  }

  if (modelSize === "frontier") {
    fitScore += deployment === "rack" ? 8 : -18
    accessories.push({
      title: "GB300 NVL72 quote-ready rack",
      href: "/products/vectrarack-gb300-nvl72-quote-ready-rack",
      reason: "Enterprise path for rack-scale training and inference planning",
    })
    accessories.push({
      title: "60kW AI rack PDU kit",
      href: "/products/vectrapower-60kw-ai-rack-pdu-kit",
      reason: "Power planning is mandatory before dense next-gen GPU racks",
    })
  }

  if (dataSize === "heavy") {
    fitScore += workload === "rag" || workload === "data" ? 8 : 2
    accessories.push({
      title: "120TB NVMe dataset expansion kit",
      href: "/products/vectrastore-120tb-nvme-dataset-expansion-kit",
      reason: "Adds fast local space for datasets, checkpoints, and indexes",
    })
    accessories.push({
      title: "1TB DDR5 ECC AI memory kit",
      href: "/products/vectramem-1tb-ddr5-ecc-ai-memory-kit",
      reason: "Helps RAG, vector search, and preprocessing pipelines breathe",
    })
  }

  if (dataSize === "video" || deployment === "edge") {
    fitScore += workload === "vision" ? 10 : 0
    accessories.push({
      title: "Jetson Thor robotics AI kit",
      href: "/products/vectrajetson-thor-robotics-ai-kit",
      reason: "Best for robotics, physical AI, and sensor-heavy edge sites",
    })
    accessories.push({
      title: "AI video analytics server",
      href: "/products/vectravision-ai-video-analytics-server",
      reason: "Better fit when camera count, retention, and latency matter",
    })
  }

  if (deployment === "rack") {
    accessories.push({
      title: "CDU liquid cooling package",
      href: "/products/vectracool-cdu-liquid-cooling-package",
      reason: "Review cooling before dense H200, B200, or GB300 deployments",
    })
    accessories.push({
      title: "GPU server monitoring appliance",
      href: "/products/vectraops-gpu-server-monitoring-appliance",
      reason: "Adds visibility into thermals, power, storage, and uptime",
    })
  }

  if (budget === "under10" && (modelSize === "large" || scale === "rack")) {
    fitScore -= 14
    tradeoffs.push(
      "Budget is tight for the selected scale. Consider validated refurbished hardware or reduce model size."
    )
  }

  if (condition === "refurbished") {
    accessories.push({
      title: "Refurbished AI server bundle",
      href: "/products/vectralease-refurbished-ai-server-bundle",
      reason: "Good route when warranty-backed budget control is important",
    })
  }

  if (urgency === "now") {
    fitScore -= modelSize === "frontier" ? 12 : 0
    tradeoffs.push(
      "Urgent timelines favor simpler workstations, validated refurbished stock, or smaller server configurations."
    )
  }

  if (deployment === "office" && scale === "rack") {
    fitScore -= 10
    tradeoffs.push(
      "Rack servers are rarely ideal in normal offices without noise, power, airflow, and service-access planning."
    )
  }

  if (!tradeoffs.length) {
    tradeoffs.push(
      "Final choice should still confirm software stack, model size, power, cooling, and lead time before purchase."
    )
  }

  const boundedScore = Math.max(42, Math.min(96, fitScore))
  const fitLabel =
    boundedScore >= 88
      ? "Strong fit"
      : boundedScore >= 72
      ? "Good fit"
      : "Needs engineering review"

  const details = [
    `Model size: ${labelFor(MODEL_SIZES, modelSize)}`,
    `Data profile: ${labelFor(DATA_SIZES, dataSize)}`,
    `Condition preference: ${labelFor(CONDITIONS, condition)}`,
    `Urgency: ${labelFor(URGENCIES, urgency)}`,
  ]

  return {
    ...base,
    fitScore: boundedScore,
    fitLabel,
    accessories: accessories.slice(0, 4),
    tradeoffs,
    comparison: [
      {
        label: "Lower-cost path",
        value:
          condition === "new"
            ? "Consider smaller GPU count first"
            : "Validated refurbished A100, H100, H200, or L40S",
      },
      {
        label: "Recommended path",
        value: base.title,
      },
      {
        label: "More scalable path",
        value:
          deployment === "rack" || modelSize === "frontier"
            ? "Rack-level cluster, high-speed fabric, PDU, cooling, monitoring"
            : "Move from workstation to GPU server when users or uptime grow",
      },
    ],
    quoteHref: quoteHref({
      workload: labelFor(WORKLOADS, workload),
      scale: labelFor(SCALES, scale),
      budget: labelFor(BUDGETS, budget),
      deployment: labelFor(DEPLOYMENTS, deployment),
      constraints: `Recommended path: ${base.title}. Fit score: ${boundedScore}% (${fitLabel})`,
      details,
    }),
  }
}

const WorkloadConfigurator = () => {
  const [workload, setWorkload] = useState<WorkloadKey>("llm")
  const [scale, setScale] = useState<ScaleKey>("team")
  const [budget, setBudget] = useState<BudgetKey>("mid")
  const [deployment, setDeployment] = useState<DeploymentKey>("lab")
  const [modelSize, setModelSize] = useState<ModelSizeKey>("medium")
  const [dataSize, setDataSize] = useState<DataSizeKey>("growing")
  const [condition, setCondition] = useState<ConditionKey>("either")
  const [urgency, setUrgency] = useState<UrgencyKey>("month")

  const recommendation = useMemo(
    () =>
      enhanceRecommendation(
        getRecommendation(
          workload,
          scale,
          budget,
          deployment,
          modelSize,
          dataSize,
          condition
        ),
        {
          workload,
          scale,
          budget,
          deployment,
          modelSize,
          dataSize,
          condition,
          urgency,
        }
      ),
    [
      workload,
      scale,
      budget,
      deployment,
      modelSize,
      dataSize,
      condition,
      urgency,
    ]
  )

  return (
    <section className="bg-grey-5 border-y border-ui-border-base">
      <div className="content-container py-14 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
        <div>
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            Guided buying
          </Text>
          <Heading level="h2" className="text-2xl mb-2">
            Find the right AI system faster
          </Heading>
          <Text className="text-ui-fg-subtle max-w-2xl mb-8">
            Match your workload to a practical starting configuration before you
            compare every GPU, CPU platform, chassis, storage layout, and
            networking option.
          </Text>

          <div className="grid grid-cols-1 medium:grid-cols-2 gap-5">
            <div>
              <Text className="text-base-semi mb-3">Workload</Text>
              <div className="grid grid-cols-1 gap-3">
                {WORKLOADS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setWorkload(item.key)}
                    className={`min-h-[96px] text-left border rounded-md p-4 transition-colors ${
                      workload === item.key
                        ? "border-brand-600 bg-brand-50"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Scale</Text>
              <div className="grid grid-cols-1 gap-3">
                {SCALES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setScale(item.key)}
                    className={`min-h-[96px] text-left border rounded-md p-4 transition-colors ${
                      scale === item.key
                        ? "border-grey-90 bg-grey-10"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Budget</Text>
              <div className="grid grid-cols-1 gap-3">
                {BUDGETS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setBudget(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      budget === item.key
                        ? "border-brand-600 bg-brand-50"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Deployment</Text>
              <div className="grid grid-cols-1 gap-3">
                {DEPLOYMENTS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setDeployment(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      deployment === item.key
                        ? "border-grey-90 bg-grey-10"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Model size</Text>
              <div className="grid grid-cols-1 gap-3">
                {MODEL_SIZES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setModelSize(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      modelSize === item.key
                        ? "border-brand-600 bg-brand-50"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Data profile</Text>
              <div className="grid grid-cols-1 gap-3">
                {DATA_SIZES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setDataSize(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      dataSize === item.key
                        ? "border-grey-90 bg-grey-10"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Condition preference</Text>
              <div className="grid grid-cols-1 gap-3">
                {CONDITIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCondition(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      condition === item.key
                        ? "border-brand-600 bg-brand-50"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Text className="text-base-semi mb-3">Timeline</Text>
              <div className="grid grid-cols-1 gap-3">
                {URGENCIES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setUrgency(item.key)}
                    className={`min-h-[88px] text-left border rounded-md p-4 transition-colors ${
                      urgency === item.key
                        ? "border-grey-90 bg-grey-10"
                        : "border-ui-border-base bg-white hover:bg-grey-5"
                    }`}
                  >
                    <span className="block text-base-semi">{item.label}</span>
                    <span className="block text-small-regular text-ui-fg-subtle mt-1">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="border border-ui-border-base rounded-md bg-white p-6 shadow-elevation-card-rest">
          <Text className="text-small-regular text-ui-fg-muted mb-2">
            Recommended starting point
          </Text>
          <Heading level="h3" className="text-xl mb-1">
            {recommendation.title}
          </Heading>
          <Text className="text-ui-fg-subtle text-small-regular mb-5">
            {recommendation.category}
          </Text>

          <div className="mb-5 rounded-md border border-brand-200 bg-brand-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Text className="text-small-semi uppercase text-brand-700 mb-1">
                  {recommendation.fitLabel}
                </Text>
                <Text className="text-small-regular leading-6 text-brand-900">
                  Scored against workload, model size, deployment, budget, data,
                  timeline, and condition preference.
                </Text>
              </div>
              <div className="shrink-0 rounded-md bg-white px-3 py-2 text-center shadow-sm">
                <span className="block text-xl-semi text-brand-700">
                  {recommendation.fitScore}%
                </span>
                <span className="text-xsmall-regular text-ui-fg-subtle">
                  fit
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 text-small-regular">
            {[
              ["Model", labelFor(MODEL_SIZES, modelSize)],
              ["Data", labelFor(DATA_SIZES, dataSize)],
              ["Condition", labelFor(CONDITIONS, condition)],
              ["Timeline", labelFor(URGENCIES, urgency)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-ui-border-base bg-grey-5 p-3"
              >
                <span className="block text-xsmall-regular uppercase text-ui-fg-muted">
                  {label}
                </span>
                <span className="mt-1 block text-small-semi text-ui-fg-base">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {recommendation.specs.map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 rounded-full bg-grey-10 text-grey-70 text-xs"
              >
                {spec}
              </span>
            ))}
          </div>

          <Text className="text-small-regular leading-6 mb-6">
            {recommendation.rationale}
          </Text>

          <div className="rounded-md border border-ui-border-base bg-grey-5 p-4 mb-6">
            <Text className="text-base-semi mb-3">Tradeoffs to confirm</Text>
            <ul className="grid grid-cols-1 gap-2 text-small-regular text-ui-fg-subtle">
              {recommendation.tradeoffs.map((tradeoff) => (
                <li key={tradeoff} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-grey-60 shrink-0" />
                  <span>{tradeoff}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-ui-border-base bg-grey-5 p-4 mb-6">
            <Text className="text-base-semi mb-3">
              Questions to answer before buying
            </Text>
            <ul className="grid grid-cols-1 gap-2 text-small-regular text-ui-fg-subtle">
              {recommendation.questions.map((question) => (
                <li key={question} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-ui-border-base bg-white p-4 mb-6">
            <Text className="text-base-semi mb-3">Suggested shortlist</Text>
            <div className="grid grid-cols-1 gap-3">
              {recommendation.products.map((product) => (
                <LocalizedClientLink
                  key={product.href}
                  href={product.href}
                  className="rounded-md border border-ui-border-base bg-grey-5 p-3 hover:bg-white"
                >
                  <span className="block text-small-semi text-ui-fg-base">
                    {product.title}
                  </span>
                  <span className="mt-1 block text-small-regular leading-5 text-ui-fg-subtle">
                    {product.reason}
                  </span>
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {recommendation.accessories.length > 0 && (
            <div className="rounded-md border border-ui-border-base bg-white p-4 mb-6">
              <Text className="text-base-semi mb-3">Add-ons to consider</Text>
              <div className="grid grid-cols-1 gap-3">
                {recommendation.accessories.map((product) => (
                  <LocalizedClientLink
                    key={product.href}
                    href={product.href}
                    className="rounded-md border border-ui-border-base bg-grey-5 p-3 hover:bg-white"
                  >
                    <span className="block text-small-semi text-ui-fg-base">
                      {product.title}
                    </span>
                    <span className="mt-1 block text-small-regular leading-5 text-ui-fg-subtle">
                      {product.reason}
                    </span>
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-md border border-ui-border-base bg-grey-5 p-4 mb-6">
            <Text className="text-base-semi mb-3">Compare the path</Text>
            <div className="grid grid-cols-1 gap-3">
              {recommendation.comparison.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-ui-border-base bg-white p-3"
                >
                  <span className="block text-small-semi text-ui-fg-base">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-small-regular leading-5 text-ui-fg-subtle">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col small:flex-row large:flex-col gap-3">
            <LocalizedClientLink href={recommendation.storeHref}>
              <Button variant="secondary" className="w-full">
                View filtered store
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href={recommendation.href}>
              <Button
                variant="primary"
                className="bg-brand-600 hover:bg-brand-700 border-none w-full"
              >
                View systems
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href={recommendation.quoteHref}>
              <Button variant="secondary" className="w-full">
                Send this to an engineer
              </Button>
            </LocalizedClientLink>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default WorkloadConfigurator
