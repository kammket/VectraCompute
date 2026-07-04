"use client"

import { useMemo, useState } from "react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type SuggestedVariant = {
  title: string
  sku: string
  priceUsd: number
  formattedPrice: string
}

type SuggestedProduct = {
  handle: string
  title: string
  category: string
  bestFor: string
  condition: string
  warranty: string
  leadTime: string
  url: string
  variants: SuggestedVariant[]
}

type OrderForm = {
  productHandle: string
  variantSku: string
  customerName: string
  email: string
  phone: string
  company: string
  address1: string
  address2: string
  city: string
  province: string
  postalCode: string
  countryCode: string
  notes: string
}

type AiOrderResponse = {
  order: {
    id: string
    formattedTotal: string
    selectedVariant: SuggestedVariant
    product: SuggestedProduct
  }
  payment: {
    enabled: boolean
    walletAddress: string
    qrCodeImageUrl: string
    instructions: string
    requiredConfirmations: number
    paymentExpiryMinutes: number
    btcEstimate: null | {
      rateUsd: number
      btcAmount: number
    }
    message: string
  }
}

const emptyForm: OrderForm = {
  productHandle: "",
  variantSku: "",
  customerName: "",
  email: "",
  phone: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  countryCode: "us",
  notes: "",
}

const starterPrompts = [
  "Help me choose a workstation for local LLMs",
  "I need a GPU server for inference",
  "I want to buy with Bitcoin",
]

const getBackendUrl = () =>
  (process.env.NEXT_PUBLIC_AI_BACKEND_URL || "").replace(/\/$/, "")

export default function AiSalesChat() {
  const backendUrl = useMemo(getBackendUrl, [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [error, setError] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I am the VectraCompute AI hardware engineer. Tell me your workload, model size, budget, and delivery country, and I will recommend the right system or help you place an order.",
    },
  ])
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [form, setForm] = useState<OrderForm>(emptyForm)
  const [orderResult, setOrderResult] = useState<AiOrderResponse | null>(null)

  const selectedProduct = suggestedProducts.find(
    (product) => product.handle === form.productHandle
  )

  const selectedVariant =
    selectedProduct?.variants.find((variant) => variant.sku === form.variantSku) ||
    selectedProduct?.variants[0]

  const updateForm = (key: keyof OrderForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "productHandle"
        ? {
            variantSku:
              suggestedProducts
                .find((product) => product.handle === value)
                ?.variants.at(0)?.sku || "",
          }
        : {}),
    }))
  }

  const sendMessage = async (messageText = input) => {
    const trimmed = messageText.trim()

    if (!trimmed || loading) {
      return
    }

    if (!backendUrl) {
      setError("AI backend is not connected. Add NEXT_PUBLIC_AI_BACKEND_URL in Vercel.")
      return
    }

    setError("")
    setInput("")
    setLoading(true)

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ]
    setMessages(nextMessages)

    try {
      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "The AI engineer is temporarily unavailable.")
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.assistant,
        },
      ])

      if (Array.isArray(payload.suggestedProducts)) {
        setSuggestedProducts(payload.suggestedProducts)
        const firstProduct = payload.suggestedProducts[0] as SuggestedProduct | undefined

        if (firstProduct && !form.productHandle) {
          setForm((current) => ({
            ...current,
            productHandle: firstProduct.handle,
            variantSku: firstProduct.variants[0]?.sku || "",
          }))
        }
      }

      if (payload.checkout?.enabled) {
        setCheckoutOpen(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI chat failed.")
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async () => {
    if (!backendUrl || orderLoading) {
      return
    }

    setError("")
    setOrderLoading(true)

    try {
      const response = await fetch(`${backendUrl}/api/ai/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variantSku: selectedVariant?.sku || form.variantSku,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "Could not create the order.")
      }

      setOrderResult(payload)
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Your order ${payload.order.id} has been saved for ${payload.order.product.title}. Use the Bitcoin details shown here. Our team will contact you after payment is confirmed.`,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the order.")
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[680px] w-[420px] max-w-full flex-col overflow-hidden rounded border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/30">
          <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  AI Sales Engineer
                </p>
                <h2 className="mt-1 text-base font-semibold text-white">
                  VectraCompute hardware advisor
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-slate-500"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-950 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "assistant"
                    ? "mr-8 rounded bg-slate-900 p-3 text-sm leading-6 text-slate-100"
                    : "ml-8 rounded bg-cyan-500 p-3 text-sm leading-6 text-slate-950"
                }
              >
                {message.content}
              </div>
            ))}

            {suggestedProducts.length > 0 && (
              <div className="rounded border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Recommended systems
                </p>
                <div className="mt-3 space-y-2">
                  {suggestedProducts.slice(0, 3).map((product) => (
                    <button
                      type="button"
                      key={product.handle}
                      onClick={() => {
                        updateForm("productHandle", product.handle)
                        setCheckoutOpen(true)
                      }}
                      className="w-full rounded border border-slate-800 bg-slate-950 p-3 text-left hover:border-cyan-400"
                    >
                      <span className="block text-sm font-semibold text-white">
                        {product.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        {product.bestFor || product.category}
                      </span>
                      <span className="mt-2 block text-xs font-semibold text-cyan-300">
                        From {product.variants[0]?.formattedPrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {checkoutOpen && (
              <div className="rounded border border-cyan-900 bg-cyan-950/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Chat checkout
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      Confirm the system and delivery details.
                    </p>
                  </div>
                  {selectedVariant && (
                    <p className="text-right text-sm font-semibold text-white">
                      {selectedVariant.formattedPrice}
                    </p>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  <select
                    value={form.productHandle}
                    onChange={(event) => updateForm("productHandle", event.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  >
                    {suggestedProducts.map((product) => (
                      <option key={product.handle} value={product.handle}>
                        {product.title}
                      </option>
                    ))}
                  </select>

                  {selectedProduct && (
                    <select
                      value={form.variantSku || selectedProduct.variants[0]?.sku}
                      onChange={(event) => updateForm("variantSku", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                    >
                      {selectedProduct.variants.map((variant) => (
                        <option key={variant.sku} value={variant.sku}>
                          {variant.title} - {variant.formattedPrice}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      value={form.customerName}
                      onChange={(event) => updateForm("customerName", event.target.value)}
                      placeholder="Full name"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                    <input
                      value={form.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      placeholder="Email"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                    <input
                      value={form.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                      placeholder="Phone"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                    <input
                      value={form.company}
                      onChange={(event) => updateForm("company", event.target.value)}
                      placeholder="Company"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>

                  <input
                    value={form.address1}
                    onChange={(event) => updateForm("address1", event.target.value)}
                    placeholder="Delivery address"
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={form.city}
                      onChange={(event) => updateForm("city", event.target.value)}
                      placeholder="City"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                    <input
                      value={form.countryCode}
                      onChange={(event) => updateForm("countryCode", event.target.value)}
                      placeholder="Country code"
                      className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>

                  <textarea
                    value={form.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    placeholder="Workload notes, delivery timing, rack/power constraints"
                    rows={3}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={createOrder}
                    disabled={orderLoading}
                    className="w-full rounded bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {orderLoading ? "Saving order..." : "Save order and show Bitcoin payment"}
                  </button>
                </div>
              </div>
            )}

            {orderResult && (
              <div className="rounded border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-slate-100">
                <p className="font-semibold text-emerald-300">
                  Order saved: {orderResult.order.id}
                </p>
                <p className="mt-1">
                  Total: {orderResult.order.formattedTotal}
                  {orderResult.payment.btcEstimate
                    ? ` / ${orderResult.payment.btcEstimate.btcAmount} BTC`
                    : ""}
                </p>
                <div className="mt-3 rounded bg-slate-950 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Bitcoin wallet
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-cyan-200">
                    {orderResult.payment.walletAddress ||
                      "Wallet address is not configured yet."}
                  </p>
                  {orderResult.payment.qrCodeImageUrl && (
                    <img
                      src={orderResult.payment.qrCodeImageUrl}
                      alt="Bitcoin payment QR code"
                      className="mt-3 h-28 w-28 rounded bg-white object-contain p-2"
                    />
                  )}
                </div>
                <p className="mt-3 text-xs leading-5 text-emerald-100">
                  {orderResult.payment.message} Required confirmations:{" "}
                  {orderResult.payment.requiredConfirmations}.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded border border-red-900 bg-red-950/50 p-3 text-sm text-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about GPUs, servers, pricing, delivery..."
                className="min-w-0 flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-white px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-full border border-cyan-300 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/30 hover:bg-slate-900"
      >
        AI hardware engineer
      </button>
    </div>
  )
}
