import { localCategories } from "@lib/catalog/local-catalog"
import { requireAdmin } from "@lib/data/admin-auth"
import {
  isProductStorageConfigured,
  listAdminCatalogProducts,
  listProductOverrides,
  saveProductOverride,
} from "@lib/data/product-overrides"
import { getProductPrice } from "@lib/util/get-product-price"
import Link from "next/link"

const categoryOptions = localCategories.map((category) => ({
  label: category.name,
  value: category.handle,
}))

function ProductFields({
  product,
  override,
  mode,
}: {
  product?: Awaited<ReturnType<typeof listAdminCatalogProducts>>[number]
  override?: Awaited<ReturnType<typeof listProductOverrides>>[number]
  mode: "create" | "edit"
}) {
  const metadata = product?.metadata as Record<string, unknown> | undefined
  const image = override?.image_url ?? product?.thumbnail ?? ""
  const price = product ? getProductPrice({ product }).cheapestPrice : null
  const currentPrice =
    override?.price_usd ??
    price?.calculated_price?.replace(/[^0-9.]/g, "") ??
    ""
  const categoryHandle =
    override?.category ??
    product?.categories?.[0]?.handle ??
    categoryOptions[0]?.value

  return (
    <div className="grid grid-cols-1 gap-4 large:grid-cols-[220px_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="overflow-hidden rounded-md border border-ui-border-base bg-grey-5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product?.title ?? "Product photo"}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-small-regular text-ui-fg-muted">
              No photo yet
            </div>
          )}
        </div>
        <label className="grid gap-1 text-small-regular">
          Upload product photo
          <input
            name="image_file"
            type="file"
            accept="image/*"
            className="checkout-input"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Or image URL
          <input
            name="image_url"
            defaultValue={image.startsWith("data:") ? "" : image}
            className="checkout-input"
            placeholder="https://..."
          />
        </label>

        <div className="grid gap-2 rounded-md border border-ui-border-base bg-grey-5 p-3">
          <p className="text-small-semi">Gallery photos</p>
          {override?.gallery_images?.length ? (
            <div className="grid grid-cols-2 gap-2">
              {override.gallery_images.map((url, index) => (
                <label
                  key={`${index}-${url.slice(0, 24)}`}
                  className="group relative block cursor-pointer overflow-hidden rounded-md border border-ui-border-base"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Gallery photo ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-black/60 px-2 py-1 text-[11px] text-white">
                    <input
                      type="checkbox"
                      name="remove_gallery"
                      value={index}
                      className="h-3.5 w-3.5"
                    />
                    Remove
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ui-fg-muted">
              No extra photos yet. The main photo above is shown first; add more
              angles below.
            </p>
          )}
          <label className="grid gap-1 text-small-regular">
            Add photos (select multiple)
            <input
              name="gallery_files"
              type="file"
              accept="image/*"
              multiple
              className="checkout-input"
            />
          </label>
          <p className="text-[11px] leading-4 text-ui-fg-muted">
            Up to 8 gallery photos, max 1.5MB each. Tick “Remove” on a photo and
            save to delete it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
        <input type="hidden" name="is_custom" value={String(mode === "create")} />
        <label className="grid gap-1 text-small-regular">
          Product title
          <input
            name="title"
            required
            defaultValue={override?.title ?? product?.title ?? ""}
            className="checkout-input"
            placeholder="NVIDIA H200 GPU Server"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          SEO handle / slug
          <input
            name="handle"
            required={mode === "edit"}
            readOnly={mode === "edit"}
            defaultValue={override?.handle ?? product?.handle ?? ""}
            className="checkout-input read-only:bg-grey-10"
            placeholder="nvidia-h200-gpu-server"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Price USD
          <input
            name="price_usd"
            type="number"
            step="0.01"
            defaultValue={currentPrice}
            className="checkout-input"
            placeholder="14999"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Category
          <select
            name="category"
            defaultValue={categoryHandle}
            className="checkout-input"
          >
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-small-regular">
          SKU
          <input
            name="sku"
            defaultValue={override?.sku ?? product?.variants?.[0]?.sku ?? ""}
            className="checkout-input"
            placeholder="VC-H200-8GPU"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Variant / configuration
          <input
            name="option_value"
            defaultValue={
              override?.option_value ?? product?.variants?.[0]?.title ?? ""
            }
            className="checkout-input"
            placeholder="8x H200, 2TB RAM, 120TB NVMe"
          />
        </label>
        <input
          type="hidden"
          name="option_title"
          value={override?.option_title ?? "Configuration"}
        />
        <label className="grid gap-1 text-small-regular small:col-span-2">
          Short subtitle / best use
          <input
            name="subtitle"
            defaultValue={override?.subtitle ?? product?.subtitle ?? ""}
            className="checkout-input"
            placeholder="Best for enterprise LLM inference and RAG"
          />
        </label>
        <label className="grid gap-1 text-small-regular small:col-span-2">
          Product description
          <textarea
            name="description"
            defaultValue={override?.description ?? product?.description ?? ""}
            rows={4}
            className="checkout-input resize-y"
            placeholder="Explain the hardware, workload fit, validation, warranty, and why buyers can trust it."
          />
        </label>
        <label className="grid gap-1 text-small-regular small:col-span-2">
          Technical specs
          <textarea
            name="specs"
            defaultValue={override?.specs ?? String(metadata?.specs ?? "")}
            rows={3}
            className="checkout-input resize-y"
            placeholder="GPU: 8x H200 | CPU: Dual EPYC | Memory: 2TB ECC | Storage: 120TB NVMe | Network: 400GbE"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          SEO title
          <input
            name="seo_title"
            defaultValue={override?.seo_title ?? String(metadata?.seo_title ?? "")}
            className="checkout-input"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          SEO keywords
          <input
            name="seo_keywords"
            defaultValue={
              override?.seo_keywords ?? String(metadata?.seo_keywords ?? "")
            }
            className="checkout-input"
            placeholder="H200 server, AI GPU server, LLM inference hardware"
          />
        </label>
        <label className="grid gap-1 text-small-regular small:col-span-2">
          SEO description
          <textarea
            name="seo_description"
            defaultValue={
              override?.seo_description ??
              String(metadata?.seo_description ?? "")
            }
            rows={2}
            className="checkout-input resize-y"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Warranty
          <input
            name="warranty"
            defaultValue={override?.warranty ?? String(metadata?.warranty ?? "")}
            className="checkout-input"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Condition
          <input
            name="condition"
            defaultValue={override?.condition ?? String(metadata?.condition ?? "")}
            className="checkout-input"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Lead time
          <input
            name="lead_time"
            defaultValue={override?.lead_time ?? String(metadata?.lead_time ?? "")}
            className="checkout-input"
          />
        </label>
        <label className="grid gap-1 text-small-regular">
          Support level
          <input
            name="support_level"
            defaultValue={
              override?.support_level ?? String(metadata?.support_level ?? "")
            }
            className="checkout-input"
          />
        </label>
        <label className="flex items-center gap-2 text-small-regular">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={override?.is_active ?? true}
          />
          Product visible on public store
        </label>
        <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
          {mode === "create" ? "Add product" : "Save product"}
        </button>
      </div>
    </div>
  )
}

export default async function AdminProductsPage() {
  await requireAdmin()
  const [products, overrides, storageConfigured] = await Promise.all([
    listAdminCatalogProducts(),
    listProductOverrides(),
    isProductStorageConfigured(),
  ])
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
            <h1 className="text-3xl font-semibold">Manage catalog</h1>
          </div>
          <p className="max-w-xl text-small-regular leading-6 text-ui-fg-subtle">
            Add products, upload photos, assign categories, edit prices, and
            improve SEO content. Changes are stored in Railway Postgres and
            appear on the Vercel storefront after save.
          </p>
        </div>

        {!storageConfigured && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <p className="text-base-semi">Product storage is not connected</p>
            <p className="mt-2 text-small-regular leading-6">
              Add the Railway public Postgres URL as DATABASE_URL in Vercel and
              redeploy. The page will still show seeded products, but new
              products, uploaded photos, and edits need the database.
            </p>
          </div>
        )}

        <form
          action={saveProductOverride}
          className="mt-8 rounded-md border border-brand-200 bg-white p-5 shadow-elevation-card-rest"
        >
          <div className="mb-5">
            <p className="text-small-semi uppercase text-brand-600">
              Add new product
            </p>
            <h2 className="text-xl font-semibold">Create a public product page</h2>
          </div>
          <ProductFields mode="create" />
        </form>

        <div className="mt-10">
          <div className="mb-4">
            <p className="text-small-semi uppercase text-brand-600">
              Existing products
            </p>
            <h2 className="text-2xl font-semibold">Edit catalog products</h2>
          </div>
          <div className="grid gap-4">
            {products.map((product) => {
              const override = overrideMap.get(product.handle)

              return (
                <form
                  key={product.handle}
                  action={saveProductOverride}
                  className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest"
                >
                  <div className="mb-4 flex flex-col gap-2 small:flex-row small:items-center small:justify-between">
                    <div>
                      <p className="text-base-semi">{product.title}</p>
                      <p className="text-small-regular text-ui-fg-subtle">
                        /products/{product.handle}
                      </p>
                    </div>
                    <Link
                      href={`/us/products/${product.handle}`}
                      className="text-small-semi text-brand-700"
                    >
                      View product
                    </Link>
                  </div>
                  <ProductFields
                    mode="edit"
                    product={product}
                    override={override}
                  />
                </form>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
