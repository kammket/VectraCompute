# VectraCompute Admin Product Guide

Medusa Admin is the source of truth for products, photos, variants, prices,
inventory, categories, and product SEO content.

## Product Publishing Workflow

1. Open the Admin dashboard at `http://localhost:9000/app`.
2. Go to **Products** and choose **Create**.
3. Set the product title, handle, description, status, variants, prices, and
   inventory.
4. Upload product photography in the product media area. The storefront uses
   uploaded photos first and falls back to generated VectraCompute visuals only
   when no photo is available.
5. Assign the product to the correct sales channel and at least one category.
6. Confirm the product is published.

## What Admin Can Manage

Admins can manage the ecommerce catalog without code changes:

- product title, subtitle, handle, description, and status,
- product photos and media gallery,
- variants, configuration names, SKUs, prices, inventory, and options,
- product categories and child categories,
- product tags and collections,
- search/SEO metadata,
- purchase-confidence metadata shown on product pages,
- procurement and deployment details shown on product pages.

The storefront reads this data from Medusa and uses it across product pages,
category pages, sitemap entries, internal links, and SEO metadata.

## Category Organization

Use categories to keep the storefront organized:

- `AI & Deep Learning Workstations`
- `GPU Rack Servers`
- `Workstations by CPU Platform`
- `Components & Accessories`

Create child categories when a group grows, for example:

- `Single-GPU Workstations`
- `Multi-GPU Workstations`
- `4U GPU Servers`
- `Liquid-Cooled GPU Servers`
- `Threadripper PRO Workstations`
- `Xeon W Workstations`

Category names and descriptions are used on public category landing pages,
metadata, structured data, footer links, and the sitemap.

## Product SEO Metadata

In the product metadata area, use these optional keys to control public SEO and
trust content:

- `seo_title`: Browser/Google title for the product page.
- `seo_description`: Search snippet and Open Graph description.
- `seo_keywords`: Comma-separated keyword list.
- `canonical_path`: Custom canonical path, usually `/products/product-handle`.
- `og_image`: Open Graph image URL or storefront-relative image path.
- `trust_note`: Short proof statement shown on the product page.
- `best_for`: Comma-separated buyer-fit chips shown on product cards.
- `lead_time`: Procurement/deployment detail shown on product pages.
- `warranty`: Warranty detail shown on product pages.
- `power_draw`: Power planning detail shown on product pages.
- `rack_units`: Rack deployment detail shown on product pages.
- `gpu_memory`: GPU/VRAM detail shown on product pages.
- `cpu_platform`: CPU/platform detail shown on product pages.
- `networking`: Networking detail shown on product pages.
- `support_level`: Support tier/detail shown on product pages.
- `condition`: Product condition, for example `New`, `Refurbished`, or `Validated refurbished`.
- `rating`: Public rating shown in the purchase-confidence section.
- `review_count`: Review count shown beside the rating.
- `returns`: Returns or evaluation policy shown on product pages.
- `financing`: Purchase order, leasing, financing, or payment note.
- `install_support`: Remote setup, installation, or deployment support note.
- `certifications`: Comma-separated trust chips such as burn-in tested, CUDA validated.
- `buyer_faq`: Buyer FAQ lines used for product-page FAQ structured data. Use `Question? Answer.` format, separated by new lines or `|`.

Example:

```text
seo_title = VectraForge X2 Pro AI Workstation | Multi-GPU Deep Learning PC
seo_description = Multi-GPU AI workstation for fine-tuning, RAG development, and CUDA prototyping with burn-in validation and engineer support.
seo_keywords = AI workstation, multi-GPU workstation, CUDA workstation, LLM fine-tuning hardware
trust_note = Validated under sustained GPU load and shipped with a ready-to-train Ubuntu, CUDA, PyTorch, and vLLM stack.
best_for = LLM fine-tuning, RAG development, PyTorch, vLLM
lead_time = Ships in 5-7 business days
warranty = 3-year parts / 5-year labor option
power_draw = 850W typical, 1200W PSU
gpu_memory = 48GB VRAM
support_level = Lifetime engineering support
condition = Validated refurbished
rating = 4.9/5
review_count = 38
returns = 30-day return review on eligible systems
financing = PO, leasing, and financing support available
install_support = Remote setup and driver handoff available
certifications = Burn-in tested, CUDA validated, Ubuntu LTS ready, Engineer supported
buyer_faq = Can I request a custom configuration? Yes, request a quote with your GPU, RAM, storage, power, and software requirements. | Can procurement buy by invoice? Yes, our team can prepare quote-ready details for approval workflows.
```

## Product Page Trust Checklist

A trustworthy product should include:

- Clear title and handle.
- Full product description with workload fit.
- At least one high-quality product photo.
- Variants with human-readable configuration names.
- SKUs for procurement.
- Category assignment.
- Warranty/support note in metadata when relevant.
- Accurate inventory and lead-time expectation.
- Buyer confidence metadata: rating, review count, financing, returns, install support.
- Procurement metadata: lead time, warranty, power, rack units, networking, support level.

## Quote and Compare Experience

Product pages include **Request quote** and **Compare** actions. The quote link
passes the product and selected variant into the contact form so the sales team
receives useful context. The compare list lets shoppers shortlist up to four
systems before requesting a quote.

## Internal Linking

Products should be assigned to categories because category pages link to:

- workload solution pages,
- the AI hardware buying guide,
- procurement guidance,
- warranty and support content,
- related products.

This helps shoppers compare systems and helps search engines understand the site
structure.
