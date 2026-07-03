"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"

import { ContactFormState, submitContactForm } from "@lib/data/contact"
import { Button, Input, Label } from "@modules/common/components/ui"

const initialState: ContactFormState = { success: false, error: null }

const WORKLOAD_OPTIONS = [
  "LLM fine-tuning",
  "Private RAG",
  "Private inference",
  "Computer vision",
  "Generative media",
  "Data science",
  "GPU rendering",
  "Not sure yet",
]

const SCALE_OPTIONS = [
  "One developer",
  "Small team",
  "Lab / department",
  "Production service",
  "Datacenter rack",
]

const BUDGET_OPTIONS = [
  "Under $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
  "Need guidance",
]

const ContactForm = () => {
  const searchParams = useSearchParams()
  const product = searchParams.get("product") ?? ""
  const variant = searchParams.get("variant") ?? ""
  const workloadParam = searchParams.get("workload") ?? ""
  const scaleParam = searchParams.get("scale") ?? ""
  const constraintsParam = searchParams.get("constraints") ?? ""
  const budgetParam = searchParams.get("budget") ?? ""
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  )

  if (state.success) {
    return (
      <div className="border border-ui-border-base rounded-large p-6">
        <p className="text-base-semi mb-1">Thanks — we got your message.</p>
        <p className="text-base-regular text-ui-fg-subtle">
          An engineer will get back to you within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      <input type="hidden" name="product" value={product} />
      <input type="hidden" name="variant" value={variant} />
      {(product || variant) && (
        <div className="border border-ui-border-base rounded-large bg-grey-5 p-4">
          <p className="text-base-semi mb-1">Quote context</p>
          <p className="text-small-regular text-ui-fg-subtle">
            {product}
            {variant ? ` / ${variant}` : ""}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" name="company" autoComplete="organization" />
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="workload">Primary workload</Label>
          <select
            id="workload"
            name="workload"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            defaultValue={workloadParam}
          >
            <option value="" disabled>
              Select workload
            </option>
            {WORKLOAD_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="scale">Deployment scale</Label>
          <select
            id="scale"
            name="scale"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            defaultValue={scaleParam}
          >
            <option value="" disabled>
              Select scale
            </option>
            {SCALE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="budget">Budget range</Label>
          <select
            id="budget"
            name="budget"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            defaultValue={budgetParam}
          >
            <option value="" disabled>
              Select budget
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gpuPreference">GPU preference</Label>
          <Input
            id="gpuPreference"
            name="gpuPreference"
            placeholder="RTX 5090, A100, H200, L40S, not sure..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="model">Model, framework, or app</Label>
          <Input
            id="model"
            name="model"
            placeholder="Llama, PyTorch, vLLM, Stable Diffusion..."
          />
        </div>
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            name="timeline"
            placeholder="This month, this quarter, urgent..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="constraints">Constraints</Label>
        <Input
          id="constraints"
          name="constraints"
          defaultValue={constraintsParam}
          placeholder="Budget, rack depth, power, noise, remote install..."
        />
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="power">Power / cooling available</Label>
          <Input
            id="power"
            name="power"
            placeholder="120V office, 208V rack, liquid cooling ready..."
          />
        </div>
        <div>
          <Label htmlFor="procurement">Procurement needs</Label>
          <Input
            id="procurement"
            name="procurement"
            placeholder="PO, tax exemption, financing, warranty terms..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="message">What should the system help you do?</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          placeholder="Tell us what you run today, what feels slow, and what success looks like after the upgrade."
        />
      </div>
      {state.error && (
        <p className="text-rose-600 text-small-regular">{state.error}</p>
      )}
      <Button
        type="submit"
        variant="primary"
        isLoading={isPending}
        className="bg-brand-600 hover:bg-brand-700 border-none w-fit"
      >
        Send Message
      </Button>
    </form>
  )
}

export default ContactForm
