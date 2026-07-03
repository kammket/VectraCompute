"use client";

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CurrencyDollar } from "@medusajs/icons";
import { FormEvent, useEffect, useMemo, useState } from "react";

type AdminPrice = {
  id?: string;
  amount?: number;
  currency_code?: string;
  min_quantity?: number | null;
  max_quantity?: number | null;
  rules?: Record<string, string>;
};

type AdminVariant = {
  id: string;
  title: string;
  sku?: string | null;
  prices?: AdminPrice[] | null;
};

type AdminProduct = {
  id: string;
  title: string;
  handle?: string | null;
  status?: string;
  variants?: AdminVariant[] | null;
};

type ProductResponse = {
  products: AdminProduct[];
  count?: number;
};

const fieldStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
  background: "#fff",
} as const;

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
} as const;

const getBaseUsdPrice = (variant: AdminVariant) => {
  const prices = variant.prices ?? [];

  return (
    prices.find(
      (price) =>
        price.currency_code?.toLowerCase() === "usd" &&
        !price.rules?.region_id &&
        price.min_quantity == null &&
        price.max_quantity == null
    ) ??
    prices.find((price) => price.currency_code?.toLowerCase() === "usd") ??
    null
  );
};

const formatUsd = (amount?: number) => {
  if (typeof amount !== "number") {
    return "No USD price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

const normalizePricesForSave = (variant: AdminVariant, amount: number) => {
  const prices = variant.prices ?? [];
  const baseUsd = getBaseUsdPrice(variant);

  if (!baseUsd) {
    return [
      ...prices,
      {
        currency_code: "usd",
        amount,
      },
    ];
  }

  return prices.map((price) =>
    price.id === baseUsd.id
      ? {
          ...price,
          currency_code: "usd",
          amount,
        }
      : price
  );
};

const PriceManagerPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [query, setQuery] = useState("");
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>({});
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);
  const [status, setStatus] = useState("Loading products...");

  const loadProducts = async () => {
    setStatus("Loading products...");
    const params = new URLSearchParams({
      limit: "100",
      fields:
        "id,title,handle,status,*variants,*variants.prices,variants.prices.price_rules.value,variants.prices.price_rules.attribute",
    });

    const response = await fetch(`/admin/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Could not load products");
    }

    const payload = (await response.json()) as ProductResponse;
    const nextProducts = payload.products ?? [];
    const nextDraftPrices: Record<string, string> = {};

    for (const product of nextProducts) {
      for (const variant of product.variants ?? []) {
        const price = getBaseUsdPrice(variant);
        nextDraftPrices[variant.id] =
          typeof price?.amount === "number" ? String(price.amount) : "";
      }
    }

    setProducts(nextProducts);
    setDraftPrices(nextDraftPrices);
    setStatus(`Loaded ${nextProducts.length} products`);
  };

  useEffect(() => {
    loadProducts().catch(() => setStatus("Could not load products"));
  }, []);

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .flatMap((product) =>
        (product.variants ?? []).map((variant) => ({
          product,
          variant,
          price: getBaseUsdPrice(variant),
        }))
      )
      .filter(({ product, variant }) => {
        if (!normalizedQuery) {
          return true;
        }

        return [product.title, product.handle, variant.title, variant.sku]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      });
  }, [products, query]);

  const savePrice = async (
    event: FormEvent<HTMLFormElement>,
    product: AdminProduct,
    variant: AdminVariant
  ) => {
    event.preventDefault();

    const nextAmount = Number(draftPrices[variant.id]);
    if (!Number.isFinite(nextAmount) || nextAmount < 0) {
      setStatus("Enter a valid USD price before saving");
      return;
    }

    setSavingVariantId(variant.id);
    setStatus(`Saving ${product.title} / ${variant.title}...`);

    try {
      const response = await fetch(
        `/admin/products/${product.id}/variants/${variant.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prices: normalizePricesForSave(variant, nextAmount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not save price");
      }

      await loadProducts();
      setStatus(`Saved ${product.title} / ${variant.title}`);
    } catch {
      setStatus("Could not save price. Refresh Admin and try again.");
    } finally {
      setSavingVariantId(null);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 700,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Product management
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Price manager
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
            margin: "10px 0 20px",
            maxWidth: 820,
          }}
        >
          Edit product variant prices quickly. Each row shows the current USD
          price inside the input, so you can replace it and save without hunting
          through nested product forms.
        </p>

        <div
          style={{
            ...cardStyle,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 150px",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <input
            style={fieldStyle}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, handle, variant, or SKU"
          />
          <button
            type="button"
            onClick={() => loadProducts().catch(() => setStatus("Could not load products"))}
            style={{
              border: "0",
              borderRadius: 8,
              padding: "11px 14px",
              color: "#fff",
              background: "#111827",
              cursor: "pointer",
              fontWeight: 750,
            }}
          >
            Refresh
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {rows.map(({ product, variant, price }) => (
            <form
              key={variant.id}
              onSubmit={(event) => savePrice(event, product, variant)}
              style={{
                ...cardStyle,
                padding: 14,
                display: "grid",
                gridTemplateColumns: "minmax(220px, 1.5fr) minmax(160px, 1fr) 150px 110px",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 750 }}>
                  {product.title}
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    lineHeight: 1.5,
                    marginTop: 3,
                  }}
                >
                  {product.handle ? `/${product.handle}` : product.id}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {variant.title}
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    lineHeight: 1.5,
                    marginTop: 3,
                  }}
                >
                  {variant.sku || variant.id}
                </div>
              </div>
              <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
                <span style={{ color: "#6b7280" }}>
                  Current: {formatUsd(price?.amount)}
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  style={fieldStyle}
                  value={draftPrices[variant.id] ?? ""}
                  onChange={(event) =>
                    setDraftPrices((current) => ({
                      ...current,
                      [variant.id]: event.target.value,
                    }))
                  }
                  placeholder="USD price"
                />
              </label>
              <button
                type="submit"
                disabled={savingVariantId === variant.id}
                style={{
                  border: "0",
                  borderRadius: 8,
                  padding: "11px 14px",
                  color: "#fff",
                  background:
                    savingVariantId === variant.id ? "#6b7280" : "#111827",
                  cursor:
                    savingVariantId === variant.id ? "not-allowed" : "pointer",
                  fontWeight: 750,
                }}
              >
                {savingVariantId === variant.id ? "Saving..." : "Save"}
              </button>
            </form>
          ))}
        </div>

        {!rows.length && (
          <div style={{ ...cardStyle, padding: 18, color: "#6b7280" }}>
            No matching variants found.
          </div>
        )}

        <p style={{ color: "#6b7280", fontSize: 12, margin: "14px 0 0" }}>
          {status}
        </p>
      </div>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Price Manager",
  icon: CurrencyDollar,
});

export default PriceManagerPage;
