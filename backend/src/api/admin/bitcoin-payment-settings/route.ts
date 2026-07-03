import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  getBitcoinPaymentSettings,
  saveBitcoinPaymentSettings,
  type BitcoinPaymentSettings,
} from "../../../lib/bitcoin-payment-settings";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  );
  const settings = await getBitcoinPaymentSettings(pgConnection);

  return res.status(200).json({
    bitcoin_payment: settings,
  });
}

export async function POST(
  req: MedusaRequest<Partial<BitcoinPaymentSettings>>,
  res: MedusaResponse
) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  );
  const settings = await saveBitcoinPaymentSettings(
    req.body ?? {},
    pgConnection
  );

  return res.status(200).json({
    bitcoin_payment: settings,
  });
}
