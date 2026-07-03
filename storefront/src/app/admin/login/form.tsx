"use client"

import { loginAdmin } from "@lib/data/admin-auth"
import { Button } from "@modules/common/components/ui"
import { useActionState } from "react"

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, {})

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <label className="grid gap-1 text-sm">
        Admin password
        <input
          name="password"
          type="password"
          required
          className="checkout-input"
        />
      </label>
      <Button type="submit" isLoading={pending}>
        Login
      </Button>
    </form>
  )
}
