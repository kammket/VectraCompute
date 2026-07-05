import { requireAdmin } from "@lib/data/admin-auth"
import { getBitcoinPaymentSettings } from "@lib/data/bitcoin-payment"
import {
  getStoredPaymentSettings,
  savePaymentSettings,
} from "@lib/data/store-settings"
import Link from "next/link"

export default async function AdminSettingsPage(props: {
  searchParams: Promise<{ saved?: string }>
}) {
  await requireAdmin()
  const { saved } = await props.searchParams
  const [stored, effective] = await Promise.all([
    getStoredPaymentSettings(),
    getBitcoinPaymentSettings(),
  ])

  const storageConnected = Boolean(process.env.DATABASE_URL)

  return (
    <main className="min-h-screen bg-grey-5 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-small-semi text-brand-700">
          Back to admin
        </Link>
        <div className="mt-4">
          <p className="text-small-semi uppercase text-brand-600">
            Store settings
          </p>
          <h1 className="text-3xl font-semibold">Payment settings</h1>
          <p className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
            Values saved here are stored in the database and override
            environment variables everywhere — checkout, order confirmation,
            and the AI chat.
          </p>
        </div>

        {saved && (
          <div className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 px-5 py-4 text-emerald-900">
            <p className="text-base-semi">Settings saved</p>
            <p className="mt-1 text-small-regular leading-6">
              Buyers now see the values below. The AI chat backend picks them
              up within a minute.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-md border border-ui-border-base bg-white p-5">
          <p className="text-small-semi text-ui-fg-base">
            Currently shown to buyers
          </p>
          <code className="mt-2 block overflow-x-auto rounded-md border border-ui-border-base bg-grey-5 px-3 py-3 text-[12px]">
            {effective?.manual.walletAddress || "No address resolved"}
          </code>
          <p className="mt-2 text-xs text-ui-fg-muted">
            Source:{" "}
            {stored.walletAddress
              ? "admin setting (this page)"
              : process.env.BITCOIN_WALLET_ADDRESS
              ? "environment variable"
              : "built-in default"}
          </p>
        </div>

        {!storageConnected && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-small-regular text-amber-900">
            DATABASE_URL is not connected on this deployment, so saving here
            will not persist. The built-in default address still shows to
            buyers.
          </div>
        )}

        <form
          action={savePaymentSettings}
          className="mt-6 grid gap-4 rounded-md border border-ui-border-base bg-white p-5"
        >
          <label className="grid gap-1 text-small-regular">
            <span className="font-medium">Bitcoin wallet address</span>
            <input
              name="wallet_address"
              defaultValue={stored.walletAddress ?? ""}
              placeholder="bc1q..."
              className="checkout-input font-mono"
            />
            <span className="text-xs text-ui-fg-muted">
              Double-check every character — payments to a mistyped address
              cannot be recovered.
            </span>
          </label>

          <label className="grid gap-1 text-small-regular">
            <span className="font-medium">QR code image URL (optional)</span>
            <input
              name="qr_code_url"
              defaultValue={stored.qrCodeImageUrl ?? ""}
              placeholder="https://..."
              className="checkout-input"
            />
          </label>

          <label className="grid gap-1 text-small-regular">
            <span className="font-medium">Payment instructions (optional)</span>
            <textarea
              name="instructions"
              defaultValue={stored.instructions ?? ""}
              rows={3}
              placeholder="Send the exact BTC amount and keep your transaction ID..."
              className="checkout-input resize-y"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
            <label className="grid gap-1 text-small-regular">
              <span className="font-medium">Required confirmations</span>
              <input
                name="required_confirmations"
                type="number"
                min={1}
                max={12}
                defaultValue={stored.requiredConfirmations ?? ""}
                placeholder="2"
                className="checkout-input"
              />
            </label>
            <label className="grid gap-1 text-small-regular">
              <span className="font-medium">Payment window (minutes)</span>
              <input
                name="payment_expiry"
                type="number"
                min={5}
                max={1440}
                defaultValue={stored.paymentExpiryMinutes ?? ""}
                placeholder="30"
                className="checkout-input"
              />
            </label>
          </div>

          <button className="h-11 rounded-md bg-slate-950 px-5 text-small-semi text-white">
            Save payment settings
          </button>
          <p className="text-xs leading-5 text-ui-fg-muted">
            Leave a field empty to fall back to the environment variable or the
            built-in default. Changes apply to the storefront immediately; the
            AI chat backend picks them up within a minute.
          </p>
        </form>
      </div>
    </main>
  )
}
