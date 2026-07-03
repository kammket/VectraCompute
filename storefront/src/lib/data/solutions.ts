export type Solution = {
  slug: string
  title: string
  tagline: string
  intro: string
  bullets: string[]
  categoryHandle: string
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "ai-deep-learning",
    title: "AI & Deep Learning",
    tagline: "Local training and fine-tuning hardware that keeps up with your experiments",
    intro:
      "Iterating on model architectures, fine-tuning open-weight LLMs, or running batch inference all hinge on one thing: how much GPU memory and compute you have on your desk. VectraForge workstations are configured specifically for PyTorch and CUDA workloads, with VRAM-first GPU choices and enough system RAM to keep data loaders from becoming the bottleneck.",
    bullets: [
      "Pre-installed NVIDIA drivers and CUDA toolkit validation before shipping",
      "GPU options from RTX 4090 up to RTX 6000 Ada, single through quad-GPU",
      "24-hour burn-in under full CUDA load on every unit",
    ],
    categoryHandle: "ai-deep-learning-workstations",
  },
  {
    slug: "large-scale-training",
    title: "Large-Scale Training & Inference",
    tagline: "Rack-mounted multi-GPU servers for distributed training and production inference",
    intro:
      "When a workload outgrows a single workstation, VectraRack servers pick up where VectraForge leaves off — NVSwitch-connected GPUs, 100GbE networking for multi-node clusters, and the rack density to scale from a single training node to a small cluster without re-architecting your stack.",
    bullets: [
      "4 to 8 GPU configurations including H100 and H200",
      "100GbE uplinks for multi-node distributed training",
      "Liquid-cooled options for sustained full-load operation",
    ],
    categoryHandle: "gpu-rack-servers",
  },
  {
    slug: "data-science-engineering",
    title: "Data Science & Engineering Workloads",
    tagline: "CPU-platform workstations for data pipelines, simulation, and mixed CPU/GPU work",
    intro:
      "Not every workload is GPU-bound. Data preprocessing, large in-memory pandas/Spark jobs, and engineering simulation often live or die on CPU core count, memory bandwidth, and PCIe lanes. Our CPU-platform lineup spans Intel Core Ultra through Xeon W and AMD Threadripper PRO/EPYC, so you can size the platform to the bottleneck that's actually slowing you down.",
    bullets: [
      "Intel Xeon W and AMD Threadripper PRO / EPYC platform options",
      "High memory-bandwidth configurations up to 512GB RAM",
      "Paired with workstation-class GPUs for mixed CPU/GPU pipelines",
    ],
    categoryHandle: "workstations-by-cpu-platform",
  },
]

export const getSolutionBySlug = (slug: string) =>
  SOLUTIONS.find((s) => s.slug === slug)
