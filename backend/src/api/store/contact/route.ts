import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

type ContactRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  product?: string;
  variant?: string;
  budget?: string;
  gpuPreference?: string;
  powerCooling?: string;
  procurement?: string;
};

const RFQ_DATA_DIR = path.join(process.cwd(), "data");
const RFQ_INBOX_FILE = path.join(RFQ_DATA_DIR, "rfq-inbox.jsonl");

const extractField = (message: string, label: string) => {
  const match = message.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
  return match?.[1]?.trim();
};

export async function POST(
  req: MedusaRequest<ContactRequestBody>,
  res: MedusaResponse
) {
  const {
    name,
    email,
    company,
    message,
    product,
    variant,
    budget,
    gpuPreference,
    powerCooling,
    procurement,
  } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "name, email, and message are required",
    });
  }

  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const rfqRecord = {
    id: `rfq_${Date.now()}`,
    status: "new",
    created_at: new Date().toISOString(),
    name,
    email,
    company: company || null,
    product:
      product ||
      extractField(message, "Product") ||
      extractField(message, "Quote context") ||
      null,
    variant: variant || extractField(message, "Variant") || null,
    budget: budget || extractField(message, "Budget") || null,
    gpu_preference:
      gpuPreference || extractField(message, "GPU preference") || null,
    power_cooling:
      powerCooling || extractField(message, "Power / cooling") || null,
    procurement: procurement || extractField(message, "Procurement") || null,
    message,
  };

  await mkdir(RFQ_DATA_DIR, { recursive: true });
  await appendFile(RFQ_INBOX_FILE, `${JSON.stringify(rfqRecord)}\n`, "utf8");

  logger.info(
    `New contact / "Ask an Expert" inquiry from ${name} <${email}>${
      company ? ` (${company})` : ""
    }: ${message}`
  );

  res.status(200).json({ success: true });
}
