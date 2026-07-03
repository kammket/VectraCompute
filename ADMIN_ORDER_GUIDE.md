# VectraCompute Admin Order Guide

Medusa Admin is the source of truth for all storefront orders. When a buyer
places an order from checkout, the storefront completes the Medusa cart and the
backend creates an order that appears in the Admin dashboard.

## Where Admin Manages Orders

1. Open `http://localhost:9000/app`.
2. Go to **Orders**.
3. Open the newest order to review customer, items, shipping, payment, totals,
   fulfillment, and order status.
4. Use order notes/status handling to coordinate payment, quote review,
   fulfillment, shipping, and support handoff.

## Recommended Order Workflow

1. **New order received**: confirm customer, product, configuration, quantity,
   shipping address, and payment status.
2. **Configuration review**: check GPU, CPU, memory, storage, power, rack,
   refurbished condition, and software requirements.
3. **Payment or invoice coordination**: verify payment, purchase order, invoice,
   financing, or quote requirements.
4. **Build / refurbish / validate**: assemble or prepare the system, run
   diagnostics, burn-in, CUDA validation, and any promised software setup.
5. **Fulfillment**: create fulfillment/shipping records in Admin and update the
   customer when the order ships.
6. **After-sale support**: keep warranty, support level, install handoff, and
   configuration notes attached to the order process.

## Buyer Trust Checklist

Before fulfillment, make sure the order has:

- clear product name and variant/configuration,
- SKU and pricing,
- shipping method and customer address,
- payment, invoice, or financing status,
- warranty and support expectation,
- lead time expectation,
- refurbished condition or validation notes when relevant,
- internal notes for any custom request.

## Storefront Order Flow

The storefront order flow is intentionally simple:

1. customer enters address,
2. selects delivery,
3. selects payment/invoice method,
4. reviews configuration and trust details,
5. clicks **Place order**,
6. Medusa creates the order for Admin review.

This means orders placed by customers are visible in Medusa Admin and can be
managed by the admin team from the Orders area.
