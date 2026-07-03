"use server"

import { sdk } from "@lib/config"

export type ContactFormState = {
  success: boolean
  error: string | null
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim()
  const email = formData.get("email")?.toString().trim()
  const company = formData.get("company")?.toString().trim()
  const product = formData.get("product")?.toString().trim()
  const variant = formData.get("variant")?.toString().trim()
  const workload = formData.get("workload")?.toString().trim()
  const scale = formData.get("scale")?.toString().trim()
  const budget = formData.get("budget")?.toString().trim()
  const gpuPreference = formData.get("gpuPreference")?.toString().trim()
  const model = formData.get("model")?.toString().trim()
  const timeline = formData.get("timeline")?.toString().trim()
  const constraints = formData.get("constraints")?.toString().trim()
  const power = formData.get("power")?.toString().trim()
  const procurement = formData.get("procurement")?.toString().trim()
  const message = formData.get("message")?.toString().trim()

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." }
  }

  try {
    const structuredMessage = [
      product ? `Product: ${product}` : null,
      variant ? `Variant: ${variant}` : null,
      workload ? `Workload: ${workload}` : null,
      scale ? `Scale: ${scale}` : null,
      budget ? `Budget: ${budget}` : null,
      gpuPreference ? `GPU preference: ${gpuPreference}` : null,
      model ? `Model / framework: ${model}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      constraints ? `Power / rack / budget constraints: ${constraints}` : null,
      power ? `Power / cooling available: ${power}` : null,
      procurement ? `Procurement needs: ${procurement}` : null,
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join("\n")

    await sdk.client.fetch("/store/contact", {
      method: "POST",
      body: { name, email, company, message: structuredMessage },
    })
    return { success: true, error: null }
  } catch {
    return {
      success: false,
      error: "Something went wrong sending your message. Please try again.",
    }
  }
}
