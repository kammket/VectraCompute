"use server"

import { revalidatePath } from "next/cache"
import { Client, type QueryResultRow } from "pg"

// Simple key/value store settings in the shared Postgres, managed from the
// admin panel. Currently used for Bitcoin payment settings so the wallet
// address does not depend on dashboard env vars being right.

export type StoredPaymentSettings = {
  walletAddress?: string
  qrCodeImageUrl?: string
  instructions?: string
  requiredConfirmations?: number
  paymentExpiryMinutes?: number
}

const SETTING_KEYS = {
  wallet: "bitcoin_wallet_address",
  qr: "bitcoin_qr_code_url",
  instructions: "bitcoin_payment_instructions",
  confirmations: "bitcoin_required_confirmations",
  expiry: "bitcoin_payment_expiry",
} as const

const getClient = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return null
  }

  return new Client({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? undefined
      : { rejectUnauthorized: false },
  })
}

async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = []
) {
  const client = getClient()
  if (!client) {
    return { rows: [] as T[] }
  }

  try {
    await client.connect()
    const result = await client.query<T>(sql, params)
    return { rows: result.rows as T[] }
  } catch (error) {
    console.error("VectraCompute settings query failed", error)
    return { rows: [] as T[] }
  } finally {
    await client.end().catch(() => {})
  }
}

async function ensureSettingsTable() {
  await query(`
    create table if not exists vectra_settings (
      key text primary key,
      value text not null,
      updated_at timestamptz not null default now()
    )
  `)
}

export async function getStoredPaymentSettings(): Promise<StoredPaymentSettings> {
  await ensureSettingsTable()
  const result = await query<{ key: string; value: string }>(
    "select key, value from vectra_settings where key = any($1)",
    [Object.values(SETTING_KEYS)]
  )

  const map = new Map(result.rows.map((row) => [row.key, row.value]))

  return {
    walletAddress: map.get(SETTING_KEYS.wallet)?.trim() || undefined,
    qrCodeImageUrl: map.get(SETTING_KEYS.qr)?.trim() || undefined,
    instructions: map.get(SETTING_KEYS.instructions)?.trim() || undefined,
    requiredConfirmations: map.get(SETTING_KEYS.confirmations)
      ? Number(map.get(SETTING_KEYS.confirmations))
      : undefined,
    paymentExpiryMinutes: map.get(SETTING_KEYS.expiry)
      ? Number(map.get(SETTING_KEYS.expiry))
      : undefined,
  }
}

export async function savePaymentSettings(formData: FormData) {
  await ensureSettingsTable()

  const entries: [string, string][] = [
    [SETTING_KEYS.wallet, String(formData.get("wallet_address") ?? "").trim()],
    [SETTING_KEYS.qr, String(formData.get("qr_code_url") ?? "").trim()],
    [
      SETTING_KEYS.instructions,
      String(formData.get("instructions") ?? "").trim(),
    ],
    [
      SETTING_KEYS.confirmations,
      String(formData.get("required_confirmations") ?? "").trim(),
    ],
    [SETTING_KEYS.expiry, String(formData.get("payment_expiry") ?? "").trim()],
  ]

  for (const [key, value] of entries) {
    if (value) {
      await query(
        `insert into vectra_settings (key, value, updated_at)
         values ($1, $2, now())
         on conflict (key) do update set value = excluded.value, updated_at = now()`,
        [key, value]
      )
    } else {
      await query("delete from vectra_settings where key = $1", [key])
    }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/settings")
}
