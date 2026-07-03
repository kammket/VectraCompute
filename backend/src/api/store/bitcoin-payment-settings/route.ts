import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { getBitcoinPaymentSettings } from "../../../lib/bitcoin-payment-settings";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  );
  const settings = await getBitcoinPaymentSettings(pgConnection);

  return res.status(200).json({
    bitcoin_payment: settings,
  });
}
