"use client"

import {
  type BitcoinExchangeRate,
  formatBtcAmount,
  type BitcoinPaymentSettings,
  isBitcoinCheckoutActive,
  toMajorCurrencyAmount,
} from "@lib/util/bitcoin-payment"
import { convertToLocale } from "@lib/util/money"
import BitcoinCountdown from "@modules/common/components/bitcoin-countdown"
import { Text } from "@modules/common/components/ui"
import { useState } from "react"

type BitcoinPaymentDetailsProps = {
  settings: BitcoinPaymentSettings | null
  exchangeRate: BitcoinExchangeRate | null
  amount: number
  currencyCode: string
}

const BitcoinPaymentDetails = ({
  settings,
  exchangeRate,
  amount,
  currencyCode,
}: BitcoinPaymentDetailsProps) => {
  const [copied, setCopied] = useState(false)

  if (!isBitcoinCheckoutActive(settings)) {
    return (
      <div className="mt-4 rounded-md border border-ui-border-base bg-grey-5 p-4">
        <Text className="text-small-regular text-ui-fg-subtle leading-6">
          Manual payment is available. VectraCompute will confirm payment
          instructions and procurement details after the order is placed.
        </Text>
      </div>
    )
  }

  const isManualWallet = settings?.activeMode === "manual_wallet"
  const walletAddress = settings?.manual.walletAddress.trim()
  const displayAmount = convertToLocale({
    amount: toMajorCurrencyAmount(amount, currencyCode),
    currency_code: currencyCode,
  })
  const btcAmount = formatBtcAmount(
    amount,
    currencyCode,
    exchangeRate?.usd
  )

  const copyAddress = async () => {
    if (!walletAddress || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
      <div className="bg-slate-950 px-4 py-4 text-white">
        <div className="flex flex-col small:flex-row small:items-start small:justify-between gap-4">
          <div>
            <Text className="txt-medium-plus text-white">
              {isManualWallet
                ? "Bitcoin wallet checkout"
                : "Bitcoin via BTCPay Server"}
            </Text>
            <Text className="text-small-regular text-slate-300 leading-6 mt-1">
              {isManualWallet
                ? "Review the BTC amount, wallet address, and QR code. After you place the order, the details are sent to admin and the order waits for payment confirmation."
                : settings?.btcpay.checkoutInstructions}
            </Text>
          </div>
          <span className="shrink-0 rounded-full border border-amber-300 bg-amber-300 px-3 py-1 text-[12px] font-semibold text-amber-950">
            Awaiting Bitcoin
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-1 small:grid-cols-[minmax(0,1fr)_210px] gap-3">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <Text className="txt-compact-small-plus text-blue-950">
              Order details sent to admin after placement
            </Text>
            <Text className="mt-1 text-small-regular leading-6 text-blue-900">
              Your configuration, contact details, and Bitcoin payment method
              become visible in admin as soon as you place the order.
            </Text>
          </div>
          {isManualWallet && (
            <BitcoinCountdown
              minutes={settings?.manual.paymentExpiryMinutes || 60}
              compact
            />
          )}
        </div>

        {isManualWallet ? (
          <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_180px] gap-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                  <Text className="txt-compact-small-plus text-emerald-950">
                    Order total
                  </Text>
                  <Text className="text-xl font-semibold text-emerald-950 mt-1">
                    {displayAmount}
                  </Text>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <Text className="txt-compact-small-plus text-amber-950">
                    BTC to send
                  </Text>
                  <Text className="text-xl font-semibold text-amber-950 mt-1">
                    {btcAmount || "Live rate unavailable"}
                  </Text>
                  {btcAmount && (
                    <Text className="text-[11px] leading-5 text-amber-900 mt-1">
                      1 BTC ={" "}
                      {convertToLocale({
                        amount: exchangeRate?.usd || 0,
                        currency_code: "usd",
                      })}{" "}
                      via {exchangeRate?.source}
                    </Text>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-4">
                <Text className="txt-compact-small-plus text-ui-fg-base mb-2">
                  BTC receiving wallet
                </Text>
                <div className="flex flex-col small:flex-row gap-2">
                  <code className="min-h-11 flex-1 overflow-x-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-ui-fg-base">
                    {walletAddress ||
                      "Admin has not added a wallet address yet."}
                  </code>
                  <button
                    type="button"
                    onClick={copyAddress}
                    disabled={!walletAddress}
                    className="rounded-md border border-slate-300 bg-slate-950 px-4 py-2 text-small-regular text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {(!walletAddress || !btcAmount) && (
                <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
                  <Text className="text-small-regular text-orange-900 leading-6">
                    Bitcoin checkout needs setup before customers can pay:
                    {!walletAddress
                      ? " add a BTC wallet address in Admin > Bitcoin Payments."
                      : " live BTC/USD rate is unavailable, try again shortly."}
                  </Text>
                </div>
              )}

              <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <Text className="txt-compact-small-plus text-ui-fg-base">
                    Confirmations required
                  </Text>
                  <Text className="text-small-regular text-ui-fg-subtle mt-1">
                    {settings?.manual.requiredConfirmations} network
                    confirmations before order release
                  </Text>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <Text className="txt-compact-small-plus text-ui-fg-base">
                    Payment status
                  </Text>
                  <Text className="text-small-regular text-ui-fg-subtle mt-1">
                    Awaiting Bitcoin payment and admin confirmation
                  </Text>
                </div>
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <Text className="text-small-regular text-blue-950 leading-6">
                  {settings?.manual.instructions}
                </Text>
                {settings?.manual.rateSourceNote && (
                  <Text className="mt-2 text-[11px] leading-5 text-blue-900">
                    {settings.manual.rateSourceNote}
                  </Text>
                )}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
              {settings?.manual.qrCodeImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.manual.qrCodeImageUrl}
                  alt="Bitcoin wallet QR code"
                  className="mx-auto aspect-square w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-md bg-slate-100 px-3 text-[11px] leading-5 text-ui-fg-subtle">
                  Add QR image URL in Admin
                </div>
              )}
              <Text className="mt-2 text-[11px] leading-5 text-ui-fg-muted">
                Scan QR or copy wallet address
              </Text>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 small:grid-cols-2 gap-3">
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
              <Text className="txt-compact-small-plus text-blue-950">
                BTCPay server
              </Text>
              <Text className="text-small-regular text-blue-900 mt-1 break-all">
                {settings?.btcpay.serverUrl || "Add server URL in Admin"}
              </Text>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <Text className="txt-compact-small-plus text-amber-950">
                Store ID
              </Text>
              <Text className="text-small-regular text-amber-900 mt-1 break-all">
                {settings?.btcpay.storeId || "Add store ID in Admin"}
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BitcoinPaymentDetails
