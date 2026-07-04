export type BackendCatalogVariant = {
  title: string
  sku: string
  optionValue: string
  priceUsd: number
}

export type BackendCatalogProduct = {
  handle: string
  title: string
  category: string
  description: string
  bestFor: string
  condition: string
  warranty: string
  leadTime: string
  specs: string[]
  variants: BackendCatalogVariant[]
}

export const PRODUCT_CATALOG: BackendCatalogProduct[] = [
  {
    "handle": "vectraforge-x1",
    "title": "VectraForge X1",
    "category": "AI & Deep Learning Workstations",
    "description": "A single-GPU deep learning workstation tuned for fine-tuning, inference, and day-to-day model development. Every unit ships after a 24-hour burn-in under full CUDA load.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "RTX 4090 24GB / 64GB RAM / 1TB NVMe",
        "sku": "VC-X1-4090-64-1T",
        "optionValue": "RTX 4090 24GB / 64GB RAM / 1TB NVMe",
        "priceUsd": 2274
      },
      {
        "title": "RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-X1-5090-128-2T",
        "optionValue": "RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 3184
      },
      {
        "title": "RTX 6000 Ada 48GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-X1-6000ADA-128-2T",
        "optionValue": "RTX 6000 Ada 48GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 4549
      }
    ]
  },
  {
    "handle": "vectraforge-x2-pro",
    "title": "VectraForge X2 Pro",
    "category": "AI & Deep Learning Workstations",
    "description": "Dual-GPU workstation for teams training larger models locally or running multiple fine-tuning jobs in parallel. NVLink-ready chassis with isolated GPU thermal zones.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Dual RTX 4090 24GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-X2-4090X2-128-2T",
        "optionValue": "Dual RTX 4090 24GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 5199
      },
      {
        "title": "Dual RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-X2-5090X2-256-4T",
        "optionValue": "Dual RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 7149
      },
      {
        "title": "Dual RTX 6000 Ada 48GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-X2-6000ADAX2-256-4T",
        "optionValue": "Dual RTX 6000 Ada 48GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 9424
      }
    ]
  },
  {
    "handle": "vectraforge-x4-quad",
    "title": "VectraForge X4 Quad",
    "category": "AI & Deep Learning Workstations",
    "description": "Quad-GPU desktop supercomputer for research groups that have outgrown a single card but aren't ready to rack-mount. Dual 1600W PSUs in a redundant configuration.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Quad RTX 4090 24GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-X4-4090X4-256-4T",
        "optionValue": "Quad RTX 4090 24GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 10399
      },
      {
        "title": "Quad RTX 6000 Ada 48GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-X4-6000ADAX4-512-8T",
        "optionValue": "Quad RTX 6000 Ada 48GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 17549
      },
      {
        "title": "Quad RTX 6000 Ada 48GB / 1TB RAM / 16TB NVMe",
        "sku": "VC-X4-6000ADAX4-512-8T-MAX",
        "optionValue": "Quad RTX 6000 Ada 48GB / 1TB RAM / 16TB NVMe",
        "priceUsd": 22814
      }
    ]
  },
  {
    "handle": "vectraforge-mini-itx",
    "title": "VectraForge Mini-ITX",
    "category": "AI & Deep Learning Workstations",
    "description": "A compact single-GPU build for home labs, edge prototyping, and developers who want full CUDA performance without a full-tower footprint.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "RTX 4070 Ti Super 16GB / 32GB RAM / 1TB NVMe",
        "sku": "VC-ITX-4070TIS-32-1T",
        "optionValue": "RTX 4070 Ti Super 16GB / 32GB RAM / 1TB NVMe",
        "priceUsd": 1494
      },
      {
        "title": "RTX 4090 24GB / 64GB RAM / 2TB NVMe",
        "sku": "VC-ITX-4090-64-2T",
        "optionValue": "RTX 4090 24GB / 64GB RAM / 2TB NVMe",
        "priceUsd": 2534
      },
      {
        "title": "RTX 4090 24GB / 128GB RAM / 4TB NVMe",
        "sku": "VC-ITX-4090-64-2T-MAX",
        "optionValue": "RTX 4090 24GB / 128GB RAM / 4TB NVMe",
        "priceUsd": 3294
      }
    ]
  },
  {
    "handle": "vectraforge-blackwell-pro",
    "title": "VectraForge Blackwell Pro",
    "category": "AI & Deep Learning Workstations",
    "description": "Premium Blackwell-generation AI workstation for developers, creators, and data scientists who need large local VRAM, CUDA support, and a professional 96GB GPU option for agentic AI, LLM prototyping, simulation, and visual AI workloads.",
    "bestFor": "Agentic AI development, LLM prototyping, visual AI, simulation, CUDA workloads",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-14 business days after GPU allocation",
    "specs": [],
    "variants": [
      {
        "title": "RTX PRO 6000 Blackwell 96GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-BWPRO-6000-256-4T",
        "optionValue": "RTX PRO 6000 Blackwell 96GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 9099
      },
      {
        "title": "Dual RTX PRO 6000 Blackwell 96GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-BWPRO-6000X2-512-8T",
        "optionValue": "Dual RTX PRO 6000 Blackwell 96GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 18199
      },
      {
        "title": "Dual RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "sku": "VC-BWPRO-6000X2-512-8T-MAX",
        "optionValue": "Dual RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "priceUsd": 24569
      }
    ]
  },
  {
    "handle": "vectraspark-ai-mini",
    "title": "VectraSpark AI Mini",
    "category": "AI & Deep Learning Workstations",
    "description": "Compact personal AI development appliance for local model experimentation, embeddings, small-team demos, and edge prototyping. Designed for buyers who want a small-footprint alternative to a full tower.",
    "bestFor": "Local LLM demos, RAG development, embeddings, edge prototyping, private AI experiments",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 5-10 business days depending on platform availability",
    "specs": [],
    "variants": [
      {
        "title": "GB10-class AI mini / 128GB unified memory / 2TB NVMe",
        "sku": "VC-SPARK-128-2T",
        "optionValue": "GB10-class AI mini / 128GB unified memory / 2TB NVMe",
        "priceUsd": 3054
      },
      {
        "title": "AI mini workstation / 128GB unified memory / 4TB NVMe",
        "sku": "VC-SPARK-128-4T",
        "optionValue": "AI mini workstation / 128GB unified memory / 4TB NVMe",
        "priceUsd": 3509
      },
      {
        "title": "AI mini workstation / 128GB unified memory / 8TB NVMe",
        "sku": "VC-SPARK-128-4T-MAX",
        "optionValue": "AI mini workstation / 128GB unified memory / 8TB NVMe",
        "priceUsd": 4562
      }
    ]
  },
  {
    "handle": "vectraforge-vram-lab-b70",
    "title": "VectraForge VRAM Lab B70",
    "category": "AI & Deep Learning Workstations",
    "description": "Budget high-VRAM AI development workstation using multiple 32GB professional GPUs for teams that need memory capacity for experimentation and OpenVINO/oneAPI workflows more than maximum CUDA throughput.",
    "bestFor": "OpenVINO, oneAPI, embeddings, memory-heavy experiments, budget AI labs",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 7-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "2x Arc Pro B70 32GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-VRAM-B70X2-128-2T",
        "optionValue": "2x Arc Pro B70 32GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 2794
      },
      {
        "title": "4x Arc Pro B70 32GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-VRAM-B70X4-256-4T",
        "optionValue": "4x Arc Pro B70 32GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 4549
      },
      {
        "title": "4x Arc Pro B70 32GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-VRAM-B70X4-256-4T-MAX",
        "optionValue": "4x Arc Pro B70 32GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 5914
      }
    ]
  },
  {
    "handle": "vectraforge-rtx-5090-ai-workstation",
    "title": "VectraForge RTX 5090 AI Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "High-demand RTX 5090 AI workstation for local LLM inference, RAG development, Stable Diffusion, CUDA prototyping, and buyers searching for a powerful AI PC for private model work.",
    "bestFor": "Local LLM inference, RAG development, Stable Diffusion, CUDA prototyping, private AI experiments",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-12 business days after GPU allocation",
    "specs": [],
    "variants": [
      {
        "title": "RTX 5090 32GB / 128GB RAM / 4TB NVMe",
        "sku": "VC-5090AI-128-4T",
        "optionValue": "RTX 5090 32GB / 128GB RAM / 4TB NVMe",
        "priceUsd": 3899
      },
      {
        "title": "RTX 5090 32GB / 256GB RAM / 8TB NVMe",
        "sku": "VC-5090AI-256-8T",
        "optionValue": "RTX 5090 32GB / 256GB RAM / 8TB NVMe",
        "priceUsd": 4874
      },
      {
        "title": "RTX 5090 32GB / 512GB RAM / 16TB NVMe",
        "sku": "VC-5090AI-256-8T-MAX",
        "optionValue": "RTX 5090 32GB / 512GB RAM / 16TB NVMe",
        "priceUsd": 6336
      }
    ]
  },
  {
    "handle": "vectraforge-dual-rtx-5090-workstation",
    "title": "VectraForge Dual RTX 5090 Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "Dual RTX 5090 AI workstation for developers and small teams running parallel experiments, multi-GPU inference, image generation, synthetic data, and local AI workloads that need more GPU throughput.",
    "bestFor": "Parallel experiments, multi-GPU inference, image generation, synthetic data, small AI teams",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-15 business days after GPU allocation",
    "specs": [],
    "variants": [
      {
        "title": "Dual RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-D5090-256-4T",
        "optionValue": "Dual RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 7799
      },
      {
        "title": "Dual RTX 5090 32GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-D5090-512-8T",
        "optionValue": "Dual RTX 5090 32GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 9749
      },
      {
        "title": "Dual RTX 5090 32GB / 1TB RAM / 16TB NVMe",
        "sku": "VC-D5090-512-8T-MAX",
        "optionValue": "Dual RTX 5090 32GB / 1TB RAM / 16TB NVMe",
        "priceUsd": 12674
      }
    ]
  },
  {
    "handle": "vectraforge-rtx-pro-6000-studio",
    "title": "VectraForge RTX PRO 6000 Studio",
    "category": "AI & Deep Learning Workstations",
    "description": "Professional RTX PRO 6000 Blackwell-class AI workstation for high-VRAM inference, simulation, rendering, digital twins, visual AI, and enterprise teams searching for a premium 96GB GPU workstation.",
    "bestFor": "High-VRAM inference, simulation, rendering, digital twins, visual AI, enterprise AI development",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-18 business days after GPU allocation",
    "specs": [],
    "variants": [
      {
        "title": "RTX PRO 6000 Blackwell 96GB / 256GB ECC RAM / 4TB NVMe",
        "sku": "VC-STUDIO-6000BW-256-4T",
        "optionValue": "RTX PRO 6000 Blackwell 96GB / 256GB ECC RAM / 4TB NVMe",
        "priceUsd": 10399
      },
      {
        "title": "RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 8TB NVMe",
        "sku": "VC-STUDIO-6000BW-512-8T",
        "optionValue": "RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 8TB NVMe",
        "priceUsd": 12349
      },
      {
        "title": "RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 16TB NVMe",
        "sku": "VC-STUDIO-6000BW-512-8T-MAX",
        "optionValue": "RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 16TB NVMe",
        "priceUsd": 16054
      }
    ]
  },
  {
    "handle": "vectraforge-budget-vram-128gb",
    "title": "VectraForge Budget VRAM 128GB",
    "category": "AI & Deep Learning Workstations",
    "description": "Budget 128GB aggregate VRAM workstation for memory-heavy AI experiments, embeddings, OpenVINO, oneAPI, model exploration, and buyers searching for high VRAM AI hardware below premium GPU prices.",
    "bestFor": "Memory-heavy experiments, OpenVINO, oneAPI, embeddings, budget AI labs, model exploration",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 7-14 business days",
    "specs": [],
    "variants": [
      {
        "title": "4x 32GB Pro GPUs / 256GB RAM / 4TB NVMe",
        "sku": "VC-BUDGETVRAM-128-256-4T",
        "optionValue": "4x 32GB Pro GPUs / 256GB RAM / 4TB NVMe",
        "priceUsd": 4874
      },
      {
        "title": "4x 32GB Pro GPUs / 512GB RAM / 8TB NVMe",
        "sku": "VC-BUDGETVRAM-128-512-8T",
        "optionValue": "4x 32GB Pro GPUs / 512GB RAM / 8TB NVMe",
        "priceUsd": 6174
      },
      {
        "title": "4x 32GB Pro GPUs / 1TB RAM / 16TB NVMe",
        "sku": "VC-BUDGETVRAM-128-512-8T-MAX",
        "optionValue": "4x 32GB Pro GPUs / 1TB RAM / 16TB NVMe",
        "priceUsd": 8026
      }
    ]
  },
  {
    "handle": "vectrarack-r8",
    "title": "VectraRack R8",
    "category": "GPU Rack Servers",
    "description": "8U multi-GPU rack server for distributed training. Configurable from 4 to 8 GPUs with NVSwitch fabric and dual 100GbE uplinks for multi-node clusters.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "4x H100 80GB / 512GB RAM / 10GbE",
        "sku": "VC-R8-H100X4-512-10G",
        "optionValue": "4x H100 80GB / 512GB RAM / 10GbE",
        "priceUsd": 58499
      },
      {
        "title": "8x H100 80GB / 1TB RAM / 100GbE",
        "sku": "VC-R8-H100X8-1024-100G",
        "optionValue": "8x H100 80GB / 1TB RAM / 100GbE",
        "priceUsd": 110499
      },
      {
        "title": "8x H100 80GB / 1TB RAM / 200GbE",
        "sku": "VC-R8-H100X8-1024-100G-MAX",
        "optionValue": "8x H100 80GB / 1TB RAM / 200GbE",
        "priceUsd": 146899
      }
    ]
  },
  {
    "handle": "vectrarack-r8-pro",
    "title": "VectraRack R8 Pro",
    "category": "GPU Rack Servers",
    "description": "Our flagship training server. Eight H200 GPUs with 141GB HBM3e each, built for foundation-model-scale workloads and large-batch distributed training.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "4x H200 141GB / 1TB RAM / 100GbE",
        "sku": "VC-R8PRO-H200X4-1TB-100G",
        "optionValue": "4x H200 141GB / 1TB RAM / 100GbE",
        "priceUsd": 97499
      },
      {
        "title": "8x H200 141GB / 1TB RAM / 100GbE",
        "sku": "VC-R8PRO-H200X8-1024-100G",
        "optionValue": "8x H200 141GB / 1TB RAM / 100GbE",
        "priceUsd": 142999
      },
      {
        "title": "8x H200 141GB / 2TB RAM / 400GbE",
        "sku": "VC-R8PRO-H200X8-2TB-400G",
        "optionValue": "8x H200 141GB / 2TB RAM / 400GbE",
        "priceUsd": 194999
      }
    ]
  },
  {
    "handle": "vectrarack-r4-edge",
    "title": "VectraRack R4 Edge",
    "category": "GPU Rack Servers",
    "description": "A compact 4U inference and edge-deployment server. Right-sized for production model serving without the footprint of a full training rack.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "2x L40S 48GB / 128GB RAM / 10GbE",
        "sku": "VC-R4-L40SX2-128-10G",
        "optionValue": "2x L40S 48GB / 128GB RAM / 10GbE",
        "priceUsd": 21449
      },
      {
        "title": "4x L40S 48GB / 256GB RAM / 10GbE",
        "sku": "VC-R4-L40SX4-256-10G",
        "optionValue": "4x L40S 48GB / 256GB RAM / 10GbE",
        "priceUsd": 35749
      },
      {
        "title": "4x L40S 48GB / 512GB RAM / 25GbE",
        "sku": "VC-R4-L40SX4-256-10G-MAX",
        "optionValue": "4x L40S 48GB / 512GB RAM / 25GbE",
        "priceUsd": 46474
      }
    ]
  },
  {
    "handle": "vectrarack-r8-liquid",
    "title": "VectraRack R8 Liquid",
    "category": "GPU Rack Servers",
    "description": "Liquid-cooled variant of our 8-GPU training server for high-density racks and sustained full-load operation in warmer data center environments.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "4x H100 80GB Liquid-Cooled / 1TB RAM / 100GbE",
        "sku": "VC-R8LIQ-H100X4-1TB-100G",
        "optionValue": "4x H100 80GB Liquid-Cooled / 1TB RAM / 100GbE",
        "priceUsd": 84499
      },
      {
        "title": "8x H100 80GB Liquid-Cooled / 1TB RAM / 100GbE",
        "sku": "VC-R8LIQ-H100X8-1024-100G",
        "optionValue": "8x H100 80GB Liquid-Cooled / 1TB RAM / 100GbE",
        "priceUsd": 123499
      },
      {
        "title": "8x H100 80GB Liquid-Cooled / 2TB RAM / 400GbE",
        "sku": "VC-R8LIQ-H100X8-2TB-400G",
        "optionValue": "8x H100 80GB Liquid-Cooled / 2TB RAM / 400GbE",
        "priceUsd": 168999
      }
    ]
  },
  {
    "handle": "vectrarack-refurb-h100",
    "title": "VectraRack Refurb H100",
    "category": "Refurbished & Certified",
    "description": "Validated refurbished H100 GPU server for research groups, universities, and startups that need serious training capacity with clearer budget control. Every unit is inspected, stress-tested, and documented before fulfillment.",
    "bestFor": "University labs, research clusters, budget training, private AI infrastructure",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 10-15 business days after validation",
    "specs": [],
    "variants": [
      {
        "title": "4x Refurb H100 80GB / 512GB RAM / 100GbE",
        "sku": "VC-REF-H100X4-512-100G",
        "optionValue": "4x Refurb H100 80GB / 512GB RAM / 100GbE",
        "priceUsd": 48749
      },
      {
        "title": "8x Refurb H100 80GB / 1TB RAM / 100GbE",
        "sku": "VC-REF-H100X8-1024-100G",
        "optionValue": "8x Refurb H100 80GB / 1TB RAM / 100GbE",
        "priceUsd": 90999
      },
      {
        "title": "8x Refurb H100 80GB / 1TB RAM / 200GbE",
        "sku": "VC-REF-H100X8-1024-100G-MAX",
        "optionValue": "8x Refurb H100 80GB / 1TB RAM / 200GbE",
        "priceUsd": 120574
      }
    ]
  },
  {
    "handle": "vectrarack-l40s-inference-node",
    "title": "VectraRack L40S Inference Node",
    "category": "GPU Rack Servers",
    "description": "Production inference and visual AI server built around L40S-class 48GB GPUs. Tuned for model serving, computer vision, generative media, and teams that need GPU density without H100 pricing.",
    "bestFor": "Production inference, visual AI, generative media, computer vision, render pipelines",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-12 business days",
    "specs": [],
    "variants": [
      {
        "title": "2x L40S 48GB / 256GB RAM / 10GbE",
        "sku": "VC-L40S-INF-X2-256-10G",
        "optionValue": "2x L40S 48GB / 256GB RAM / 10GbE",
        "priceUsd": 22749
      },
      {
        "title": "4x L40S 48GB / 512GB RAM / 25GbE",
        "sku": "VC-L40S-INF-X4-512-25G",
        "optionValue": "4x L40S 48GB / 512GB RAM / 25GbE",
        "priceUsd": 40949
      },
      {
        "title": "4x L40S 48GB / 1TB RAM / 100GbE",
        "sku": "VC-L40S-INF-X4-512-25G-MAX",
        "optionValue": "4x L40S 48GB / 1TB RAM / 100GbE",
        "priceUsd": 53689
      }
    ]
  },
  {
    "handle": "vectraedge-l4-micro-server",
    "title": "VectraEdge L4 Micro Server",
    "category": "Edge & Robotics",
    "description": "Low-power edge inference server for branch deployments, computer vision, small model serving, and private AI appliances where rack space, heat, and power are constrained.",
    "bestFor": "Edge inference, computer vision, private AI appliances, branch deployments",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 5-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "1x L4 24GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-EDGE-L4X1-128-2T",
        "optionValue": "1x L4 24GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 7149
      },
      {
        "title": "2x L4 24GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-EDGE-L4X2-256-4T",
        "optionValue": "2x L4 24GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 11699
      },
      {
        "title": "2x L4 24GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-EDGE-L4X2-256-4T-MAX",
        "optionValue": "2x L4 24GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 15209
      }
    ]
  },
  {
    "handle": "vectrarack-liquid-h200-node",
    "title": "VectraRack Liquid H200 Node",
    "category": "GPU Rack Servers",
    "description": "Direct-to-chip liquid-cooled GPU server for dense AI training racks, sustained H200-class workloads, and buyers searching for liquid cooled AI servers that can run at high utilization without thermal throttling.",
    "bestFor": "LLM training, high-density AI racks, sustained GPU utilization, data center AI",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 15-25 business days after cooling review",
    "specs": [],
    "variants": [
      {
        "title": "4x H200 141GB Liquid-Cooled / 1TB RAM / 200GbE",
        "sku": "VC-LIQ-H200X4-1024-200G",
        "optionValue": "4x H200 141GB Liquid-Cooled / 1TB RAM / 200GbE",
        "priceUsd": 77999
      },
      {
        "title": "8x H200 141GB Liquid-Cooled / 2TB RAM / 400GbE",
        "sku": "VC-LIQ-H200X8-2048-400G",
        "optionValue": "8x H200 141GB Liquid-Cooled / 2TB RAM / 400GbE",
        "priceUsd": 162499
      },
      {
        "title": "8x H200 141GB Liquid-Cooled / 2TB RAM / 800GbE",
        "sku": "VC-LIQ-H200X8-2048-400G-MAX",
        "optionValue": "8x H200 141GB Liquid-Cooled / 2TB RAM / 800GbE",
        "priceUsd": 221649
      }
    ]
  },
  {
    "handle": "vectrastore-nvme-ai-data-node",
    "title": "VectraStore NVMe AI Data Node",
    "category": "Storage & Memory",
    "description": "High-speed NVMe storage server for AI datasets, model checkpoints, vector databases, RAG indexes, and shared training storage. Built for buyers searching for AI storage servers and NVMe data lake hardware.",
    "bestFor": "AI datasets, model checkpoints, RAG storage, vector databases, shared GPU cluster storage",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-14 business days",
    "specs": [],
    "variants": [
      {
        "title": "122TB NVMe / EPYC / 256GB RAM / 100GbE",
        "sku": "VC-STORE-122T-100G",
        "optionValue": "122TB NVMe / EPYC / 256GB RAM / 100GbE",
        "priceUsd": 18199
      },
      {
        "title": "245TB NVMe / EPYC / 512GB RAM / 200GbE",
        "sku": "VC-STORE-245T-200G",
        "optionValue": "245TB NVMe / EPYC / 512GB RAM / 200GbE",
        "priceUsd": 31849
      },
      {
        "title": "245TB NVMe / EPYC / 1TB RAM / 400GbE",
        "sku": "VC-STORE-245T-200G-MAX",
        "optionValue": "245TB NVMe / EPYC / 1TB RAM / 400GbE",
        "priceUsd": 41404
      }
    ]
  },
  {
    "handle": "vectrainfer-memorymax-server",
    "title": "VectraInfer MemoryMax Server",
    "category": "GPU Rack Servers",
    "description": "High-memory AI inference server for large context windows, retrieval pipelines, CPU-assisted model serving, and buyers searching for high RAM AI servers or large memory inference hardware.",
    "bestFor": "RAG inference, long-context LLM serving, embedding pipelines, enterprise AI applications",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "2x L40S 48GB / 1TB RAM / 25GbE",
        "sku": "VC-MEMMAX-L40SX2-1TB-25G",
        "optionValue": "2x L40S 48GB / 1TB RAM / 25GbE",
        "priceUsd": 29249
      },
      {
        "title": "4x L40S 48GB / 2TB RAM / 100GbE",
        "sku": "VC-MEMMAX-L40SX4-2TB-100G",
        "optionValue": "4x L40S 48GB / 2TB RAM / 100GbE",
        "priceUsd": 53949
      },
      {
        "title": "4x L40S 48GB / 2TB RAM / 200GbE",
        "sku": "VC-MEMMAX-L40SX4-2TB-100G-MAX",
        "optionValue": "4x L40S 48GB / 2TB RAM / 200GbE",
        "priceUsd": 71239
      }
    ]
  },
  {
    "handle": "vectrafield-rugged-ai-workstation",
    "title": "VectraField Rugged AI Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "Rugged portable AI workstation for field inference, mobile robotics, industrial inspection, labs, defense contractors, and teams searching for portable AI workstations that can run offline.",
    "bestFor": "Field inference, mobile robotics, industrial inspection, offline AI, lab demos",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 10-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "Portable RTX 5000 Ada 32GB / 128GB RAM / 4TB NVMe",
        "sku": "VC-FIELD-5000ADA-128-4T",
        "optionValue": "Portable RTX 5000 Ada 32GB / 128GB RAM / 4TB NVMe",
        "priceUsd": 7799
      },
      {
        "title": "Portable RTX 6000 Ada 48GB / 256GB RAM / 8TB NVMe",
        "sku": "VC-FIELD-6000ADA-256-8T",
        "optionValue": "Portable RTX 6000 Ada 48GB / 256GB RAM / 8TB NVMe",
        "priceUsd": 11699
      },
      {
        "title": "Portable RTX 6000 Ada 48GB / 512GB RAM / 16TB NVMe",
        "sku": "VC-FIELD-6000ADA-256-8T-MAX",
        "optionValue": "Portable RTX 6000 Ada 48GB / 512GB RAM / 16TB NVMe",
        "priceUsd": 15209
      }
    ]
  },
  {
    "handle": "vectracluster-starter-pod",
    "title": "VectraCluster Starter Pod",
    "category": "GPU Rack Servers",
    "description": "Small AI cluster in a box for universities, startups, and research labs: GPU servers, high-speed networking, rack rails, cabling, and deployment support bundled for buyers searching for AI cluster starter kits.",
    "bestFor": "University AI labs, startup compute clusters, research groups, private GPU clusters",
    "condition": "New or validated refurbished options",
    "warranty": "Cluster-level warranty options available",
    "leadTime": "Ships in 20-35 business days after topology approval",
    "specs": [],
    "variants": [
      {
        "title": "2-node L40S cluster / 100GbE switch / rack kit",
        "sku": "VC-CLUSTER-L40S-2N-100G",
        "optionValue": "2-node L40S cluster / 100GbE switch / rack kit",
        "priceUsd": 58499
      },
      {
        "title": "4-node H100 cluster / 400GbE fabric / rack kit",
        "sku": "VC-CLUSTER-H100-4N-400G",
        "optionValue": "4-node H100 cluster / 400GbE fabric / rack kit",
        "priceUsd": 227499
      },
      {
        "title": "4-node H100 cluster / 800GbE fabric / rack kit",
        "sku": "VC-CLUSTER-H100-4N-400G-MAX",
        "optionValue": "4-node H100 cluster / 800GbE fabric / rack kit",
        "priceUsd": 345799
      }
    ]
  },
  {
    "handle": "vectrarack-mi300x-inference-server",
    "title": "VectraRack MI300X Inference Server",
    "category": "GPU Rack Servers",
    "description": "AMD Instinct MI300X-class GPU server for high-memory AI inference, open model serving, and buyers searching for NVIDIA alternatives for large VRAM inference infrastructure.",
    "bestFor": "High-memory inference, open model serving, enterprise AI, NVIDIA alternative evaluations",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships after allocation and platform validation",
    "specs": [],
    "variants": [
      {
        "title": "4x MI300X 192GB / 1TB RAM / 200GbE",
        "sku": "VC-MI300X-X4-1TB-200G",
        "optionValue": "4x MI300X 192GB / 1TB RAM / 200GbE",
        "priceUsd": 90999
      },
      {
        "title": "8x MI300X 192GB / 2TB RAM / 400GbE",
        "sku": "VC-MI300X-X8-2TB-400G",
        "optionValue": "8x MI300X 192GB / 2TB RAM / 400GbE",
        "priceUsd": 175499
      },
      {
        "title": "8x MI300X 192GB / 2TB RAM / 800GbE",
        "sku": "VC-MI300X-X8-2TB-400G-MAX",
        "optionValue": "8x MI300X 192GB / 2TB RAM / 800GbE",
        "priceUsd": 234649
      }
    ]
  },
  {
    "handle": "vectrarag-private-ai-appliance",
    "title": "VectraRAG Private AI Appliance",
    "category": "GPU Rack Servers",
    "description": "Private RAG appliance for local document AI, secure enterprise search, embeddings, vector databases, and buyers searching for on-prem AI appliances that keep sensitive data inside the organization.",
    "bestFor": "Private RAG, document search, legal AI, healthcare AI, internal knowledge bases",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "L4 24GB / 128GB RAM / 30TB NVMe",
        "sku": "VC-RAG-L4-128-30T",
        "optionValue": "L4 24GB / 128GB RAM / 30TB NVMe",
        "priceUsd": 12349
      },
      {
        "title": "L40S 48GB / 256GB RAM / 60TB NVMe",
        "sku": "VC-RAG-L40S-256-60T",
        "optionValue": "L40S 48GB / 256GB RAM / 60TB NVMe",
        "priceUsd": 22749
      },
      {
        "title": "L40S 48GB / 512GB RAM / 120TB NVMe",
        "sku": "VC-RAG-L40S-256-60T-MAX",
        "optionValue": "L40S 48GB / 512GB RAM / 120TB NVMe",
        "priceUsd": 30029
      }
    ]
  },
  {
    "handle": "vectralocal-llm-inference-appliance",
    "title": "VectraLocal LLM Inference Appliance",
    "category": "GPU Rack Servers",
    "description": "Private LLM inference appliance for small businesses, agencies, and engineering teams replacing cloud APIs with local model serving, RAG endpoints, and controlled on-prem AI infrastructure.",
    "bestFor": "Private LLM inference, RAG endpoints, SME AI deployment, local model serving, cloud API replacement",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "RTX 5090 32GB / 128GB RAM / 8TB NVMe",
        "sku": "VC-LOCAL-5090-128-8T",
        "optionValue": "RTX 5090 32GB / 128GB RAM / 8TB NVMe",
        "priceUsd": 5849
      },
      {
        "title": "L40S 48GB / 256GB RAM / 16TB NVMe",
        "sku": "VC-LOCAL-L40S-256-16T",
        "optionValue": "L40S 48GB / 256GB RAM / 16TB NVMe",
        "priceUsd": 16249
      },
      {
        "title": "L40S 48GB / 512GB RAM / 30TB NVMe",
        "sku": "VC-LOCAL-L40S-256-16T-MAX",
        "optionValue": "L40S 48GB / 512GB RAM / 30TB NVMe",
        "priceUsd": 23529
      }
    ]
  },
  {
    "handle": "vectrarag-legal-ai-appliance",
    "title": "VectraRAG Legal AI Appliance",
    "category": "GPU Rack Servers",
    "description": "Legal AI and private RAG appliance for law firms, compliance teams, contract review, discovery workflows, and buyers searching for on-prem document AI hardware for sensitive files.",
    "bestFor": "Legal document search, contract review, discovery workflows, compliance AI, private knowledge bases",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 12-18 business days",
    "specs": [],
    "variants": [
      {
        "title": "L4 24GB / 256GB RAM / 60TB NVMe",
        "sku": "VC-RAG-LEGAL-L4-256-60T",
        "optionValue": "L4 24GB / 256GB RAM / 60TB NVMe",
        "priceUsd": 16249
      },
      {
        "title": "L40S 48GB / 512GB RAM / 120TB NVMe",
        "sku": "VC-RAG-LEGAL-L40S-512-120T",
        "optionValue": "L40S 48GB / 512GB RAM / 120TB NVMe",
        "priceUsd": 29249
      },
      {
        "title": "L40S 48GB / 1TB RAM / 240TB NVMe",
        "sku": "VC-RAG-LEGAL-L40S-512-120T-MAX",
        "optionValue": "L40S 48GB / 1TB RAM / 240TB NVMe",
        "priceUsd": 38349
      }
    ]
  },
  {
    "handle": "vectravector-database-server",
    "title": "VectraVector Database Server",
    "category": "GPU Rack Servers",
    "description": "Vector database server for embeddings, semantic search, RAG indexes, document AI, recommendation systems, and buyers searching for fast NVMe-backed vector search infrastructure.",
    "bestFor": "Vector databases, embeddings, RAG indexes, semantic search, document AI storage",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-16 business days",
    "specs": [],
    "variants": [
      {
        "title": "122TB NVMe / 512GB RAM / 100GbE",
        "sku": "VC-VECTOR-122T-512-100G",
        "optionValue": "122TB NVMe / 512GB RAM / 100GbE",
        "priceUsd": 22749
      },
      {
        "title": "245TB NVMe / 1TB RAM / 200GbE",
        "sku": "VC-VECTOR-245T-1TB-200G",
        "optionValue": "245TB NVMe / 1TB RAM / 200GbE",
        "priceUsd": 42249
      },
      {
        "title": "245TB NVMe / 1TB RAM / 400GbE",
        "sku": "VC-VECTOR-245T-1TB-200G-MAX",
        "optionValue": "245TB NVMe / 1TB RAM / 400GbE",
        "priceUsd": 55899
      }
    ]
  },
  {
    "handle": "vectrarack-refurb-a100-server",
    "title": "VectraRack Refurb A100 Server",
    "category": "Refurbished & Certified",
    "description": "Validated refurbished A100 GPU server for universities, startups, research labs, and buyers searching for used A100 servers with stress testing, warranty notes, and budget control.",
    "bestFor": "University labs, AI research, budget training, batch inference, refurbished GPU clusters",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 10-18 business days after validation",
    "specs": [],
    "variants": [
      {
        "title": "4x Refurb A100 80GB / 512GB RAM / 100GbE",
        "sku": "VC-REF-A100X4-512-100G",
        "optionValue": "4x Refurb A100 80GB / 512GB RAM / 100GbE",
        "priceUsd": 32499
      },
      {
        "title": "8x Refurb A100 80GB / 1TB RAM / 100GbE",
        "sku": "VC-REF-A100X8-1TB-100G",
        "optionValue": "8x Refurb A100 80GB / 1TB RAM / 100GbE",
        "priceUsd": 58499
      },
      {
        "title": "8x Refurb A100 80GB / 1TB RAM / 200GbE",
        "sku": "VC-REF-A100X8-1TB-100G-MAX",
        "optionValue": "8x Refurb A100 80GB / 1TB RAM / 200GbE",
        "priceUsd": 76699
      }
    ]
  },
  {
    "handle": "vectrarack-refurb-l40s-inference-server",
    "title": "VectraRack Refurb L40S Inference Server",
    "category": "Refurbished & Certified",
    "description": "Validated refurbished L40S inference server for production model serving, computer vision, generative media, and buyers searching for lower-cost AI inference servers.",
    "bestFor": "Production inference, visual AI, computer vision, generative media, refurbished AI hardware",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 10-15 business days after validation",
    "specs": [],
    "variants": [
      {
        "title": "2x Refurb L40S 48GB / 256GB RAM / 25GbE",
        "sku": "VC-REF-L40SX2-256-25G",
        "optionValue": "2x Refurb L40S 48GB / 256GB RAM / 25GbE",
        "priceUsd": 16249
      },
      {
        "title": "4x Refurb L40S 48GB / 512GB RAM / 25GbE",
        "sku": "VC-REF-L40SX4-512-25G",
        "optionValue": "4x Refurb L40S 48GB / 512GB RAM / 25GbE",
        "priceUsd": 29249
      },
      {
        "title": "4x Refurb L40S 48GB / 1TB RAM / 100GbE",
        "sku": "VC-REF-L40SX4-512-25G-MAX",
        "optionValue": "4x Refurb L40S 48GB / 1TB RAM / 100GbE",
        "priceUsd": 38349
      }
    ]
  },
  {
    "handle": "vectraspark-dgx-class-ai-mini",
    "title": "VectraSpark DGX-Class AI Mini",
    "category": "AI & Deep Learning Workstations",
    "description": "Compact personal AI supercomputer for developers, researchers, and founders who want a desk-friendly local AI box for prototyping agents, fine-tuning smaller models, testing RAG pipelines, and running private inference before moving workloads to a larger GPU server.",
    "bestFor": "AI developers, local LLM prototyping, agent testing, private inference, RAG development",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships after allocation and configuration review",
    "specs": [],
    "variants": [
      {
        "title": "GB10-class AI mini / 128GB unified memory / 4TB NVMe",
        "sku": "VC-SPARK-GB10-128-4T",
        "optionValue": "GB10-class AI mini / 128GB unified memory / 4TB NVMe",
        "priceUsd": 3249
      },
      {
        "title": "Dual-unit AI mini bundle / 256GB unified memory aggregate",
        "sku": "VC-SPARK-GB10X2-256-8T",
        "optionValue": "Dual-unit AI mini bundle / 256GB unified memory aggregate",
        "priceUsd": 6369
      },
      {
        "title": "Dual-unit AI mini bundle / 256GB unified memory aggregate / professional validation package",
        "sku": "VC-SPARK-GB10X2-256-8T-MAX",
        "optionValue": "Dual-unit AI mini bundle / 256GB unified memory aggregate / professional validation package",
        "priceUsd": 8553
      }
    ]
  },
  {
    "handle": "vectradgx-spark-personal-ai-supercomputer",
    "title": "VectraDGX Spark Personal AI Supercomputer",
    "category": "AI & Deep Learning Workstations",
    "description": "DGX Spark-class personal AI supercomputer for buyers searching for NVIDIA DGX Spark alternatives, desktop AI supercomputers, GB10-class local AI systems, 128GB unified-memory AI computers, agent development, RAG testing, and private local inference.",
    "bestFor": "Local LLM development, AI agents, RAG testing, private inference, developer AI workstation, compact AI research",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships after allocation and local AI runtime review",
    "specs": [],
    "variants": [
      {
        "title": "DGX Spark-class / 128GB unified memory / 4TB NVMe",
        "sku": "VC-DGXSPARK-128-4T",
        "optionValue": "DGX Spark-class / 128GB unified memory / 4TB NVMe",
        "priceUsd": 3574
      },
      {
        "title": "DGX Spark-class developer bundle / 128GB unified memory / 8TB NVMe",
        "sku": "VC-DGXSPARK-128-8T-DEV",
        "optionValue": "DGX Spark-class developer bundle / 128GB unified memory / 8TB NVMe",
        "priceUsd": 4549
      },
      {
        "title": "DGX Spark-class developer bundle / 128GB unified memory / 16TB NVMe",
        "sku": "VC-DGXSPARK-128-8T-DEV-MAX",
        "optionValue": "DGX Spark-class developer bundle / 128GB unified memory / 16TB NVMe",
        "priceUsd": 5914
      }
    ]
  },
  {
    "handle": "vectramini-ryzen-ai-max-395-local-llm-workstation",
    "title": "VectraMini Ryzen AI Max+ 395 Local LLM Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "AMD Ryzen AI Max+ 395-class mini AI workstation for buyers searching for local LLM mini PCs, 128GB unified-memory compact AI computers, quiet desk-side inference, developer RAG appliances, and portable private AI systems.",
    "bestFor": "Local LLM mini PC, quiet AI workstation, RAG development, private inference, portable AI demos",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 7-14 business days after configuration review",
    "specs": [],
    "variants": [
      {
        "title": "Ryzen AI Max+ 395 / 128GB unified memory / 4TB NVMe",
        "sku": "VC-RYZENAI395-128-4T",
        "optionValue": "Ryzen AI Max+ 395 / 128GB unified memory / 4TB NVMe",
        "priceUsd": 2599
      },
      {
        "title": "Ryzen AI Max+ 395 Pro / 128GB unified memory / 12TB NVMe / dual 10GbE",
        "sku": "VC-RYZENAI395PRO-128-12T",
        "optionValue": "Ryzen AI Max+ 395 Pro / 128GB unified memory / 12TB NVMe / dual 10GbE",
        "priceUsd": 3574
      },
      {
        "title": "Ryzen AI Max+ 395 Pro / 128GB unified memory / 14TB NVMe / dual 25GbE",
        "sku": "VC-RYZENAI395PRO-128-12T-MAX",
        "optionValue": "Ryzen AI Max+ 395 Pro / 128GB unified memory / 14TB NVMe / dual 25GbE",
        "priceUsd": 4646
      }
    ]
  },
  {
    "handle": "vectramini-panther-lake-ai-developer-pc",
    "title": "VectraMini Panther Lake AI Developer PC",
    "category": "AI & Deep Learning Workstations",
    "description": "Intel Panther Lake-class AI mini PC for buyers searching for Core Ultra AI PCs, compact OpenVINO workstations, NPU-enabled office AI computers, local inference mini PCs, and edge developer systems with modern connectivity.",
    "bestFor": "OpenVINO development, office AI, edge inference, compact developer AI, NPU-enabled local workflows",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 5-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "Core Ultra Panther Lake / 64GB RAM / 4TB NVMe",
        "sku": "VC-PANTHERAI-64-4T",
        "optionValue": "Core Ultra Panther Lake / 64GB RAM / 4TB NVMe",
        "priceUsd": 1624
      },
      {
        "title": "Core Ultra Panther Lake Pro / 64GB RAM / 8TB NVMe / 10GbE",
        "sku": "VC-PANTHERAI-PRO-64-8T",
        "optionValue": "Core Ultra Panther Lake Pro / 64GB RAM / 8TB NVMe / 10GbE",
        "priceUsd": 2274
      },
      {
        "title": "Core Ultra Panther Lake Pro / 128GB RAM / 16TB NVMe / 25GbE",
        "sku": "VC-PANTHERAI-PRO-64-8T-MAX",
        "optionValue": "Core Ultra Panther Lake Pro / 128GB RAM / 16TB NVMe / 25GbE",
        "priceUsd": 2956
      }
    ]
  },
  {
    "handle": "vectrarack-mi350x-ai-server",
    "title": "VectraRack MI350X AI Server",
    "category": "GPU Rack Servers",
    "description": "AMD Instinct MI350X-class AI server for enterprises evaluating high-memory ROCm infrastructure, large-context inference, open model serving, RAG acceleration, and non-CUDA AI deployments with very large HBM capacity.",
    "bestFor": "High-memory inference, ROCm AI, open model serving, RAG, NVIDIA alternative evaluations",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships after allocation, platform validation, and deployment review",
    "specs": [],
    "variants": [
      {
        "title": "4x MI350X 288GB / 1TB RAM / 400GbE",
        "sku": "VC-MI350X-X4-1TB-400G",
        "optionValue": "4x MI350X 288GB / 1TB RAM / 400GbE",
        "priceUsd": 149499
      },
      {
        "title": "8x MI350X 288GB / 2TB RAM / 800GbE",
        "sku": "VC-MI350X-X8-2TB-800G",
        "optionValue": "8x MI350X 288GB / 2TB RAM / 800GbE",
        "priceUsd": 292499
      },
      {
        "title": "8x MI350X 288GB / 2TB RAM / 800GbE / expanded memory and deployment support",
        "sku": "VC-MI350X-X8-2TB-800G-MAX",
        "optionValue": "8x MI350X 288GB / 2TB RAM / 800GbE / expanded memory and deployment support",
        "priceUsd": 392599
      }
    ]
  },
  {
    "handle": "vectrarack-mi350p-pcie-ai-server",
    "title": "VectraRack MI350P PCIe AI Server",
    "category": "GPU Rack Servers",
    "description": "PCIe-based AMD Instinct MI350P-class AI server for buyers who want new-generation high-memory AI acceleration in air-cooled server infrastructure, with a practical path for RAG, inference, and mixed enterprise AI workloads.",
    "bestFor": "Air-cooled AI servers, high-memory inference, RAG, enterprise AI, ROCm pilot deployments",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships after allocation and compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "4x MI350P 144GB / 1TB RAM / 200GbE",
        "sku": "VC-MI350P-X4-1TB-200G",
        "optionValue": "4x MI350P 144GB / 1TB RAM / 200GbE",
        "priceUsd": 110499
      },
      {
        "title": "8x MI350P 144GB / 2TB RAM / 400GbE",
        "sku": "VC-MI350P-X8-2TB-400G",
        "optionValue": "8x MI350P 144GB / 2TB RAM / 400GbE",
        "priceUsd": 214499
      },
      {
        "title": "8x MI350P 144GB / 2TB RAM / 800GbE",
        "sku": "VC-MI350P-X8-2TB-400G-MAX",
        "optionValue": "8x MI350P 144GB / 2TB RAM / 800GbE",
        "priceUsd": 287299
      }
    ]
  },
  {
    "handle": "vectrarack-gaudi-3-ai-accelerator-server",
    "title": "VectraRack Gaudi 3 AI Accelerator Server",
    "category": "GPU Rack Servers",
    "description": "Intel Gaudi 3-class AI accelerator server for teams evaluating cost-controlled training and inference alternatives, especially where Ethernet scale-out, enterprise procurement, and non-CUDA software planning matter.",
    "bestFor": "AI accelerator evaluations, training pilots, inference pilots, Ethernet scale-out, budget-conscious enterprise AI",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships after allocation and software compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "4x Gaudi 3 / 1TB RAM / Ethernet fabric",
        "sku": "VC-GAUDI3-X4-1TB",
        "optionValue": "4x Gaudi 3 / 1TB RAM / Ethernet fabric",
        "priceUsd": 58499
      },
      {
        "title": "8x Gaudi 3 / 2TB RAM / Ethernet fabric",
        "sku": "VC-GAUDI3-X8-2TB",
        "optionValue": "8x Gaudi 3 / 2TB RAM / Ethernet fabric",
        "priceUsd": 110499
      },
      {
        "title": "8x Gaudi 3 / 2TB RAM / Ethernet fabric / expanded memory and deployment support",
        "sku": "VC-GAUDI3-X8-2TB-MAX",
        "optionValue": "8x Gaudi 3 / 2TB RAM / Ethernet fabric / expanded memory and deployment support",
        "priceUsd": 146899
      }
    ]
  },
  {
    "handle": "vectrarack-refurb-h200-server",
    "title": "VectraRack Refurb H200 Server",
    "category": "Refurbished & Certified",
    "description": "Validated refurbished H200-class GPU server for enterprises and labs that need very large HBM memory for LLM inference, long-context workloads, RAG, and training refresh projects with stronger budget control than new flagship systems.",
    "bestFor": "LLM inference, long-context AI, RAG, training refresh, validated refurbished GPU infrastructure",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 12-20 business days after validation",
    "specs": [],
    "variants": [
      {
        "title": "4x Refurb H200 141GB / 1TB RAM / 200GbE",
        "sku": "VC-REF-H200X4-1TB-200G",
        "optionValue": "4x Refurb H200 141GB / 1TB RAM / 200GbE",
        "priceUsd": 90999
      },
      {
        "title": "8x Refurb H200 141GB / 2TB RAM / 400GbE",
        "sku": "VC-REF-H200X8-2TB-400G",
        "optionValue": "8x Refurb H200 141GB / 2TB RAM / 400GbE",
        "priceUsd": 175499
      },
      {
        "title": "8x Refurb H200 141GB / 2TB RAM / 800GbE",
        "sku": "VC-REF-H200X8-2TB-400G-MAX",
        "optionValue": "8x Refurb H200 141GB / 2TB RAM / 800GbE",
        "priceUsd": 234649
      }
    ]
  },
  {
    "handle": "vectrarack-b200-quote-ready-ai-cluster",
    "title": "VectraRack B200 Quote-Ready AI Cluster",
    "category": "GPU Rack Servers",
    "description": "Quote-ready B200-class AI cluster planning product for enterprises building next-generation AI training, high-throughput inference, and large private model infrastructure with power, cooling, fabric, procurement, and deployment review.",
    "bestFor": "Enterprise AI clusters, AI factories, large model training, high-throughput inference, private GPU infrastructure",
    "condition": "New allocation-dependent hardware",
    "warranty": "Enterprise warranty and support options reviewed by quote",
    "leadTime": "Quote-only after allocation and facility review",
    "specs": [],
    "variants": [
      {
        "title": "B200-class cluster planning deposit",
        "sku": "VC-B200-CLUSTER-PLAN",
        "optionValue": "B200-class cluster planning deposit",
        "priceUsd": 6499
      },
      {
        "title": "B200-class pilot rack quote package",
        "sku": "VC-B200-PILOT-RACK",
        "optionValue": "B200-class pilot rack quote package",
        "priceUsd": 32499
      },
      {
        "title": "B200-class pilot rack quote package / expanded memory and deployment support",
        "sku": "VC-B200-PILOT-RACK-MAX",
        "optionValue": "B200-class pilot rack quote package / expanded memory and deployment support",
        "priceUsd": 50699
      }
    ]
  },
  {
    "handle": "vectrarack-hgx-b200-8gpu-ai-server",
    "title": "VectraRack HGX B200 8-GPU AI Server",
    "category": "GPU Rack Servers",
    "description": "HGX B200-class 8-GPU AI server for buyers searching for NVIDIA B200 servers, Blackwell training hardware, large model training nodes, high-throughput inference servers, and next-generation AI infrastructure with rack, power, cooling, and fabric review.",
    "bestFor": "Blackwell AI training, large model training, high-throughput inference, private AI infrastructure, enterprise GPU servers",
    "condition": "New allocation-dependent hardware",
    "warranty": "Enterprise warranty and support reviewed by quote",
    "leadTime": "Quote-only after allocation and facility review",
    "specs": [],
    "variants": [
      {
        "title": "4x B200-class HGX / 2TB RAM / 400GbE",
        "sku": "VC-HGXB200-X4-2TB-400G",
        "optionValue": "4x B200-class HGX / 2TB RAM / 400GbE",
        "priceUsd": 324999
      },
      {
        "title": "8x B200-class HGX / 4TB RAM / 800GbE",
        "sku": "VC-HGXB200-X8-4TB-800G",
        "optionValue": "8x B200-class HGX / 4TB RAM / 800GbE",
        "priceUsd": 584999
      },
      {
        "title": "8x B200-class HGX / 4TB RAM / 800GbE / expanded memory and deployment support",
        "sku": "VC-HGXB200-X8-4TB-800G-MAX",
        "optionValue": "8x B200-class HGX / 4TB RAM / 800GbE / expanded memory and deployment support",
        "priceUsd": 766999
      }
    ]
  },
  {
    "handle": "vectraforge-rtx-pro-5000-blackwell-workstation",
    "title": "VectraForge RTX PRO 5000 Blackwell Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "Professional RTX PRO 5000 Blackwell-class AI workstation for engineers, creators, and data teams who need a more accessible pro GPU build than RTX PRO 6000 while keeping strong driver support, high VRAM options, and workstation reliability.",
    "bestFor": "Professional AI development, visual AI, simulation, content pipelines, data science workstations",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-14 business days",
    "specs": [],
    "variants": [
      {
        "title": "RTX PRO 5000 Blackwell / 128GB RAM / 4TB NVMe",
        "sku": "VC-PRO5000BW-128-4T",
        "optionValue": "RTX PRO 5000 Blackwell / 128GB RAM / 4TB NVMe",
        "priceUsd": 5849
      },
      {
        "title": "Dual RTX PRO 5000 Blackwell / 256GB RAM / 8TB NVMe",
        "sku": "VC-PRO5000BWX2-256-8T",
        "optionValue": "Dual RTX PRO 5000 Blackwell / 256GB RAM / 8TB NVMe",
        "priceUsd": 10399
      },
      {
        "title": "Dual RTX PRO 5000 Blackwell / 512GB RAM / 16TB NVMe",
        "sku": "VC-PRO5000BWX2-256-8T-MAX",
        "optionValue": "Dual RTX PRO 5000 Blackwell / 512GB RAM / 16TB NVMe",
        "priceUsd": 13584
      }
    ]
  },
  {
    "handle": "vectraforge-rtx-pro-6000-blackwell-mobile-ai-workstation",
    "title": "VectraForge RTX PRO 6000 Blackwell Mobile AI Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "Portable RTX PRO 6000 Blackwell-class mobile AI workstation for buyers searching for laptop-class professional AI hardware, CUDA development, on-site demos, robotics field work, visual AI, and compact high-VRAM workstation deployments.",
    "bestFor": "Portable CUDA development, field AI demos, robotics work, visual AI, professional mobile workstation workflows",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 10-18 business days after configuration review",
    "specs": [],
    "variants": [
      {
        "title": "RTX PRO 6000 Blackwell Mobile-class / 128GB RAM / 4TB NVMe",
        "sku": "VC-PRO6000BW-MOB-128-4T",
        "optionValue": "RTX PRO 6000 Blackwell Mobile-class / 128GB RAM / 4TB NVMe",
        "priceUsd": 7799
      },
      {
        "title": "RTX PRO 6000 Blackwell Mobile-class / 192GB RAM / 8TB NVMe",
        "sku": "VC-PRO6000BW-MOB-192-8T",
        "optionValue": "RTX PRO 6000 Blackwell Mobile-class / 192GB RAM / 8TB NVMe",
        "priceUsd": 9749
      },
      {
        "title": "RTX PRO 6000 Blackwell Mobile-class / 256GB RAM / 16TB NVMe",
        "sku": "VC-PRO6000BW-MOB-192-8T-MAX",
        "optionValue": "RTX PRO 6000 Blackwell Mobile-class / 256GB RAM / 16TB NVMe",
        "priceUsd": 12674
      }
    ]
  },
  {
    "handle": "vectraforge-rtx-pro-4000-blackwell-workstation",
    "title": "VectraForge RTX PRO 4000 Blackwell Workstation",
    "category": "AI & Deep Learning Workstations",
    "description": "Entry professional Blackwell AI workstation for small businesses, designers, researchers, and developers who need certified pro GPU behavior, CUDA support, quiet thermals, and practical local inference without buying a flagship system.",
    "bestFor": "Small-business AI, local inference, engineering work, visualization, AI development",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 5-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "RTX PRO 4000 Blackwell / 64GB RAM / 2TB NVMe",
        "sku": "VC-PRO4000BW-64-2T",
        "optionValue": "RTX PRO 4000 Blackwell / 64GB RAM / 2TB NVMe",
        "priceUsd": 3249
      },
      {
        "title": "RTX PRO 4500 Blackwell / 128GB RAM / 4TB NVMe",
        "sku": "VC-PRO4500BW-128-4T",
        "optionValue": "RTX PRO 4500 Blackwell / 128GB RAM / 4TB NVMe",
        "priceUsd": 4549
      },
      {
        "title": "RTX PRO 4500 Blackwell / 256GB RAM / 8TB NVMe",
        "sku": "VC-PRO4500BW-128-4T-MAX",
        "optionValue": "RTX PRO 4500 Blackwell / 256GB RAM / 8TB NVMe",
        "priceUsd": 5914
      }
    ]
  },
  {
    "handle": "vectraforge-arc-pro-b70-vram-lab",
    "title": "VectraForge Arc Pro B70 VRAM Lab",
    "category": "AI & Deep Learning Workstations",
    "description": "Budget high-VRAM AI workstation built around Intel Arc Pro B70-class GPUs for buyers searching for affordable aggregate VRAM, local LLM experimentation, embeddings, quantized inference, and OpenVINO or oneAPI development.",
    "bestFor": "Budget local inference, OpenVINO development, quantized LLM testing, embeddings, AI experimentation",
    "condition": "New",
    "warranty": "2-year parts / 3-year labor option",
    "leadTime": "Ships in 7-14 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "2x Arc Pro B70 32GB / 128GB RAM / 4TB NVMe",
        "sku": "VC-B70-X2-128-4T",
        "optionValue": "2x Arc Pro B70 32GB / 128GB RAM / 4TB NVMe",
        "priceUsd": 3249
      },
      {
        "title": "4x Arc Pro B70 32GB / 256GB RAM / 8TB NVMe",
        "sku": "VC-B70-X4-256-8T",
        "optionValue": "4x Arc Pro B70 32GB / 256GB RAM / 8TB NVMe",
        "priceUsd": 5199
      },
      {
        "title": "4x Arc Pro B70 32GB / 512GB RAM / 16TB NVMe",
        "sku": "VC-B70-X4-256-8T-MAX",
        "optionValue": "4x Arc Pro B70 32GB / 512GB RAM / 16TB NVMe",
        "priceUsd": 6759
      }
    ]
  },
  {
    "handle": "vectraedge-ai-inference-appliance",
    "title": "VectraEdge AI Inference Appliance",
    "category": "Edge & Robotics",
    "description": "Compact edge AI inference appliance for factories, retail sites, hospitals, campuses, and branch offices that need private local model serving, camera analytics, or RAG endpoints close to the data source.",
    "bestFor": "Edge inference, branch AI, camera analytics, private local AI, industrial AI deployments",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-14 business days",
    "specs": [],
    "variants": [
      {
        "title": "L4 24GB / 128GB RAM / 8TB NVMe",
        "sku": "VC-EDGE-INF-L4-128-8T",
        "optionValue": "L4 24GB / 128GB RAM / 8TB NVMe",
        "priceUsd": 8449
      },
      {
        "title": "RTX 4000 SFF-class / 64GB RAM / 4TB NVMe",
        "sku": "VC-EDGE-INF-SFF-64-4T",
        "optionValue": "RTX 4000 SFF-class / 64GB RAM / 4TB NVMe",
        "priceUsd": 4549
      },
      {
        "title": "L4 24GB / 256GB RAM / 16TB NVMe",
        "sku": "VC-EDGE-INF-L4-128-8T-MAX",
        "optionValue": "L4 24GB / 256GB RAM / 16TB NVMe",
        "priceUsd": 11179
      }
    ]
  },
  {
    "handle": "vectralease-refurbished-ai-server-bundle",
    "title": "VectraLease Refurbished AI Server Bundle",
    "category": "Refurbished & Certified",
    "description": "Refurbished AI server bundle for buyers who want validated used GPU hardware with warranty options, deployment help, and leasing or PO support instead of paying full new-system pricing upfront.",
    "bestFor": "Budget AI infrastructure, startups, labs, universities, refurbished GPU clusters, lease-friendly AI servers",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 10-20 business days after validation",
    "specs": [],
    "variants": [
      {
        "title": "Refurbished A100 bundle / validation report",
        "sku": "VC-LEASE-A100-BUNDLE",
        "optionValue": "Refurbished A100 bundle / validation report",
        "priceUsd": 38999
      },
      {
        "title": "Refurbished H100 bundle / validation report",
        "sku": "VC-LEASE-H100-BUNDLE",
        "optionValue": "Refurbished H100 bundle / validation report",
        "priceUsd": 58499
      },
      {
        "title": "Refurbished L40S inference bundle",
        "sku": "VC-LEASE-L40S-BUNDLE",
        "optionValue": "Refurbished L40S inference bundle",
        "priceUsd": 22749
      }
    ]
  },
  {
    "handle": "vectracluster-ai-starter-rack",
    "title": "VectraCluster AI Starter Rack",
    "category": "GPU Rack Servers",
    "description": "AI starter rack for companies, universities, and research teams that need a properly planned first GPU cluster with compute nodes, high-speed networking, shared NVMe storage, rack accessories, and deployment handoff.",
    "bestFor": "First AI cluster, university labs, startup GPU infrastructure, private AI deployment, research compute",
    "condition": "New or validated refurbished options",
    "warranty": "Rack-level warranty options available",
    "leadTime": "Ships in 20-40 business days after rack plan approval",
    "specs": [],
    "variants": [
      {
        "title": "2-node starter rack / 100GbE / shared NVMe",
        "sku": "VC-RACK-STARTER-2N",
        "optionValue": "2-node starter rack / 100GbE / shared NVMe",
        "priceUsd": 84499
      },
      {
        "title": "4-node starter rack / 400GbE / shared NVMe",
        "sku": "VC-RACK-STARTER-4N",
        "optionValue": "4-node starter rack / 400GbE / shared NVMe",
        "priceUsd": 259999
      },
      {
        "title": "4-node starter rack / 800GbE / shared NVMe",
        "sku": "VC-RACK-STARTER-4N-MAX",
        "optionValue": "4-node starter rack / 800GbE / shared NVMe",
        "priceUsd": 382849
      }
    ]
  },
  {
    "handle": "vectramem-1tb-ddr5-ecc-ai-memory-kit",
    "title": "VectraMem 1TB DDR5 ECC AI Memory Kit",
    "category": "Storage & Memory",
    "description": "1TB DDR5 ECC memory upgrade kit for AI servers, RAG systems, vector databases, CPU-assisted inference, dataset preprocessing, and buyers searching for high-memory AI server upgrades.",
    "bestFor": "RAG servers, vector databases, high-memory inference, dataset preprocessing, CPU-assisted AI workloads",
    "condition": "New",
    "warranty": "Lifetime manufacturer warranty plus support option",
    "leadTime": "Ships in 3-7 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "512GB DDR5 ECC validated kit",
        "sku": "VC-MEM-DDR5ECC-512G",
        "optionValue": "512GB DDR5 ECC validated kit",
        "priceUsd": 2144
      },
      {
        "title": "1TB DDR5 ECC validated kit",
        "sku": "VC-MEM-DDR5ECC-1TB",
        "optionValue": "1TB DDR5 ECC validated kit",
        "priceUsd": 3899
      },
      {
        "title": "1TB DDR5 ECC kit with install validation",
        "sku": "VC-MEM-DDR5ECC-1TB-INSTALL",
        "optionValue": "1TB DDR5 ECC kit with install validation",
        "priceUsd": 4419
      }
    ]
  },
  {
    "handle": "vectramem-2tb-rag-inference-memory-kit",
    "title": "VectraMem 2TB RAG Inference Memory Kit",
    "category": "Storage & Memory",
    "description": "2TB-class high-memory server upgrade for enterprise RAG, long-context LLM serving, embedding pipelines, graph/vector databases, and AI applications where CPU memory capacity matters as much as GPU VRAM.",
    "bestFor": "Enterprise RAG, long-context LLM serving, graph databases, vector search, embedding pipelines",
    "condition": "New",
    "warranty": "Lifetime manufacturer warranty plus support option",
    "leadTime": "Ships in 5-10 business days after platform review",
    "specs": [],
    "variants": [
      {
        "title": "1.5TB DDR5 ECC high-memory kit",
        "sku": "VC-MEM-DDR5ECC-1536G",
        "optionValue": "1.5TB DDR5 ECC high-memory kit",
        "priceUsd": 5849
      },
      {
        "title": "2TB DDR5 ECC high-memory kit",
        "sku": "VC-MEM-DDR5ECC-2TB",
        "optionValue": "2TB DDR5 ECC high-memory kit",
        "priceUsd": 8449
      },
      {
        "title": "Complete 2TB DDR5 ECC high-memory kit / compatibility-reviewed package",
        "sku": "VC-MEM-DDR5ECC-2TB-MAX",
        "optionValue": "Complete 2TB DDR5 ECC high-memory kit / compatibility-reviewed package",
        "priceUsd": 10984
      }
    ]
  },
  {
    "handle": "vectrastore-120tb-nvme-dataset-expansion-kit",
    "title": "VectraStore 120TB NVMe Dataset Expansion Kit",
    "category": "Storage & Memory",
    "description": "120TB NVMe expansion kit for AI datasets, model checkpoints, vector indexes, embeddings, image/video corpora, and teams upgrading existing GPU servers with fast local training or inference storage.",
    "bestFor": "AI datasets, model checkpoints, embeddings, RAG indexes, video AI corpora, local GPU server storage",
    "condition": "New",
    "warranty": "5-year drive warranty options",
    "leadTime": "Ships in 3-10 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "30TB U.2/U.3 NVMe expansion kit",
        "sku": "VC-NVME-DATASET-30T",
        "optionValue": "30TB U.2/U.3 NVMe expansion kit",
        "priceUsd": 3899
      },
      {
        "title": "60TB U.2/U.3 NVMe expansion kit",
        "sku": "VC-NVME-DATASET-60T",
        "optionValue": "60TB U.2/U.3 NVMe expansion kit",
        "priceUsd": 7149
      },
      {
        "title": "120TB U.2/U.3 NVMe expansion kit",
        "sku": "VC-NVME-DATASET-120T",
        "optionValue": "120TB U.2/U.3 NVMe expansion kit",
        "priceUsd": 12999
      }
    ]
  },
  {
    "handle": "vectrarack-h200-nvl-inference-appliance",
    "title": "VectraRack H200 NVL Inference Appliance",
    "category": "GPU Rack Servers",
    "description": "H200 NVL-class inference appliance for large-context LLM serving, RAG at scale, high-throughput private AI endpoints, and buyers searching for high-memory GPU inference servers without full rack-scale cluster complexity.",
    "bestFor": "Long-context LLM serving, RAG at scale, private AI APIs, high-throughput inference, enterprise model serving",
    "condition": "New allocation-dependent hardware",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships after allocation and workload review",
    "specs": [],
    "variants": [
      {
        "title": "2x H200 NVL-class / 1TB RAM / 200GbE",
        "sku": "VC-H200NVL-X2-1TB-200G",
        "optionValue": "2x H200 NVL-class / 1TB RAM / 200GbE",
        "priceUsd": 71499
      },
      {
        "title": "4x H200 NVL-class / 2TB RAM / 400GbE",
        "sku": "VC-H200NVL-X4-2TB-400G",
        "optionValue": "4x H200 NVL-class / 2TB RAM / 400GbE",
        "priceUsd": 136499
      },
      {
        "title": "4x H200 NVL-class / 2TB RAM / 800GbE",
        "sku": "VC-H200NVL-X4-2TB-400G-MAX",
        "optionValue": "4x H200 NVL-class / 2TB RAM / 800GbE",
        "priceUsd": 181999
      }
    ]
  },
  {
    "handle": "vectrarack-gb300-nvl72-quote-ready-rack",
    "title": "VectraRack GB300 NVL72 Quote-Ready Rack",
    "category": "GPU Rack Servers",
    "description": "GB300 NVL72-class quote-ready AI rack planning product for enterprises evaluating Blackwell Ultra infrastructure, rack-scale inference, large model training, liquid cooling, high-density power, and 800GbE-class fabric.",
    "bestFor": "AI factories, rack-scale inference, large model training, enterprise GPU infrastructure, Blackwell Ultra planning",
    "condition": "New allocation-dependent hardware",
    "warranty": "Enterprise warranty and support reviewed by quote",
    "leadTime": "Quote-only after allocation and facility review",
    "specs": [],
    "variants": [
      {
        "title": "GB300 NVL72 readiness assessment",
        "sku": "VC-GB300-NVL72-ASSESS",
        "optionValue": "GB300 NVL72 readiness assessment",
        "priceUsd": 9749
      },
      {
        "title": "GB300 NVL72 pilot rack quote package",
        "sku": "VC-GB300-NVL72-PILOT",
        "optionValue": "GB300 NVL72 pilot rack quote package",
        "priceUsd": 64999
      },
      {
        "title": "GB300 NVL72 pilot rack quote package / expanded memory and deployment support",
        "sku": "VC-GB300-NVL72-PILOT-MAX",
        "optionValue": "GB300 NVL72 pilot rack quote package / expanded memory and deployment support",
        "priceUsd": 103674
      }
    ]
  },
  {
    "handle": "vectrarack-gb200-nvl72-ai-factory-rack",
    "title": "VectraRack GB200 NVL72 AI Factory Rack",
    "category": "GPU Rack Servers",
    "description": "GB200 NVL72-class AI factory rack planning product for enterprises searching for NVIDIA GB200 NVL72 systems, Blackwell rack-scale training, liquid-cooled AI infrastructure, giant model inference, and high-density GPU data center deployments.",
    "bestFor": "AI factories, giant model inference, rack-scale training, liquid-cooled AI infrastructure, enterprise GPU data centers",
    "condition": "New allocation-dependent hardware",
    "warranty": "Enterprise warranty and support reviewed by quote",
    "leadTime": "Quote-only after allocation and facility review",
    "specs": [],
    "variants": [
      {
        "title": "GB200 NVL72 facility readiness assessment",
        "sku": "VC-GB200-NVL72-ASSESS",
        "optionValue": "GB200 NVL72 facility readiness assessment",
        "priceUsd": 9749
      },
      {
        "title": "GB200 NVL72 pilot rack quote package",
        "sku": "VC-GB200-NVL72-PILOT",
        "optionValue": "GB200 NVL72 pilot rack quote package",
        "priceUsd": 64999
      },
      {
        "title": "GB200 NVL72 pilot rack quote package / expanded memory and deployment support",
        "sku": "VC-GB200-NVL72-PILOT-MAX",
        "optionValue": "GB200 NVL72 pilot rack quote package / expanded memory and deployment support",
        "priceUsd": 103674
      }
    ]
  },
  {
    "handle": "vectrarubin-ai-cluster-readiness-package",
    "title": "VectraRubin AI Cluster Readiness Package",
    "category": "Components & Accessories",
    "description": "Future AI cluster readiness package for buyers preparing facilities, power, cooling, networking, storage, and procurement plans for Rubin-era and next-generation GPU infrastructure.",
    "bestFor": "Future AI clusters, facility planning, procurement roadmaps, power and cooling readiness, network topology planning",
    "condition": "Planning service",
    "warranty": "Planning service with documented handoff",
    "leadTime": "Scheduling in 5-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "Rubin-era facility readiness review",
        "sku": "VC-RUBIN-READY-FACILITY",
        "optionValue": "Rubin-era facility readiness review",
        "priceUsd": 5199
      },
      {
        "title": "Next-gen AI cluster topology package",
        "sku": "VC-RUBIN-READY-TOPOLOGY",
        "optionValue": "Next-gen AI cluster topology package",
        "priceUsd": 9749
      },
      {
        "title": "Complete Next-gen AI cluster topology package / compatibility-reviewed package",
        "sku": "VC-RUBIN-READY-TOPOLOGY-MAX",
        "optionValue": "Complete Next-gen AI cluster topology package / compatibility-reviewed package",
        "priceUsd": 12934
      }
    ]
  },
  {
    "handle": "vectrapower-60kw-ai-rack-pdu-kit",
    "title": "VectraPower 60kW AI Rack PDU Kit",
    "category": "Power & Cooling",
    "description": "AI rack power distribution kit for high-density GPU servers, H200/B200-class deployments, liquid-cooled racks, and buyers who need metered PDUs, cabling review, redundancy planning, and power readiness before installing AI hardware.",
    "bestFor": "High-density GPU racks, AI data center power readiness, H200/B200 deployments, liquid-cooled racks",
    "condition": "New",
    "warranty": "Manufacturer warranty plus deployment support option",
    "leadTime": "Ships or schedules in 7-20 business days after power review",
    "specs": [],
    "variants": [
      {
        "title": "30kW AI rack PDU readiness kit",
        "sku": "VC-PWR-PDU-30KW",
        "optionValue": "30kW AI rack PDU readiness kit",
        "priceUsd": 3899
      },
      {
        "title": "60kW AI rack PDU readiness kit",
        "sku": "VC-PWR-PDU-60KW",
        "optionValue": "60kW AI rack PDU readiness kit",
        "priceUsd": 7799
      },
      {
        "title": "Redundant AI rack power planning bundle",
        "sku": "VC-PWR-PDU-REDUNDANT",
        "optionValue": "Redundant AI rack power planning bundle",
        "priceUsd": 11699
      }
    ]
  },
  {
    "handle": "vectracool-cdu-liquid-cooling-package",
    "title": "VectraCool CDU Liquid Cooling Package",
    "category": "Power & Cooling",
    "description": "CDU and direct-to-chip liquid cooling readiness package for dense GPU racks, GB300/B200/H200-class systems, facility loop planning, leak testing, coolant path review, and deployment documentation.",
    "bestFor": "Liquid-cooled AI racks, high-density GPU servers, GB300/B200/H200 deployments, facility cooling upgrades",
    "condition": "New and quote-dependent",
    "warranty": "Manufacturer warranty and deployment support reviewed by quote",
    "leadTime": "Schedules in 10-25 business days after facility review",
    "specs": [],
    "variants": [
      {
        "title": "Direct-to-chip cooling readiness package",
        "sku": "VC-CDU-D2C-READY",
        "optionValue": "Direct-to-chip cooling readiness package",
        "priceUsd": 9749
      },
      {
        "title": "Rack CDU planning and validation package",
        "sku": "VC-CDU-RACK-PLAN",
        "optionValue": "Rack CDU planning and validation package",
        "priceUsd": 19499
      },
      {
        "title": "Liquid-cooled AI rack deployment package",
        "sku": "VC-CDU-RACK-DEPLOY",
        "optionValue": "Liquid-cooled AI rack deployment package",
        "priceUsd": 38999
      }
    ]
  },
  {
    "handle": "vectraops-gpu-server-monitoring-appliance",
    "title": "VectraOps GPU Server Monitoring Appliance",
    "category": "GPU Rack Servers",
    "description": "GPU server monitoring appliance for AI teams that need visibility into GPU thermals, utilization, power draw, storage health, network links, alerts, and uptime before production inference or training workloads become business-critical.",
    "bestFor": "Production inference, GPU clusters, AI labs, refurbished server fleets, uptime and thermal monitoring",
    "condition": "New",
    "warranty": "3-year appliance warranty option",
    "leadTime": "Ships in 5-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "Monitoring appliance for up to 10 nodes",
        "sku": "VC-OPS-MON-10N",
        "optionValue": "Monitoring appliance for up to 10 nodes",
        "priceUsd": 4549
      },
      {
        "title": "Monitoring appliance for up to 50 nodes",
        "sku": "VC-OPS-MON-50N",
        "optionValue": "Monitoring appliance for up to 50 nodes",
        "priceUsd": 9749
      },
      {
        "title": "Monitoring setup with remote handoff",
        "sku": "VC-OPS-MON-HANDOFF",
        "optionValue": "Monitoring setup with remote handoff",
        "priceUsd": 12999
      }
    ]
  },
  {
    "handle": "vectrajetson-thor-robotics-ai-kit",
    "title": "VectraJetson Thor Robotics AI Kit",
    "category": "Edge & Robotics",
    "description": "Jetson Thor-class robotics AI kit for physical AI, humanoid robotics, autonomous machines, industrial automation, sensor fusion, local VLA inference, and buyers searching for NVIDIA Jetson Thor edge AI hardware.",
    "bestFor": "Physical AI, humanoid robotics, autonomous machines, sensor fusion, robotics perception, edge inference",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 5-15 business days after allocation review",
    "specs": [],
    "variants": [
      {
        "title": "Jetson Thor-class developer kit",
        "sku": "VC-JETSON-THOR-DEV",
        "optionValue": "Jetson Thor-class developer kit",
        "priceUsd": 2599
      },
      {
        "title": "Jetson Thor robotics validation kit",
        "sku": "VC-JETSON-THOR-ROBOTICS",
        "optionValue": "Jetson Thor robotics validation kit",
        "priceUsd": 4549
      },
      {
        "title": "Jetson Thor multi-sensor bundle",
        "sku": "VC-JETSON-THOR-SENSOR",
        "optionValue": "Jetson Thor multi-sensor bundle",
        "priceUsd": 6499
      }
    ]
  },
  {
    "handle": "vectrahailo-edge-npu-gateway",
    "title": "VectraHailo Edge NPU Gateway",
    "category": "Edge & Robotics",
    "description": "Hailo-class edge NPU gateway for low-power computer vision, generative edge AI pilots, smart cameras, retail analytics, industrial inspection, and buyers searching for efficient AI accelerators outside traditional GPU servers.",
    "bestFor": "Low-power vision AI, smart cameras, retail analytics, industrial inspection, edge AI pilots",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 3-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "Hailo-class M.2 NPU gateway",
        "sku": "VC-HAILO-NPU-M2",
        "optionValue": "Hailo-class M.2 NPU gateway",
        "priceUsd": 584
      },
      {
        "title": "Hailo-class edge vision gateway",
        "sku": "VC-HAILO-NPU-VISION",
        "optionValue": "Hailo-class edge vision gateway",
        "priceUsd": 1299
      },
      {
        "title": "Multi-camera Hailo-class gateway",
        "sku": "VC-HAILO-NPU-MULTICAM",
        "optionValue": "Multi-camera Hailo-class gateway",
        "priceUsd": 2274
      }
    ]
  },
  {
    "handle": "vectravision-ai-video-analytics-server",
    "title": "VectraVision AI Video Analytics Server",
    "category": "GPU Rack Servers",
    "description": "AI video analytics server for security operations, retail footfall analytics, manufacturing inspection, traffic monitoring, campus safety, and multi-camera inference workloads where stream count, retention, latency, and model accuracy all matter.",
    "bestFor": "Security analytics, retail analytics, manufacturing inspection, traffic monitoring, campus video AI",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "24-stream L4 video analytics server",
        "sku": "VC-VIDEOAI-L4-24STREAM",
        "optionValue": "24-stream L4 video analytics server",
        "priceUsd": 11699
      },
      {
        "title": "64-stream dual L4 video analytics server",
        "sku": "VC-VIDEOAI-L4X2-64STREAM",
        "optionValue": "64-stream dual L4 video analytics server",
        "priceUsd": 21449
      },
      {
        "title": "128-stream L40S video analytics server",
        "sku": "VC-VIDEOAI-L40S-128STREAM",
        "optionValue": "128-stream L40S video analytics server",
        "priceUsd": 38999
      }
    ]
  },
  {
    "handle": "vectra-core-ultra-9",
    "title": "Vectra Core Ultra 9",
    "category": "Workstations by CPU Platform",
    "description": "An Intel Core Ultra 9 workstation built for engineers who want strong single-thread performance alongside solid GPU acceleration for smaller models.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Core Ultra 9 / RTX 4070 Ti Super 16GB / 64GB RAM / 1TB NVMe",
        "sku": "VC-CU9-4070TIS-64-1T",
        "optionValue": "Core Ultra 9 / RTX 4070 Ti Super 16GB / 64GB RAM / 1TB NVMe",
        "priceUsd": 1494
      },
      {
        "title": "Core Ultra 9 / RTX 4080 16GB / 64GB RAM / 1TB NVMe",
        "sku": "VC-CU9-4080-64-1T",
        "optionValue": "Core Ultra 9 / RTX 4080 16GB / 64GB RAM / 1TB NVMe",
        "priceUsd": 1819
      },
      {
        "title": "Core Ultra 9 / RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-CU9-5090-128-2T",
        "optionValue": "Core Ultra 9 / RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 3184
      }
    ]
  },
  {
    "handle": "vectra-xeon-w9",
    "title": "Vectra Xeon W9",
    "category": "Workstations by CPU Platform",
    "description": "Intel Xeon W workstation-class platform with massive memory bandwidth and PCIe lane count — ideal for data preprocessing pipelines that bottleneck on CPU.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Xeon w9 / RTX 5090 32GB / 128GB ECC RAM / 2TB NVMe",
        "sku": "VC-XW9-5090-128-2T",
        "optionValue": "Xeon w9 / RTX 5090 32GB / 128GB ECC RAM / 2TB NVMe",
        "priceUsd": 5524
      },
      {
        "title": "Xeon w9-3495X / RTX 6000 Ada 48GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-XW9-6000ADA-256-4T",
        "optionValue": "Xeon w9-3495X / RTX 6000 Ada 48GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 8124
      },
      {
        "title": "Xeon w9 / RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 8TB NVMe",
        "sku": "VC-XW9-RPRO6000-512-8T",
        "optionValue": "Xeon w9 / RTX PRO 6000 Blackwell 96GB / 512GB ECC RAM / 8TB NVMe",
        "priceUsd": 14299
      }
    ]
  },
  {
    "handle": "vectra-threadripper-pro",
    "title": "Vectra Threadripper Pro",
    "category": "Workstations by CPU Platform",
    "description": "AMD Threadripper PRO platform pairing high core counts with dual-GPU acceleration — a favorite for mixed CPU/GPU simulation and training workloads.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Threadripper PRO / RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "sku": "VC-TRPRO-5090-128-2T",
        "optionValue": "Threadripper PRO / RTX 5090 32GB / 128GB RAM / 2TB NVMe",
        "priceUsd": 5849
      },
      {
        "title": "Threadripper PRO 7975WX / Dual RTX 4090 / 256GB RAM / 4TB NVMe",
        "sku": "VC-TRPRO-4090X2-256-4T",
        "optionValue": "Threadripper PRO 7975WX / Dual RTX 4090 / 256GB RAM / 4TB NVMe",
        "priceUsd": 9099
      },
      {
        "title": "Threadripper PRO / Dual RTX 5090 / 512GB RAM / 8TB NVMe",
        "sku": "VC-TRPRO-5090X2-512-8T",
        "optionValue": "Threadripper PRO / Dual RTX 5090 / 512GB RAM / 8TB NVMe",
        "priceUsd": 14299
      }
    ]
  },
  {
    "handle": "vectra-epyc-edge",
    "title": "Vectra EPYC Edge",
    "category": "Workstations by CPU Platform",
    "description": "AMD EPYC workstation/server hybrid with server-grade RAS features in a deskside chassis — built for teams that want server reliability on a desk, not a rack.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "EPYC / RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "sku": "VC-EPYCEDGE-5090-256-4T",
        "optionValue": "EPYC / RTX 5090 32GB / 256GB RAM / 4TB NVMe",
        "priceUsd": 7799
      },
      {
        "title": "EPYC 9354 / RTX 6000 Ada 48GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-EPYCEDGE-6000ADA-512-8T",
        "optionValue": "EPYC 9354 / RTX 6000 Ada 48GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 11699
      },
      {
        "title": "EPYC / RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "sku": "VC-EPYCEDGE-RPRO6000-1TB-16T",
        "optionValue": "EPYC / RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "priceUsd": 18199
      }
    ]
  },
  {
    "handle": "vectra-ryzen-9-compact",
    "title": "Vectra Ryzen 9 Compact",
    "category": "Workstations by CPU Platform",
    "description": "An AMD Ryzen 9 compact workstation for individual developers and small teams who need real GPU acceleration without enterprise-platform pricing.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Ryzen 9 9950X / RTX 4070 Ti Super 16GB / 32GB RAM / 1TB NVMe",
        "sku": "VC-RYZ9C-4070TIS-32-1T",
        "optionValue": "Ryzen 9 9950X / RTX 4070 Ti Super 16GB / 32GB RAM / 1TB NVMe",
        "priceUsd": 1429
      },
      {
        "title": "Ryzen 9 9950X / RTX 5080 16GB / 64GB RAM / 2TB NVMe",
        "sku": "VC-RYZ9C-5080-64-2T",
        "optionValue": "Ryzen 9 9950X / RTX 5080 16GB / 64GB RAM / 2TB NVMe",
        "priceUsd": 2079
      },
      {
        "title": "Ryzen 9 9950X / RTX 5090 32GB / 96GB RAM / 4TB NVMe",
        "sku": "VC-RYZ9C-5090-96-4T",
        "optionValue": "Ryzen 9 9950X / RTX 5090 32GB / 96GB RAM / 4TB NVMe",
        "priceUsd": 3184
      }
    ]
  },
  {
    "handle": "vectra-redundant-psu",
    "title": "Vectra Redundant PSU",
    "category": "Power & Cooling",
    "description": "80+ Titanium redundant power supply for VectraRack servers and high-draw multi-GPU workstations. Hot-swappable in the rack-mount chassis.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "1600W",
        "sku": "VC-PSU-1600",
        "optionValue": "1600W",
        "priceUsd": 279
      },
      {
        "title": "2000W",
        "sku": "VC-PSU-2000",
        "optionValue": "2000W",
        "priceUsd": 357
      }
    ]
  },
  {
    "handle": "vectra-liquid-cooling-kit",
    "title": "Vectra Liquid Cooling Kit",
    "category": "Power & Cooling",
    "description": "360mm AIO loop covering both CPU and GPU on supported VectraForge chassis. Drop-in upgrade kit for quieter, cooler sustained workloads.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "Standard 360mm AIO kit",
        "sku": "VC-COOL-360AIO",
        "optionValue": "Standard 360mm AIO kit",
        "priceUsd": 253
      },
      {
        "title": "High-airflow 420mm AIO kit",
        "sku": "VC-COOL-420AIO",
        "optionValue": "High-airflow 420mm AIO kit",
        "priceUsd": 389
      }
    ]
  },
  {
    "handle": "vectra-nvme-expansion-card",
    "title": "Vectra NVMe Expansion Card",
    "category": "Storage & Memory",
    "description": "PCIe 5.0 quad M.2 expansion card for adding up to 4 additional NVMe drives to any VectraForge or VectraRack system with a free x16 slot.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "PCIe 4.0 x4 NVMe expansion card",
        "sku": "VC-NVME-PCIE4-X4",
        "optionValue": "PCIe 4.0 x4 NVMe expansion card",
        "priceUsd": 162
      },
      {
        "title": "PCIe 5.0 x4 NVMe expansion card",
        "sku": "VC-NVME-PCIE5-X4",
        "optionValue": "PCIe 5.0 x4 NVMe expansion card",
        "priceUsd": 253
      }
    ]
  },
  {
    "handle": "vectra-gpu-riser-cable",
    "title": "Vectra GPU Riser Cable",
    "category": "Components & Accessories",
    "description": "PCIe 5.0 x16 riser cable for vertical GPU mounting in VectraForge chassis, rated for full-bandwidth GPU-to-GPU and GPU-to-CPU transfer.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "PCIe 5.0 riser cable / 200mm",
        "sku": "VC-RISER-PCIE5-200",
        "optionValue": "PCIe 5.0 riser cable / 200mm",
        "priceUsd": 58
      },
      {
        "title": "PCIe 5.0 riser cable / 300mm shielded",
        "sku": "VC-RISER-PCIE5-300",
        "optionValue": "PCIe 5.0 riser cable / 300mm shielded",
        "priceUsd": 84
      }
    ]
  },
  {
    "handle": "vectra-rack-rail-kit",
    "title": "Vectra Rack Rail Kit",
    "category": "Components & Accessories",
    "description": "Universal 4-post sliding rail kit rated for VectraRack chassis up to 8U, tested for repeated full-extension service access in production racks.",
    "bestFor": "",
    "condition": "Built to order",
    "warranty": "1-year parts and labor warranty",
    "leadTime": "Ships after engineering validation",
    "specs": [],
    "variants": [
      {
        "title": "4-post rack rail kit",
        "sku": "VC-RAIL-4POST",
        "optionValue": "4-post rack rail kit",
        "priceUsd": 116
      },
      {
        "title": "Heavy-duty 4-post rack rail kit",
        "sku": "VC-RAIL-HD-4POST",
        "optionValue": "Heavy-duty 4-post rack rail kit",
        "priceUsd": 194
      }
    ]
  },
  {
    "handle": "vectra-rtx-pro-6000-blackwell-gpu",
    "title": "Vectra RTX PRO 6000 Blackwell GPU",
    "category": "Components & Accessories",
    "description": "Professional 96GB Blackwell-generation workstation GPU upgrade for validated VectraForge builds, high-VRAM AI development, simulation, rendering, and visual AI pipelines.",
    "bestFor": "GPU upgrades, high-VRAM AI, visual AI, simulation, CUDA workloads",
    "condition": "New",
    "warranty": "Manufacturer warranty plus installation support option",
    "leadTime": "Ships after allocation and compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "Workstation GPU upgrade",
        "sku": "VC-GPU-RTXPRO6000BW",
        "optionValue": "Workstation GPU upgrade",
        "priceUsd": 5849
      },
      {
        "title": "GPU upgrade with installation and validation",
        "sku": "VC-GPU-RTXPRO6000BW-INSTALL",
        "optionValue": "GPU upgrade with installation and validation",
        "priceUsd": 6174
      },
      {
        "title": "Complete GPU upgrade with installation and validation / compatibility-reviewed package",
        "sku": "VC-GPU-RTXPRO6000BW-INSTALL-MAX",
        "optionValue": "Complete GPU upgrade with installation and validation / compatibility-reviewed package",
        "priceUsd": 8026
      }
    ]
  },
  {
    "handle": "vectra-100gbe-ai-fabric-kit",
    "title": "Vectra 100GbE AI Fabric Kit",
    "category": "Networking & Interconnect",
    "description": "Networking upgrade kit for multi-node AI training, shared storage, and fast model-serving backplanes. Includes NIC, DAC/cabling options, and configuration guidance for compatible VectraRack systems.",
    "bestFor": "Multi-node training, shared storage, GPU clusters, production inference",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 3-7 business days",
    "specs": [],
    "variants": [
      {
        "title": "Single-node 100GbE NIC + DAC",
        "sku": "VC-NET-100G-SINGLE",
        "optionValue": "Single-node 100GbE NIC + DAC",
        "priceUsd": 844
      },
      {
        "title": "Dual-node 100GbE kit",
        "sku": "VC-NET-100G-DUAL",
        "optionValue": "Dual-node 100GbE kit",
        "priceUsd": 1559
      },
      {
        "title": "Dual-node 200GbE kit",
        "sku": "VC-NET-100G-DUAL-MAX",
        "optionValue": "Dual-node 200GbE kit",
        "priceUsd": 2059
      }
    ]
  },
  {
    "handle": "vectra-400gbe-ai-fabric-kit",
    "title": "Vectra 400GbE AI Fabric Kit",
    "category": "Networking & Interconnect",
    "description": "400GbE AI networking kit for GPU clusters, multi-node training, shared NVMe storage, and buyers searching for high-speed AI fabric upgrades beyond 100GbE.",
    "bestFor": "GPU clusters, multi-node training, shared NVMe storage, high-speed inference fabrics",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 5-10 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "Single-node 400GbE NIC + DAC",
        "sku": "VC-NET-400G-SINGLE",
        "optionValue": "Single-node 400GbE NIC + DAC",
        "priceUsd": 2144
      },
      {
        "title": "Dual-node 400GbE kit",
        "sku": "VC-NET-400G-DUAL",
        "optionValue": "Dual-node 400GbE kit",
        "priceUsd": 4094
      },
      {
        "title": "Four-node 400GbE cluster kit",
        "sku": "VC-NET-400G-QUAD",
        "optionValue": "Four-node 400GbE cluster kit",
        "priceUsd": 7799
      }
    ]
  },
  {
    "handle": "vectra-800gbe-ai-fabric-kit",
    "title": "Vectra 800GbE AI Fabric Kit",
    "category": "Networking & Interconnect",
    "description": "800GbE AI networking kit for high-density GPU clusters, next-generation training fabrics, shared NVMe storage, and buyers searching for ultra-high-speed AI cluster networking.",
    "bestFor": "High-density GPU clusters, next-generation training fabrics, shared NVMe storage, ultra-fast AI networking",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 10-20 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "Single-node 800GbE NIC + DAC",
        "sku": "VC-NET-800G-SINGLE",
        "optionValue": "Single-node 800GbE NIC + DAC",
        "priceUsd": 4549
      },
      {
        "title": "Dual-node 800GbE kit",
        "sku": "VC-NET-800G-DUAL",
        "optionValue": "Dual-node 800GbE kit",
        "priceUsd": 8449
      },
      {
        "title": "Four-node 800GbE cluster kit",
        "sku": "VC-NET-800G-QUAD",
        "optionValue": "Four-node 800GbE cluster kit",
        "priceUsd": 16249
      }
    ]
  },
  {
    "handle": "vectrastore-500tb-nvme-ai-storage-server",
    "title": "VectraStore 500TB NVMe AI Storage Server",
    "category": "Storage & Memory",
    "description": "500TB-class NVMe AI storage server for large datasets, model checkpoints, RAG indexes, embeddings, vector databases, shared GPU cluster storage, and buyers searching for high-capacity AI data infrastructure.",
    "bestFor": "Large AI datasets, model checkpoints, RAG indexes, vector databases, shared GPU cluster storage",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 15-25 business days",
    "specs": [],
    "variants": [
      {
        "title": "491TB NVMe / EPYC / 1TB RAM / 200GbE",
        "sku": "VC-STORE-491T-200G",
        "optionValue": "491TB NVMe / EPYC / 1TB RAM / 200GbE",
        "priceUsd": 58499
      },
      {
        "title": "491TB NVMe / EPYC / 1TB RAM / 400GbE",
        "sku": "VC-STORE-491T-400G",
        "optionValue": "491TB NVMe / EPYC / 1TB RAM / 400GbE",
        "priceUsd": 71499
      },
      {
        "title": "492TB NVMe / EPYC / 1TB RAM / 800GbE",
        "sku": "VC-STORE-491T-400G-MAX",
        "optionValue": "492TB NVMe / EPYC / 1TB RAM / 800GbE",
        "priceUsd": 92949
      }
    ]
  },
  {
    "handle": "vectrarack-cooling-readiness-kit",
    "title": "VectraRack Cooling Readiness Kit",
    "category": "Power & Cooling",
    "description": "AI rack cooling readiness kit for GPU servers, liquid-cooled nodes, high-density AI racks, direct-to-chip planning, airflow review, and buyers preparing facilities for AI infrastructure.",
    "bestFor": "AI server cooling, high-density racks, liquid cooling readiness, direct-to-chip planning, facility review",
    "condition": "New",
    "warranty": "Planning kit with support option",
    "leadTime": "Ships or schedules in 5-15 business days",
    "specs": [],
    "variants": [
      {
        "title": "Airflow and rack readiness kit",
        "sku": "VC-COOL-READY-AIR",
        "optionValue": "Airflow and rack readiness kit",
        "priceUsd": 1624
      },
      {
        "title": "Liquid-cooling readiness review kit",
        "sku": "VC-COOL-READY-LIQ",
        "optionValue": "Liquid-cooling readiness review kit",
        "priceUsd": 5199
      },
      {
        "title": "Direct-to-chip deployment planning kit",
        "sku": "VC-COOL-READY-D2C",
        "optionValue": "Direct-to-chip deployment planning kit",
        "priceUsd": 9749
      }
    ]
  },
  {
    "handle": "vectraedge-vision-ai-kit",
    "title": "VectraEdge Vision AI Kit",
    "category": "Edge & Robotics",
    "description": "Edge AI accelerator kit for computer vision, cameras, robotics, manufacturing inspection, retail analytics, and buyers searching for edge AI hardware or vision AI accelerator kits.",
    "bestFor": "Computer vision, AI cameras, robotics, inspection, low-power inference",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 3-7 business days",
    "specs": [],
    "variants": [
      {
        "title": "M.2 edge AI accelerator kit",
        "sku": "VC-EDGE-VISION-M2",
        "optionValue": "M.2 edge AI accelerator kit",
        "priceUsd": 519
      },
      {
        "title": "PCIe edge AI accelerator kit",
        "sku": "VC-EDGE-VISION-PCIE",
        "optionValue": "PCIe edge AI accelerator kit",
        "priceUsd": 974
      },
      {
        "title": "Multi-camera edge AI bundle",
        "sku": "VC-EDGE-VISION-CAM",
        "optionValue": "Multi-camera edge AI bundle",
        "priceUsd": 1624
      }
    ]
  },
  {
    "handle": "vectraedge-robotics-ai-kit",
    "title": "VectraEdge Robotics AI Kit",
    "category": "Edge & Robotics",
    "description": "Edge AI robotics kit for mobile robots, autonomous machines, lab automation, perception workloads, sensor fusion, and buyers searching for robotics AI hardware for local inference.",
    "bestFor": "Robotics perception, mobile robots, sensor fusion, lab automation, local edge inference",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 5-10 business days",
    "specs": [],
    "variants": [
      {
        "title": "Robotics edge AI accelerator kit",
        "sku": "VC-EDGE-ROBOTICS-ACCEL",
        "optionValue": "Robotics edge AI accelerator kit",
        "priceUsd": 1234
      },
      {
        "title": "Robotics AI kit with validation",
        "sku": "VC-EDGE-ROBOTICS-VALID",
        "optionValue": "Robotics AI kit with validation",
        "priceUsd": 2274
      },
      {
        "title": "Multi-sensor robotics AI bundle",
        "sku": "VC-EDGE-ROBOTICS-SENSOR",
        "optionValue": "Multi-sensor robotics AI bundle",
        "priceUsd": 3899
      }
    ]
  },
  {
    "handle": "vectraedge-camera-ai-server",
    "title": "VectraEdge Camera AI Server",
    "category": "Edge & Robotics",
    "description": "Camera AI server for multi-camera computer vision, manufacturing inspection, retail analytics, security analytics, traffic monitoring, and buyers searching for AI camera inference hardware.",
    "bestFor": "Computer vision, multi-camera inference, manufacturing inspection, retail analytics, security analytics",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-14 business days",
    "specs": [],
    "variants": [
      {
        "title": "L4 24GB / 128GB RAM / 16-camera pipeline",
        "sku": "VC-CAMERA-L4-16CAM",
        "optionValue": "L4 24GB / 128GB RAM / 16-camera pipeline",
        "priceUsd": 9749
      },
      {
        "title": "2x L4 24GB / 256GB RAM / 32-camera pipeline",
        "sku": "VC-CAMERA-L4X2-32CAM",
        "optionValue": "2x L4 24GB / 256GB RAM / 32-camera pipeline",
        "priceUsd": 15599
      },
      {
        "title": "2x L4 24GB / 512GB RAM / 32-camera pipeline",
        "sku": "VC-CAMERA-L4X2-32CAM-MAX",
        "optionValue": "2x L4 24GB / 512GB RAM / 32-camera pipeline",
        "priceUsd": 20279
      }
    ]
  },
  {
    "handle": "vectra-ai-server-upgrade-bundle",
    "title": "Vectra AI Server Upgrade Bundle",
    "category": "Components & Accessories",
    "description": "AI server upgrade bundle with ECC memory, U.2/U.3 NVMe storage, risers, redundant power, and rack accessories for buyers upgrading existing GPU servers for AI workloads.",
    "bestFor": "Server refresh, GPU server upgrades, NVMe expansion, memory upgrades, rack maintenance",
    "condition": "New and validated refurbished options",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 3-10 business days after compatibility review",
    "specs": [],
    "variants": [
      {
        "title": "Memory + NVMe upgrade bundle",
        "sku": "VC-UPGRADE-MEM-NVME",
        "optionValue": "Memory + NVMe upgrade bundle",
        "priceUsd": 2274
      },
      {
        "title": "Power + riser + rail bundle",
        "sku": "VC-UPGRADE-POWER-RISER",
        "optionValue": "Power + riser + rail bundle",
        "priceUsd": 1494
      },
      {
        "title": "Complete AI server refresh bundle",
        "sku": "VC-UPGRADE-COMPLETE",
        "optionValue": "Complete AI server refresh bundle",
        "priceUsd": 4549
      }
    ]
  },
  {
    "handle": "vectraedge-l4-inference-appliance",
    "title": "VectraEdge L4 Inference Appliance",
    "category": "Edge & Robotics",
    "description": "Compact NVIDIA L4-class inference appliance for buyers searching for low-power AI inference hardware, video analytics, RAG endpoints, small private LLM serving, and computer vision deployments without a full training server.",
    "bestFor": "Low-power inference, computer vision, RAG endpoints, video analytics, private AI APIs",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 5-12 business days",
    "specs": [],
    "variants": [
      {
        "title": "Single L4 24GB / 128GB RAM / 4TB NVMe",
        "sku": "VC-L4-APP-1GPU-128-4T",
        "optionValue": "Single L4 24GB / 128GB RAM / 4TB NVMe",
        "priceUsd": 5849
      },
      {
        "title": "Dual L4 24GB / 256GB RAM / 8TB NVMe",
        "sku": "VC-L4-APP-2GPU-256-8T",
        "optionValue": "Dual L4 24GB / 256GB RAM / 8TB NVMe",
        "priceUsd": 10399
      },
      {
        "title": "Dual L4 24GB / 512GB RAM / 16TB NVMe",
        "sku": "VC-L4-APP-2GPU-256-8T-MAX",
        "optionValue": "Dual L4 24GB / 512GB RAM / 16TB NVMe",
        "priceUsd": 13584
      }
    ]
  },
  {
    "handle": "vectrarack-rtx-pro-6000-blackwell-inference-server",
    "title": "VectraRack RTX PRO 6000 Blackwell Inference Server",
    "category": "GPU Rack Servers",
    "description": "Rackmount RTX PRO 6000 Blackwell-class inference server for buyers searching for 96GB professional GPU memory, CUDA model serving, digital twins, visual AI, simulation, and private enterprise inference.",
    "bestFor": "96GB GPU inference, visual AI, simulation, digital twins, enterprise model serving",
    "condition": "New",
    "warranty": "3-year parts / 5-year labor option",
    "leadTime": "Ships in 7-18 business days",
    "specs": [],
    "variants": [
      {
        "title": "2x RTX PRO 6000 Blackwell 96GB / 512GB RAM / 8TB NVMe",
        "sku": "VC-RACK-RTXPRO6000X2-512-8T",
        "optionValue": "2x RTX PRO 6000 Blackwell 96GB / 512GB RAM / 8TB NVMe",
        "priceUsd": 21449
      },
      {
        "title": "4x RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "sku": "VC-RACK-RTXPRO6000X4-1TB-16T",
        "optionValue": "4x RTX PRO 6000 Blackwell 96GB / 1TB RAM / 16TB NVMe",
        "priceUsd": 40949
      },
      {
        "title": "4x RTX PRO 6000 Blackwell 96GB / 1TB RAM / 30TB NVMe",
        "sku": "VC-RACK-RTXPRO6000X4-1TB-16T-MAX",
        "optionValue": "4x RTX PRO 6000 Blackwell 96GB / 1TB RAM / 30TB NVMe",
        "priceUsd": 54599
      }
    ]
  },
  {
    "handle": "vectrarack-refurb-h200-nvl-inference-pair",
    "title": "VectraRack Refurb H200 NVL Inference Pair",
    "category": "Refurbished & Certified",
    "description": "Validated refurbished H200 NVL-class inference pair for long-context LLM serving, memory-heavy RAG, private AI endpoints, and buyers looking for high-memory GPU inference with stronger budget control.",
    "bestFor": "Long-context LLM serving, private AI endpoints, RAG at scale, high-memory inference",
    "condition": "Validated refurbished",
    "warranty": "1-year parts / 3-year labor option",
    "leadTime": "Ships in 10-21 business days after condition review",
    "specs": [],
    "variants": [
      {
        "title": "2x Refurb H200 NVL-class / 1TB RAM / 200GbE",
        "sku": "VC-REF-H200NVL-X2-1TB-200G",
        "optionValue": "2x Refurb H200 NVL-class / 1TB RAM / 200GbE",
        "priceUsd": 48749
      },
      {
        "title": "4x Refurb H200 NVL-class / 2TB RAM / 400GbE",
        "sku": "VC-REF-H200NVL-X4-2TB-400G",
        "optionValue": "4x Refurb H200 NVL-class / 2TB RAM / 400GbE",
        "priceUsd": 90999
      },
      {
        "title": "4x Refurb H200 NVL-class / 2TB RAM / 800GbE",
        "sku": "VC-REF-H200NVL-X4-2TB-400G-MAX",
        "optionValue": "4x Refurb H200 NVL-class / 2TB RAM / 800GbE",
        "priceUsd": 120574
      }
    ]
  },
  {
    "handle": "vectra-800gbe-ai-switch-starter-bundle",
    "title": "Vectra 800GbE AI Switch Starter Bundle",
    "category": "Networking & Interconnect",
    "description": "800GbE AI switch starter bundle for buyers building next-generation GPU clusters, shared NVMe fabrics, B200/GB300-class racks, and high-throughput distributed training networks.",
    "bestFor": "Next-gen AI racks, GPU cluster networking, shared NVMe fabrics, distributed training, AI factory planning",
    "condition": "New",
    "warranty": "1-year parts / support option",
    "leadTime": "Ships in 7-21 business days after topology review",
    "specs": [],
    "variants": [
      {
        "title": "800GbE switch planning + two-node cable kit",
        "sku": "VC-800G-SWITCH-2NODE",
        "optionValue": "800GbE switch planning + two-node cable kit",
        "priceUsd": 12349
      },
      {
        "title": "800GbE switch planning + four-node cable kit",
        "sku": "VC-800G-SWITCH-4NODE",
        "optionValue": "800GbE switch planning + four-node cable kit",
        "priceUsd": 22749
      },
      {
        "title": "Complete 800GbE switch planning + four-node cable kit / compatibility-reviewed package",
        "sku": "VC-800G-SWITCH-4NODE-MAX",
        "optionValue": "Complete 800GbE switch planning + four-node cable kit / compatibility-reviewed package",
        "priceUsd": 30029
      }
    ]
  },
  {
    "handle": "vectrapower-rack-ups-battery-backup",
    "title": "VectraPower Rack UPS Battery Backup",
    "category": "Power & Cooling",
    "description": "Rack-mount online double-conversion UPS sizing for AI workstations, GPU servers, and inference nodes. Protects long training runs and checkpoint writes against outages and brownouts.",
    "bestFor": "Protecting training runs, GPU servers, inference nodes, and checkpoint integrity from power events",
    "condition": "New",
    "warranty": "Manufacturer warranty plus deployment support option",
    "leadTime": "Ships in 5-12 business days after load review",
    "specs": [],
    "variants": [
      {
        "title": "3kVA online rack UPS / workstation & node protection",
        "sku": "VC-PWR-UPS-3KVA",
        "optionValue": "3kVA online rack UPS / workstation & node protection",
        "priceUsd": 1299
      },
      {
        "title": "6kVA online rack UPS / multi-node protection",
        "sku": "VC-PWR-UPS-6KVA",
        "optionValue": "6kVA online rack UPS / multi-node protection",
        "priceUsd": 2899
      },
      {
        "title": "10kVA lithium-ion rack UPS / rack protection with runtime review",
        "sku": "VC-PWR-UPS-10KVA-LI",
        "optionValue": "10kVA lithium-ion rack UPS / rack protection with runtime review",
        "priceUsd": 5849
      }
    ]
  },
  {
    "handle": "vectra-server-spare-parts-kit",
    "title": "Vectra Server Spare Parts Kit",
    "category": "Components & Accessories",
    "description": "Matched spare-parts kits for VectraRack and VectraForge systems: hot-swap PSU, fan trays, NVMe caddies, and cable sets from the same validated part list as the original build.",
    "bestFor": "On-site spares for production GPU servers, minimizing downtime during training runs",
    "condition": "New",
    "warranty": "1-year parts warranty",
    "leadTime": "Ships in 3-7 business days",
    "specs": [],
    "variants": [
      {
        "title": "Spare PSU kit / matched hot-swap unit",
        "sku": "VC-SPARE-PSU",
        "optionValue": "Spare PSU kit / matched hot-swap unit",
        "priceUsd": 519
      },
      {
        "title": "Fan tray + NVMe caddy kit",
        "sku": "VC-SPARE-FAN-CADDY",
        "optionValue": "Fan tray + NVMe caddy kit",
        "priceUsd": 389
      },
      {
        "title": "Complete on-site spares kit / PSU + fans + caddies + cables",
        "sku": "VC-SPARE-FULL",
        "optionValue": "Complete on-site spares kit / PSU + fans + caddies + cables",
        "priceUsd": 1039
      }
    ]
  }
]
