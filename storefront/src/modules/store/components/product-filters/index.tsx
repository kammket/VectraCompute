"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { clx } from "@modules/common/components/ui"
import { ProductFilterValue } from "@modules/store/types"

const FILTER_GROUPS: {
  key: keyof ProductFilterValue
  title: string
  options: { label: string; value: string }[]
}[] = [
  {
    key: "gpu",
    title: "GPU / Platform",
    options: [
      { label: "RTX 5090", value: "rtx-5090" },
      { label: "RTX PRO 6000", value: "rtx-pro-6000" },
      { label: "A100", value: "a100" },
      { label: "H100 / H200", value: "h100-h200" },
      { label: "B200 / GB300", value: "b200-gb300" },
      { label: "AMD MI300 / MI350", value: "amd-mi" },
      { label: "Jetson / NPU", value: "edge-npu" },
      { label: "L40S / L4", value: "l40s-l4" },
    ],
  },
  {
    key: "workload",
    title: "Workload",
    options: [
      { label: "Local LLM", value: "local-llm" },
      { label: "Training", value: "training" },
      { label: "Inference", value: "inference" },
      { label: "Private RAG", value: "rag" },
      { label: "Computer vision", value: "vision" },
      { label: "Storage / vector DB", value: "storage" },
      { label: "Robotics / edge AI", value: "robotics-edge" },
      { label: "Power / cooling", value: "power-cooling" },
      { label: "Monitoring / ops", value: "monitoring" },
    ],
  },
  {
    key: "infrastructure",
    title: "Infrastructure need",
    options: [
      { label: "Memory / storage", value: "memory-storage" },
      { label: "Power / cooling", value: "power-cooling" },
      { label: "Edge / robotics", value: "edge-robotics" },
      { label: "Inference operations", value: "inference-ops" },
      { label: "Next-gen rack", value: "next-gen-rack" },
    ],
  },
  {
    key: "condition",
    title: "Condition",
    options: [
      { label: "New systems", value: "new" },
      { label: "Refurbished", value: "refurbished" },
    ],
  },
  {
    key: "formFactor",
    title: "Form factor",
    options: [
      { label: "Workstation", value: "workstation" },
      { label: "Rack server", value: "rack-server" },
      { label: "Appliance", value: "appliance" },
      { label: "Component / kit", value: "component" },
    ],
  },
  {
    key: "budget",
    title: "Budget",
    options: [
      { label: "Under $10k", value: "under-10k" },
      { label: "$10k - $25k", value: "10k-25k" },
      { label: "$25k - $50k", value: "25k-50k" },
      { label: "$50k+", value: "50k-plus" },
    ],
  },
]

const ProductFilters = ({ filters }: { filters: ProductFilterValue }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = (key: keyof ProductFilterValue, value: string) => {
    const params = new URLSearchParams(searchParams)
    const current = params.get(key)

    if (current === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)

    FILTER_GROUPS.forEach((group) => params.delete(group.key))
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base-semi text-ui-fg-base">Filter products</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-small-semi text-brand-700 hover:text-brand-800"
          >
            Clear
          </button>
        )}
      </div>

      {FILTER_GROUPS.map((group) => (
        <div key={group.key} className="border-t border-ui-border-base pt-4">
          <p className="mb-3 text-small-semi text-ui-fg-base">{group.title}</p>
          <div className="flex flex-wrap gap-2 large:flex-col">
            {group.options.map((option) => {
              const isActive = filters[group.key] === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(group.key, option.value)}
                  className={clx(
                    "rounded-md border px-3 py-2 text-left text-small-regular transition",
                    isActive
                      ? "border-brand-500 bg-brand-50 text-brand-800"
                      : "border-ui-border-base bg-white text-ui-fg-subtle hover:border-brand-300 hover:text-ui-fg-base"
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductFilters
