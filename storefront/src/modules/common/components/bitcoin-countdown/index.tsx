"use client"

import { Text } from "@modules/common/components/ui"
import { useEffect, useMemo, useState } from "react"

type BitcoinCountdownProps = {
  minutes: number
  startedAt?: string | Date | null
  compact?: boolean
}

const getRemainingSeconds = (minutes: number, startedAt?: string | Date | null) => {
  const start = startedAt ? new Date(startedAt).getTime() : Date.now()
  const end = start + minutes * 60 * 1000
  return Math.max(0, Math.floor((end - Date.now()) / 1000))
}

const formatRemaining = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const BitcoinCountdown = ({
  minutes,
  startedAt,
  compact = false,
}: BitcoinCountdownProps) => {
  const [remaining, setRemaining] = useState(() =>
    getRemainingSeconds(minutes, startedAt)
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemainingSeconds(minutes, startedAt))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [minutes, startedAt])

  const label = useMemo(() => formatRemaining(remaining), [remaining])

  return (
    <div
      className={
        compact
          ? "rounded-md border border-amber-200 bg-amber-50 px-3 py-2"
          : "rounded-md border border-amber-200 bg-amber-50 p-4"
      }
    >
      <Text className="txt-compact-small-plus text-amber-950">
        Awaiting Bitcoin
      </Text>
      <div className="mt-1 flex items-end justify-between gap-3">
        <Text className="text-2xl font-semibold leading-none text-amber-950">
          {label}
        </Text>
        <Text className="text-[11px] leading-5 text-amber-900">
          payment window
        </Text>
      </div>
      {!compact && (
        <Text className="mt-2 text-small-regular leading-6 text-amber-900">
          Keep this page open while you send BTC. The order will be reviewed and
          confirmed after the payment is detected and verified.
        </Text>
      )}
    </div>
  )
}

export default BitcoinCountdown
