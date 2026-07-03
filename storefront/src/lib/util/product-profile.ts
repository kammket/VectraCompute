import { HttpTypes } from "@medusajs/types"

import { getMetadataList, getMetadataString } from "@lib/util/product-metadata"

type ChecklistItem = [string, string]

export type ProductProfile = {
  fit: string
  modelFit: string
  workloads: string[]
  platform: string[]
  operations: string[]
  validation: ChecklistItem[]
  requirements: string[]
  summaryCards: ChecklistItem[]
}

const splitChecklist = (items: string[]) =>
  items
    .map((item) => {
      const [title, ...body] = item.split(":")

      return [title?.trim(), body.join(":").trim()] as ChecklistItem
    })
    .filter(([title, body]) => title && body)

const profiles: Record<string, ProductProfile> = {
  "vectraforge-x1": {
    fit: "Single-GPU local AI development workstation",
    modelFit:
      "Best for developers and data scientists who need reliable CUDA performance for fine-tuning, RAG experiments, image generation, and private local inference without moving into rack infrastructure.",
    workloads: [
      "LoRA fine-tuning",
      "Local LLM inference",
      "RAG prototyping",
      "Stable Diffusion",
    ],
    platform: [
      "24GB-48GB GPU memory options",
      "64GB-128GB system RAM",
      "1TB-2TB NVMe scratch",
      "Quiet desk-side tuning",
    ],
    operations: [
      "120V/240V office power review",
      "NVIDIA driver handoff",
      "Thermal profile checked",
      "Recovery media available",
    ],
    validation: [
      ["CUDA smoke test", "PyTorch and driver stack checked before shipment"],
      ["GPU burn-in", "Sustained load validates thermals and power stability"],
      ["NVMe check", "Scratch disk health and throughput reviewed"],
    ],
    requirements: [
      "Choose GPU memory around the largest model you plan to run locally",
      "Confirm office power, noise tolerance, and desk-side airflow",
      "Request Linux, Windows, or dual-boot setup before purchase",
    ],
    summaryCards: [
      [
        "Validated local AI stack",
        "Ships with driver and framework checks for common CUDA workflows.",
      ],
      [
        "Right-sized for one user",
        "Designed for fast iteration by one developer or data scientist.",
      ],
      [
        "Upgrade path",
        "Memory and NVMe can be expanded as models and datasets grow.",
      ],
    ],
  },
  "vectraforge-x2-pro": {
    fit: "Dual-GPU workstation for parallel experiments",
    modelFit:
      "Built for teams running larger local models, multiple notebooks, or two GPU-heavy jobs in parallel while keeping the system close to the users who build and debug models.",
    workloads: [
      "Parallel fine-tuning",
      "Multi-user prototyping",
      "Synthetic data generation",
      "Visual AI",
    ],
    platform: [
      "Dual GPU thermal zoning",
      "128GB-256GB RAM",
      "2TB-4TB NVMe",
      "High-airflow tower chassis",
    ],
    operations: [
      "Dedicated circuit recommended",
      "GPU spacing reviewed",
      "Driver and container handoff",
      "Acoustic profile discussed",
    ],
    validation: [
      [
        "Dual-GPU load",
        "Both cards are stressed together for thermal stability",
      ],
      ["PCIe check", "GPU link and slot behavior are reviewed"],
      ["Framework test", "PyTorch sees both GPUs cleanly"],
    ],
    requirements: [
      "Confirm if workloads need independent GPUs or multi-GPU training",
      "Review PSU headroom for the selected GPU pair",
      "Plan enough local storage for checkpoints and datasets",
    ],
    summaryCards: [
      [
        "Parallel capacity",
        "Useful when one GPU is not enough but a rack server is too much.",
      ],
      [
        "Thermal review",
        "GPU spacing and sustained load behavior are checked.",
      ],
      [
        "Team ready",
        "Configured for shared development, demos, and heavier local workloads.",
      ],
    ],
  },
  "vectraforge-x4-quad": {
    fit: "Quad-GPU desktop AI lab system",
    modelFit:
      "Fits research groups that need a serious desktop GPU pool for fine-tuning, simulation, and batch jobs before committing to a rack cluster.",
    workloads: [
      "Research training",
      "Batch inference",
      "Multi-GPU experiments",
      "GPU lab sharing",
    ],
    platform: [
      "Four GPU configurations",
      "256GB-512GB RAM",
      "4TB-8TB NVMe",
      "Redundant high-output PSU options",
    ],
    operations: [
      "Power circuit review required",
      "Room heat and airflow planning",
      "Remote access handoff",
      "Optional rack migration planning",
    ],
    validation: [
      ["Four-GPU burn-in", "All GPUs are loaded together, not one at a time"],
      ["Memory test", "Large RAM configurations are checked"],
      ["Storage stress", "Checkpoint disk behavior is validated"],
    ],
    requirements: [
      "Confirm power and cooling before ordering",
      "Decide whether users need shared remote access",
      "Request framework, container, or scheduler setup if needed",
    ],
    summaryCards: [
      [
        "Lab-class desktop",
        "High GPU density without moving immediately to rack hardware.",
      ],
      [
        "Power-aware build",
        "PSU and thermal behavior are reviewed under full load.",
      ],
      [
        "Research friendly",
        "Good fit for universities, startups, and model teams.",
      ],
    ],
  },
  "vectraforge-mini-itx": {
    fit: "Compact AI workstation for small spaces",
    modelFit:
      "A small-footprint CUDA workstation for home labs, edge demos, and developers who need real GPU acceleration without a full tower.",
    workloads: [
      "Home lab AI",
      "Edge prototyping",
      "Small LLM inference",
      "Computer vision demos",
    ],
    platform: [
      "Mini-ITX chassis",
      "16GB-24GB GPU options",
      "32GB-64GB RAM",
      "1TB-2TB NVMe",
    ],
    operations: [
      "Thermal limits explained",
      "Desk airflow checked",
      "Portable deployment planning",
      "Driver handoff available",
    ],
    validation: [
      [
        "Small-chassis thermal test",
        "GPU and CPU thermals are checked in the compact enclosure",
      ],
      ["CUDA check", "Framework readiness is validated"],
      ["Noise review", "Fan profile can be tuned for desk use"],
    ],
    requirements: [
      "Confirm physical space and airflow",
      "Choose the 4090 option for larger local models",
      "Avoid expecting rack-server concurrency from this small chassis",
    ],
    summaryCards: [
      ["Compact CUDA", "Real local AI performance in a small chassis."],
      ["Space efficient", "Useful for labs, demos, and edge prototypes."],
      [
        "Transparent limits",
        "Thermal and upgrade limits are explained before purchase.",
      ],
    ],
  },
  "vectrarack-r8": {
    fit: "Multi-GPU rack server for shared training",
    modelFit:
      "A rack node for teams that need shared GPU capacity, distributed training tests, and faster movement from individual workstations into production infrastructure.",
    workloads: [
      "Distributed training",
      "Shared inference",
      "Cluster expansion",
      "Large batch jobs",
    ],
    platform: [
      "4-8 H100 options",
      "512GB-1TB RAM",
      "10GbE-100GbE uplinks",
      "Rack management planning",
    ],
    operations: [
      "Datacenter power review",
      "Rack depth and rail review",
      "Network topology planning",
      "Remote management handoff",
    ],
    validation: [
      ["Multi-GPU burn-in", "All GPUs are tested under sustained load"],
      ["Fabric check", "Network and GPU visibility are reviewed"],
      ["Firmware review", "BIOS, BMC, and GPU firmware are checked"],
    ],
    requirements: [
      "Confirm rack power, cooling, and depth",
      "Choose network speed based on storage and cluster plans",
      "Request quote review for training topology",
    ],
    summaryCards: [
      ["Shared compute", "Built for multiple users and heavier AI jobs."],
      [
        "Rack-ready validation",
        "Power, firmware, rails, and networking are reviewed.",
      ],
      ["Cluster path", "Can grow into a multi-node GPU environment."],
    ],
  },
  "vectrarack-r8-pro": {
    fit: "H200-class flagship training server",
    modelFit:
      "A high-memory GPU training node for foundation-model teams, large-context experiments, and dense rack environments where HBM capacity and sustained throughput matter.",
    workloads: [
      "LLM training",
      "Large-context inference",
      "Foundation-model research",
      "High-throughput batch inference",
    ],
    platform: [
      "8x H200-class GPUs",
      "1TB RAM",
      "100GbE fabric",
      "High-density rack platform",
    ],
    operations: [
      "Power and cooling approval required",
      "Rack and airflow planning",
      "Firmware baseline documented",
      "Monitoring handoff available",
    ],
    validation: [
      ["HBM memory check", "GPU memory health is reviewed"],
      [
        "Full-load thermal test",
        "Sustained GPU load validates cooling behavior",
      ],
      ["Network check", "Fabric readiness is confirmed"],
    ],
    requirements: [
      "Confirm datacenter power and heat rejection",
      "Plan storage close to the server",
      "Review delivery, lift, rack, and install requirements",
    ],
    summaryCards: [
      [
        "Flagship GPU memory",
        "Designed for buyers who need H200-class capacity.",
      ],
      [
        "Sustained load focus",
        "Thermal behavior is validated under serious workloads.",
      ],
      [
        "Enterprise handoff",
        "Deployment details are documented for infrastructure teams.",
      ],
    ],
  },
  "vectrarack-r4-edge": {
    fit: "Compact rack inference server",
    modelFit:
      "Right-sized for production inference, computer vision, and model serving when a full 8-GPU training node would be excessive.",
    workloads: [
      "Production inference",
      "Computer vision",
      "Generative media",
      "Branch AI services",
    ],
    platform: [
      "2-4 L40S GPU options",
      "128GB-256GB RAM",
      "10GbE networking",
      "Compact 4U footprint",
    ],
    operations: [
      "Inference runtime setup",
      "Rack airflow validation",
      "Monitoring handoff",
      "Model serving review",
    ],
    validation: [
      ["Inference smoke test", "Serving runtime is checked"],
      ["GPU load test", "Sustained inference load validates thermals"],
      ["Network test", "Endpoint and uplink readiness reviewed"],
    ],
    requirements: [
      "Estimate concurrent users and model sizes",
      "Confirm rack space and power",
      "Choose 4 GPU option for higher throughput",
    ],
    summaryCards: [
      [
        "Inference first",
        "Optimized for serving models rather than training giant models.",
      ],
      [
        "Compact rack footprint",
        "Good fit where rack space and budget matter.",
      ],
      ["Runtime support", "Can ship with serving stack handoff."],
    ],
  },
  "vectrarack-r8-liquid": {
    fit: "Liquid-cooled rack server for dense AI rooms",
    modelFit:
      "Designed for sustained full-load H100-class work in dense racks or warmer data centers where air cooling is the limiting factor.",
    workloads: [
      "Sustained training",
      "Dense rack inference",
      "High-utilization GPU jobs",
      "Thermal-constrained AI rooms",
    ],
    platform: [
      "8x liquid-cooled H100-class GPUs",
      "1TB RAM",
      "100GbE networking",
      "Liquid cooling integration",
    ],
    operations: [
      "Cooling loop review",
      "Leak-test documentation",
      "Rack manifold planning",
      "Facility readiness check",
    ],
    validation: [
      ["Loop pressure check", "Cooling loop integrity is reviewed"],
      ["Thermal saturation test", "Full-load GPU thermals are validated"],
      [
        "Firmware and driver check",
        "Platform stack is verified before handoff",
      ],
    ],
    requirements: [
      "Confirm facility liquid-cooling support",
      "Review rack manifold and service process",
      "Plan installation with facilities staff",
    ],
    summaryCards: [
      [
        "Dense rack ready",
        "Built for sustained GPU utilization in demanding facilities.",
      ],
      [
        "Cooling reviewed",
        "Loop, rack, and thermal behavior are checked before fulfillment.",
      ],
      ["Facility-aware", "Requires real deployment planning before purchase."],
    ],
  },
}

const componentProfile = (product: HttpTypes.StoreProduct): ProductProfile => ({
  fit: `${product.title} compatibility and upgrade planning`,
  modelFit:
    "Best for buyers upgrading existing AI systems who need compatibility review, installation guidance, and validation notes before adding parts to production hardware.",
  workloads: [
    "System upgrades",
    "AI server maintenance",
    "Compatibility planning",
    "Capacity expansion",
  ],
  platform: [
    "Chassis fit review",
    "Power and thermal compatibility",
    "Firmware or driver notes",
    "Install support option",
  ],
  operations: [
    "Confirm host system",
    "Check slot, cable, and rail fit",
    "Document install steps",
    "Validate after installation",
  ],
  validation: [
    [
      "Compatibility review",
      "Host system details are checked before fulfillment",
    ],
    ["Install readiness", "Power, mechanical, and firmware needs are reviewed"],
    ["Post-install validation", "Upgrade behavior can be tested by request"],
  ],
  requirements: [
    "Share host system model, motherboard, PSU, and chassis details",
    "Confirm operating system and driver requirements",
    "Choose installation support if the upgrade affects power, thermals, or PCIe layout",
  ],
  summaryCards: [
    [
      "Compatibility first",
      "The page should help buyers avoid parts that do not fit their system.",
    ],
    [
      "Install support",
      "Available for upgrades that affect power, thermal, or firmware behavior.",
    ],
    [
      "Validation option",
      "Buyers can request testing and documentation with the upgrade.",
    ],
  ],
})

const defaultWorkstationProfile = (
  product: HttpTypes.StoreProduct
): ProductProfile => ({
  fit: `${product.title} AI workstation`,
  modelFit:
    "A workstation profile for buyers who need local AI development, dataset preparation, GPU acceleration, and a reviewed software handoff before the system goes into daily use.",
  workloads: [
    "Local AI development",
    "Fine-tuning",
    "Data science",
    "GPU prototyping",
  ],
  platform: [
    "CPU/GPU balance reviewed",
    "ECC or large memory options where supported",
    "Fast NVMe storage",
    "CUDA or relevant runtime handoff",
  ],
  operations: [
    "Power and acoustic review",
    "Driver validation",
    "Storage planning",
    "Remote onboarding available",
  ],
  validation: [
    ["Runtime check", "Framework and GPU visibility are validated"],
    ["Thermal test", "Sustained CPU/GPU load checks stability"],
    ["Storage check", "NVMe health is reviewed"],
  ],
  requirements: [
    "Select CPU platform around preprocessing and simulation needs",
    "Choose GPU memory around the model size",
    "Confirm preferred operating system and software stack",
  ],
  summaryCards: [
    [
      "Workload-matched",
      "Configured around the buyer's mix of CPU, GPU, memory, and storage needs.",
    ],
    [
      "Validated stack",
      "Drivers and runtime behavior are checked before shipment.",
    ],
    ["Procurement ready", "SKU, warranty, and quote support are available."],
  ],
})

const defaultServerProfile = (
  product: HttpTypes.StoreProduct
): ProductProfile => ({
  fit: `${product.title} AI infrastructure node`,
  modelFit:
    "A rack infrastructure profile for buyers who need dependable GPU, storage, or network capacity with power, rack, firmware, and deployment details reviewed before purchase.",
  workloads: [
    "Shared AI compute",
    "Production inference",
    "Training infrastructure",
    "Private AI services",
  ],
  platform: [
    "Rack deployment planning",
    "Redundant power options",
    "High-speed networking",
    "Remote management handoff",
  ],
  operations: [
    "Rack power review",
    "Cooling and airflow validation",
    "Firmware baseline",
    "Monitoring and remote access setup",
  ],
  validation: [
    ["Burn-in test", "Core components are stressed under sustained load"],
    [
      "Firmware review",
      "BIOS, BMC, GPU, and NIC firmware are checked where applicable",
    ],
    ["Network readiness", "Uplink and topology needs are reviewed"],
  ],
  requirements: [
    "Confirm rack space, power, and cooling before purchase",
    "Choose networking around storage and cluster plans",
    "Request deployment support if this joins existing infrastructure",
  ],
  summaryCards: [
    [
      "Infrastructure ready",
      "Designed for buyers moving beyond a single desktop system.",
    ],
    [
      "Operational review",
      "Rack, power, cooling, network, and firmware details are considered.",
    ],
    [
      "Engineer supported",
      "Sizing and deployment help are available before and after purchase.",
    ],
  ],
})

const inferProfile = (product: HttpTypes.StoreProduct) => {
  const category = product.categories?.[0]?.handle ?? ""
  const handle = product.handle ?? ""

  if (profiles[handle]) {
    return profiles[handle]
  }

  if (category.includes("components")) {
    return componentProfile(product)
  }

  if (category.includes("servers") || handle.includes("rack")) {
    return defaultServerProfile(product)
  }

  return defaultWorkstationProfile(product)
}

export const getProductProfile = (
  product: HttpTypes.StoreProduct
): ProductProfile => {
  const fallback = inferProfile(product)
  const validation = splitChecklist(
    getMetadataList(product, "validation_checklist", [])
  )
  const summaryCards = splitChecklist(
    getMetadataList(product, "summary_cards", [])
  )

  return {
    fit: getMetadataString(product, "ai_fit_title", fallback.fit),
    modelFit: getMetadataString(product, "ai_model_fit", fallback.modelFit),
    workloads: getMetadataList(product, "ai_workloads", fallback.workloads),
    platform: getMetadataList(product, "platform_notes", fallback.platform),
    operations: getMetadataList(
      product,
      "deployment_planning",
      fallback.operations
    ),
    validation: validation.length ? validation : fallback.validation,
    requirements: getMetadataList(
      product,
      "purchase_requirements",
      fallback.requirements
    ),
    summaryCards: summaryCards.length ? summaryCards : fallback.summaryCards,
  }
}
