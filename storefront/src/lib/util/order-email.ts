// Order confirmation email, gated on RESEND_API_KEY + ORDER_EMAIL_FROM.
// Without those env vars this is a silent no-op, so checkout never depends on
// email infrastructure being configured. Uses Resend's plain HTTPS API to avoid
// adding an SDK dependency. Failures are logged and swallowed — a lost email
// must never block or fail an order that was already stored.

type OrderEmailInput = {
  to: string
  customerName: string
  displayId?: number | string | null
  totalText: string
  baseUrl?: string
}

export const sendOrderConfirmationEmail = async ({
  to,
  customerName,
  displayId,
  totalText,
  baseUrl = "https://vectracompute-storefront.vercel.app",
}: OrderEmailInput): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_EMAIL_FROM

  if (!apiKey || !from) {
    return false
  }

  const orderLabel = displayId ? `Order #${displayId}` : "Your order"
  const trackingUrl = displayId
    ? `${baseUrl}/us/order/status?order=${displayId}&email=${encodeURIComponent(to)}`
    : `${baseUrl}/us/order/status`

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
      <h2 style="color:#111827">${orderLabel} received</h2>
      <p>Hi ${escapeHtml(customerName)},</p>
      <p>We received your VectraCompute order (${escapeHtml(totalText)}). It is now awaiting Bitcoin payment — the exact amount, wallet address, and payment window are on your confirmation page.</p>
      <p>You can follow every stage — payment review, build &amp; validation, shipping — here:</p>
      <p><a href="${trackingUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none">Track your order</a></p>
      <p style="font-size:13px;color:#6b7280">Keep this email: the order number and your checkout email are what you need to check status. If anything looks wrong, reply or use the contact page and reference ${orderLabel}.</p>
      <p style="font-size:13px;color:#6b7280">— VectraCompute</p>
    </div>
  `.trim()

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${orderLabel} received — awaiting payment | VectraCompute`,
        html,
      }),
    })

    if (!response.ok) {
      console.error(
        "Order confirmation email failed",
        response.status,
        (await response.text()).slice(0, 300)
      )
      return false
    }

    return true
  } catch (error) {
    console.error("Order confirmation email failed", error)
    return false
  }
}

const escapeHtml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[
        char
      ] as string)
  )
