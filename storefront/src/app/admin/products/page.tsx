import { localProducts } from "@lib/catalog/local-catalog"
import { requireAdmin } from "@lib/data/admin-auth"
import {
  listProductOverrides,
  saveProductOverride,
} from "@lib/data/product-overrides"
import { getProductPrice } from "@lib/util/get-product-price"
import Link from "next/link"

export default async function AdminProductsPage() {
  await requireAdmin()
  const overrides = await listProductOverrides()
  const overrideMap = new Map(overrides.map((item) => [item.handle, item]))

  return (
    <main className="min-h-screen bg-grey-5 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-small-semi text-brand-700">
          Back to admin
        </Link>
        <div className="mt-4 flex flex-col gap-2 small:flex-row small:items-end small:justify-between">
          <div>
            <p className="text-small-semi uppercase text-brand-600">
              Product management
            </p>
            <h1 className="text-3xl font-semibold">Catalog controls</h1>
          </div>
          <p className="max-w-xl text-small-regular leading-6 text-ui-fg-subtle">
            Edit price, public title, description, image URL, and active status.
            Image upload can use a Cloudinary, S3, R2, or Vercel Blob URL.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {localProducts.map((product) => {
            const override = overrideMap.get(product.handle)
            const price = getProductPrice({ product }).cheapestPrice

            return (
              <form
                key={product.handle}
                action={saveProductOverride}
                className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest"
              >
                <input type="hidden" name="handle" value={product.handle} />
                <div className="grid grid-cols-1 gap-4 large:grid-cols-[240px_minmax(0,1fr)_180px]">
                  <div>
                    <p className="text-base-semi">{product.title}</p>
                    <p className="mt-1 text-small-regular text-ui-fg-subtle">
                      {product.handle}
                    </p>
                    <p className="mt-2 text-small-semi text-brand-700">
                      Current: {price?.calculated_price ?? "Quote"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
                    <input
                      name="title"
                      defaultValue={override?.title ?? product.title}
                      className="checkout-input"
                      placeholder="SEO product title"
                    />
                    <input
                      name="price_usd"
                      type="number"
                      step="0.01"
                      defaultValue={override?.price_usd ?? ""}
                      className="checkout-input"
                      placeholder="Override price USD"
                    />
                    <input
                      name="image_url"
                      defaultValue={override?.image_url ?? product.thumbnail ?? ""}
                      className="checkout-input small:col-span-2"
                      placeholder="Product image URL"
                    />
                    <textarea
                      name="description"
                      defaultValue={override?.description ?? product.description ?? ""}
                      rows={4}
                      className="checkout-input small:col-span-2 resize-y"
                      placeholder="SEO product description"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-3">
                    <label className="flex items-center gap-2 text-small-regular">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={override?.is_active ?? true}
                      />
                      Active
                    </label>
                    <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )
          })}
        </div>
      </div>
    </main>
  )
}
