"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CheckCircleSolid, SquareTwoStack } from "@medusajs/icons"

// Small clipboard button for payment-critical values (wallet address, BTC
// amount, order reference) where a typo means lost funds.
const CopyButton = ({
  value,
  label = "Copy",
  className = "",
}: {
  value: string
  label?: string
  className?: string
}) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (http / older browser) — leave button as-is;
      // the value is still selectable text next to it.
    }
  }, [value])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition ${
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : "border-slate-300 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700"
      } ${className}`}
    >
      {copied ? <CheckCircleSolid /> : <SquareTwoStack />}
      {copied ? "Copied" : label}
    </button>
  )
}

export default CopyButton
