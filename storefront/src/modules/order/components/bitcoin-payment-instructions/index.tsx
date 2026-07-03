import { isManual } from "@lib/constants"
import {
  type BitcoinExchangeRate,
  formatBtcAmount,
  type BitcoinPaymentSettings,
  toMajorCurrencyAmount,
} from "@lib/util/bitcoin-payment"
import { convertToLocale } from "@lib/util/money"
import BitcoinCountdown from "@modules/common/components/bitcoin-countdown"
import { Heading, Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"

type BitcoinPaymentInstructionsProps = {
  order: HttpTypes.StoreOrder
  settings: BitcoinPaymentSettings | null
  exchangeRate: BitcoinExchangeRate | null
}

const BitcoinPaymentInstructions = ({
  order,
  settings,
  exchangeRate,
}: BitcoinPaymentInstructionsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const shouldShow = settings?.enabled && isManual(payment?.provider_id)

  if (!shouldShow) {
    return null
  }

  const isManualWallet = settings.activeMode === "manual_wallet"
  const orderTotal = order.total ?? 0
  const displayAmount = convertToLocale({
    amount: toMajorCurrencyAmount(orderTotal, order.currency_code),
    currency_code: order.currency_code,
  })
  const btcAmount = formatBtcAmount(
    orderTotal,
    order.currency_code,
    exchangeRate?.usd
  )

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
      <div className="bg-slate-950 px-5 py-5 text-white">
        <div className="flex flex-col small:flex-row small:items-start small:justify-between gap-4">
          <div>
            <Text className="text-small-regular text-amber-300 uppercase mb-2">
              Awaiting Bitcoin payment
            </Text>
            <Heading level="h2" className="text-2xl text-white mb-2">
              {isManualWallet
                ? "Send BTC to confirm your order"
                : "BTCPay invoice verification"}
            </Heading>
            <Text className="text-small-regular text-slate-300 leading-6 max-w-2xl">
              Order #{order.display_id} has already been sent to admin. Keep
              this page open while payment is being reviewed. Fulfillment starts
              after Bitcoin payment is detected and verified.
            </Text>
          </div>
          {isManualWallet && (
            <div className="small:w-[220px]">
              <BitcoinCountdown
                minutes={settings.manual.paymentExpiryMinutes}
                startedAt={order.created_at}
              />
            </div>
          )}
        </div>
      </div>
      {isManualWallet ? (
        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_190px] gap-4 p-5">
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
                  {btcAmount || "Live BTC/USD rate unavailable"}
                </Text>
                {btcAmount && (
                  <Text className="text-[11px] leading-5 text-amber-900 mt-1">
                    Rate: 1 BTC ={" "}
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
                BTC receiving address
              </Text>
              <code className="block overflow-x-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-ui-fg-base">
                {settings.manual.walletAddress ||
                  "Admin has not added a wallet address yet."}
              </code>
            </div>

            <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <Text className="txt-compact-small-plus text-ui-fg-base">
                  Confirmations
                </Text>
                <Text className="text-small-regular text-blue-900 mt-1">
                  {settings.manual.requiredConfirmations} required before order
                  release
                </Text>
              </div>
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <Text className="txt-compact-small-plus text-ui-fg-base">
                  Include reference
                </Text>
                <Text className="text-small-regular text-blue-900 mt-1">
                  Order #{order.display_id} and transaction ID
                </Text>
              </div>
            </div>

            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <Text className="txt-compact-small-plus text-blue-950">
                Details already sent to admin
              </Text>
              <Text className="mt-1 text-small-regular text-blue-900 leading-6">
                Admin can now see this order and manage the payment review. Send
                BTC, then provide the transaction ID if requested.
              </Text>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
              <Text className="text-small-regular text-ui-fg-subtle leading-6">
                {settings.manual.instructions}
              </Text>
              {settings.manual.rateSourceNote && (
                <Text className="mt-2 text-[11px] leading-5 text-ui-fg-muted">
                  {settings.manual.rateSourceNote}
                </Text>
              )}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
            {settings.manual.qrCodeImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.manual.qrCodeImageUrl}
                alt="Bitcoin wallet QR code"
                className="mx-auto aspect-square w-full object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-md bg-slate-100 px-3 text-[11px] leading-5 text-ui-fg-subtle">
                QR will appear after admin adds it
              </div>
            )}
            <Text className="mt-2 text-[11px] leading-5 text-ui-fg-muted">
              Scan QR or copy wallet address
            </Text>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 small:grid-cols-2 gap-3 p-5">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
            <Text className="txt-compact-small-plus text-blue-950">
              BTCPay server
            </Text>
            <Text className="text-small-regular text-blue-900 mt-1 break-all">
              {settings.btcpay.serverUrl || "BTCPay server not configured"}
            </Text>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <Text className="txt-compact-small-plus text-amber-950">
              Invoice status
            </Text>
            <Text className="text-small-regular text-amber-900 mt-1">
              Admin verifies the BTCPay invoice before fulfillment.
            </Text>
          </div>
        </div>
      )}
    </section>
  )
}

export default BitcoinPaymentInstructions
