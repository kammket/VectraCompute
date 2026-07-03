import { retrieveOrder } from "@lib/data/orders"
import { getBitcoinPaymentSettings } from "@lib/data/bitcoin-payment"
import { getBitcoinExchangeRate } from "@lib/data/bitcoin-exchange-rate"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)
  const bitcoinPaymentSettings = await getBitcoinPaymentSettings()
  const bitcoinExchangeRate = await getBitcoinExchangeRate()

  if (!order) {
    return notFound()
  }

  return (
    <OrderCompletedTemplate
      order={order}
      bitcoinPaymentSettings={bitcoinPaymentSettings}
      bitcoinExchangeRate={bitcoinExchangeRate}
    />
  )
}
