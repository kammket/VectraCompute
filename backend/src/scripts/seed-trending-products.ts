import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows";

import { PRODUCTS } from "./seed";

const TRENDING_HANDLES = [
  "vectraforge-blackwell-pro",
  "vectraforge-rtx-5090-ai-workstation",
  "vectraforge-dual-rtx-5090-workstation",
  "vectraforge-rtx-pro-6000-studio",
  "vectraspark-ai-mini",
  "vectraforge-vram-lab-b70",
  "vectraforge-budget-vram-128gb",
  "vectrarack-refurb-h100",
  "vectrarack-refurb-a100-server",
  "vectrarack-refurb-l40s-inference-server",
  "vectrarack-l40s-inference-node",
  "vectraedge-l4-micro-server",
  "vectrarack-liquid-h200-node",
  "vectrastore-nvme-ai-data-node",
  "vectrastore-500tb-nvme-ai-storage-server",
  "vectrainfer-memorymax-server",
  "vectrafield-rugged-ai-workstation",
  "vectracluster-starter-pod",
  "vectrarack-mi300x-inference-server",
  "vectrarag-private-ai-appliance",
  "vectralocal-llm-inference-appliance",
  "vectrarag-legal-ai-appliance",
  "vectravector-database-server",
  "vectra-rtx-pro-6000-blackwell-gpu",
  "vectra-100gbe-ai-fabric-kit",
  "vectra-400gbe-ai-fabric-kit",
  "vectra-800gbe-ai-fabric-kit",
  "vectrarack-cooling-readiness-kit",
  "vectraedge-vision-ai-kit",
  "vectraedge-robotics-ai-kit",
  "vectraedge-camera-ai-server",
  "vectra-ai-server-upgrade-bundle",
  "vectraspark-dgx-class-ai-mini",
  "vectradgx-spark-personal-ai-supercomputer",
  "vectramini-ryzen-ai-max-395-local-llm-workstation",
  "vectramini-panther-lake-ai-developer-pc",
  "vectrarack-mi350x-ai-server",
  "vectrarack-mi350p-pcie-ai-server",
  "vectrarack-gaudi-3-ai-accelerator-server",
  "vectrarack-refurb-h200-server",
  "vectrarack-b200-quote-ready-ai-cluster",
  "vectrarack-hgx-b200-8gpu-ai-server",
  "vectraforge-rtx-pro-5000-blackwell-workstation",
  "vectraforge-rtx-pro-6000-blackwell-mobile-ai-workstation",
  "vectraforge-rtx-pro-4000-blackwell-workstation",
  "vectraforge-arc-pro-b70-vram-lab",
  "vectraedge-ai-inference-appliance",
  "vectralease-refurbished-ai-server-bundle",
  "vectracluster-ai-starter-rack",
  "vectramem-1tb-ddr5-ecc-ai-memory-kit",
  "vectramem-2tb-rag-inference-memory-kit",
  "vectrastore-120tb-nvme-dataset-expansion-kit",
  "vectrarack-h200-nvl-inference-appliance",
  "vectrarack-gb300-nvl72-quote-ready-rack",
  "vectrarack-gb200-nvl72-ai-factory-rack",
  "vectrarubin-ai-cluster-readiness-package",
  "vectrapower-60kw-ai-rack-pdu-kit",
  "vectracool-cdu-liquid-cooling-package",
  "vectraops-gpu-server-monitoring-appliance",
  "vectrajetson-thor-robotics-ai-kit",
  "vectrahailo-edge-npu-gateway",
  "vectravision-ai-video-analytics-server",
];

export default async function seedTrendingProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const trendingProducts = PRODUCTS.filter((product) =>
    TRENDING_HANDLES.includes(product.handle)
  );

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });

  const existingHandles = new Set(
    existingProducts.map((product) => product.handle)
  );

  const productsToCreate = trendingProducts.filter(
    (product) => !existingHandles.has(product.handle)
  );

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  const { data: referenceProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "sales_channels.id", "sales_channels.name"],
    filters: {
      handle: "vectraforge-x1",
    },
  });

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });

  const shippingProfile = shippingProfiles[0];
  const salesChannel =
    referenceProducts[0]?.sales_channels?.[0] ?? salesChannels[0];
  const stockLocation = stockLocations[0];

  if (!shippingProfile || !salesChannel || !stockLocation) {
    throw new Error(
      "Missing shipping profile, sales channel, or stock location. Run the main seed first."
    );
  }

  if (productsToCreate.length) {
    logger.info(
      `Creating ${productsToCreate.length} trending AI hardware products.`
    );

    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate.map((product) => ({
          title: product.title,
          handle: product.handle,
          category_ids: [
            categories.find((category) => category.name === product.category)!
              .id,
          ],
          description: product.description,
          metadata: product.metadata,
          weight: product.weight,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: product.optionTitle,
              values: product.variants.map((variant) => variant.optionValue),
            },
          ],
          variants: product.variants.map((variant) => ({
            title: variant.title,
            sku: variant.sku,
            options: {
              [product.optionTitle]: variant.optionValue,
            },
            prices: [
              {
                amount: variant.priceUsd,
                currency_code: "usd",
              },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        })),
      },
    });
  } else {
    logger.info("Trending AI hardware products already exist.");
  }

  const newSkus = new Set(
    productsToCreate.flatMap((product) =>
      product.variants.map((variant) => variant.sku)
    )
  );

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  });

  const newInventoryItems = inventoryItems.filter(
    (item) => item.sku && newSkus.has(item.sku)
  );

  if (newInventoryItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: newInventoryItems.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 25,
          inventory_item_id: item.id,
        })),
      },
    });
  }

  const { data: currentTrendingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: {
      handle: TRENDING_HANDLES,
    },
  });

  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: salesChannel.id,
      add: currentTrendingProducts.map((product) => product.id),
    },
  });

  logger.info("Finished creating and linking trending AI hardware products.");
}
