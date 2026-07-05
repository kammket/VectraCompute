"use client"

import dynamic from "next/dynamic"

// The chat isn't needed for first paint, so defer its JS out of the initial
// bundle and load it client-side after the page is interactive.
const AiSalesChat = dynamic(() => import("./ai-sales-chat"), { ssr: false })

export default function LazyChat() {
  return <AiSalesChat />
}
