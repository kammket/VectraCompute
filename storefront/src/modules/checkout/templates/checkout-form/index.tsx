import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { getBitcoinPaymentSettings } from "@lib/data/bitcoin-payment"
import { getBitcoinExchangeRate } from "@lib/data/bitcoin-exchange-rate"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  const bitcoinPaymentSettings = await getBitcoinPaymentSettings()
  const bitcoinExchangeRate = await getBitcoinExchangeRate()

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment
        cart={cart}
        availablePaymentMethods={paymentMethods}
        bitcoinPaymentSettings={bitcoinPaymentSettings}
        bitcoinExchangeRate={bitcoinExchangeRate}
      />

      <Review
        cart={cart}
        bitcoinPaymentSettings={bitcoinPaymentSettings}
        bitcoinExchangeRate={bitcoinExchangeRate}
      />
    </div>
  )
}
