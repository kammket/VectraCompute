import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-base-semi">Select {title}</span>
      <div className="grid grid-cols-1 gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isActive = v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "flex min-h-12 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-small-regular leading-5 transition-colors",
                {
                  "border-brand-600 bg-brand-50 text-ui-fg-base ring-1 ring-brand-600":
                    isActive,
                  "border-ui-border-base bg-ui-bg-subtle hover:bg-grey-5":
                    !isActive,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
              aria-pressed={isActive}
            >
              <span className="min-w-0">{v}</span>
              {isActive && (
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 text-brand-600"
                  aria-hidden
                >
                  <path
                    d="M5 10.5l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
