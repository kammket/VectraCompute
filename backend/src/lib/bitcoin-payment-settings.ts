import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type BitcoinPaymentMode = "manual_wallet" | "btcpay";

export type BitcoinPaymentSettings = {
  enabled: boolean;
  activeMode: BitcoinPaymentMode;
  manual: {
    walletAddress: string;
    qrCodeImageUrl: string;
    instructions: string;
    requiredConfirmations: number;
    paymentExpiryMinutes: number;
    rateSourceNote: string;
  };
  btcpay: {
    serverUrl: string;
    storeId: string;
    checkoutInstructions: string;
    webhookUrl: string;
    apiKeyConfigured: boolean;
  };
  updatedAt: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "bitcoin-payment-settings.json");
const SETTINGS_TABLE = "vectra_bitcoin_payment_settings";
const SETTINGS_KEY = "default";

const DEFAULT_SETTINGS: BitcoinPaymentSettings = {
  enabled: false,
  activeMode: "manual_wallet",
  manual: {
    walletAddress: "",
    qrCodeImageUrl: "",
    instructions:
      "Send the exact BTC amount shown on your invoice, then reply with the transaction ID. Orders are released after confirmation review.",
    requiredConfirmations: 2,
    paymentExpiryMinutes: 60,
    rateSourceNote:
      "BTC/USD is calculated automatically from a live market-rate API and may be rechecked before fulfillment.",
  },
  btcpay: {
    serverUrl: "",
    storeId: "",
    checkoutInstructions:
      "A BTCPay invoice will be generated during checkout. The order remains under admin review until the payment is verified.",
    webhookUrl: "",
    apiKeyConfigured: false,
  },
  updatedAt: null,
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const asString = (value: unknown) => (typeof value === "string" ? value : "");

const asPositiveInteger = (value: unknown, fallback: number) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? Math.round(numberValue)
    : fallback;
};

export const normalizeBitcoinPaymentSettings = (
  input: Partial<BitcoinPaymentSettings>
): BitcoinPaymentSettings => {
  const activeMode =
    input.activeMode === "btcpay" || input.activeMode === "manual_wallet"
      ? input.activeMode
      : DEFAULT_SETTINGS.activeMode;

  return {
    enabled: asBoolean(input.enabled, DEFAULT_SETTINGS.enabled),
    activeMode,
    manual: {
      walletAddress: asString(input.manual?.walletAddress).trim(),
      qrCodeImageUrl: asString(input.manual?.qrCodeImageUrl).trim(),
      instructions:
        asString(input.manual?.instructions).trim() ||
        DEFAULT_SETTINGS.manual.instructions,
      requiredConfirmations: asPositiveInteger(
        input.manual?.requiredConfirmations,
        DEFAULT_SETTINGS.manual.requiredConfirmations
      ),
      paymentExpiryMinutes: asPositiveInteger(
        input.manual?.paymentExpiryMinutes,
        DEFAULT_SETTINGS.manual.paymentExpiryMinutes
      ),
      rateSourceNote:
        asString(input.manual?.rateSourceNote).trim() ||
        DEFAULT_SETTINGS.manual.rateSourceNote,
    },
    btcpay: {
      serverUrl: asString(input.btcpay?.serverUrl).trim(),
      storeId: asString(input.btcpay?.storeId).trim(),
      checkoutInstructions:
        asString(input.btcpay?.checkoutInstructions).trim() ||
        DEFAULT_SETTINGS.btcpay.checkoutInstructions,
      webhookUrl: asString(input.btcpay?.webhookUrl).trim(),
      apiKeyConfigured: asBoolean(
        input.btcpay?.apiKeyConfigured,
        DEFAULT_SETTINGS.btcpay.apiKeyConfigured
      ),
    },
    updatedAt: asString(input.updatedAt) || null,
  };
};

const ensureSettingsTable = async (pgConnection?: any) => {
  if (!pgConnection?.raw) {
    return false;
  }

  await pgConnection.raw(`
    create table if not exists ${SETTINGS_TABLE} (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);

  return true;
};

const getSettingsFromDatabase = async (pgConnection?: any) => {
  const hasTable = await ensureSettingsTable(pgConnection);

  if (!hasTable) {
    return null;
  }

  const result = await pgConnection(SETTINGS_TABLE)
    .select("value")
    .where({ key: SETTINGS_KEY })
    .first();

  return result?.value
    ? normalizeBitcoinPaymentSettings(result.value)
    : null;
};

const saveSettingsToDatabase = async (
  settings: BitcoinPaymentSettings,
  pgConnection?: any
) => {
  const hasTable = await ensureSettingsTable(pgConnection);

  if (!hasTable) {
    return false;
  }

  await pgConnection(SETTINGS_TABLE)
    .insert({
      key: SETTINGS_KEY,
      value: pgConnection.raw("?::jsonb", [JSON.stringify(settings)]),
      updated_at: new Date(),
    })
    .onConflict("key")
    .merge({
      value: pgConnection.raw("?::jsonb", [JSON.stringify(settings)]),
      updated_at: new Date(),
    });

  return true;
};

export const getBitcoinPaymentSettings =
  async (pgConnection?: any): Promise<BitcoinPaymentSettings> => {
    const databaseSettings = await getSettingsFromDatabase(pgConnection);
    if (databaseSettings) {
      return databaseSettings;
    }

    try {
      const contents = await readFile(SETTINGS_FILE, "utf8");
      return normalizeBitcoinPaymentSettings(JSON.parse(contents));
    } catch {
      return DEFAULT_SETTINGS;
    }
  };

export const saveBitcoinPaymentSettings = async (
  input: Partial<BitcoinPaymentSettings>,
  pgConnection?: any
) => {
  const settings = normalizeBitcoinPaymentSettings({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  const savedToDatabase = await saveSettingsToDatabase(settings, pgConnection);
  if (savedToDatabase) {
    return settings;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));

  return settings;
};
