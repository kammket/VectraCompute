import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { readFile } from "node:fs/promises";
import path from "node:path";

type RfqRecord = {
  id: string;
  status: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  product: string | null;
  variant: string | null;
  budget: string | null;
  gpu_preference: string | null;
  power_cooling: string | null;
  procurement: string | null;
  message: string;
};

const RFQ_INBOX_FILE = path.join(process.cwd(), "data", "rfq-inbox.jsonl");

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  try {
    const contents = await readFile(RFQ_INBOX_FILE, "utf8");
    const rfqs = contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as RfqRecord)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return res.status(200).json({
      rfqs,
      count: rfqs.length,
    });
  } catch (error) {
    return res.status(200).json({
      rfqs: [],
      count: 0,
    });
  }
}
