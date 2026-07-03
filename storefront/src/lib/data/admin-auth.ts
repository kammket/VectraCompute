"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_COOKIE = "vectra_admin"

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  const expected = process.env.ADMIN_PASSWORD
  return Boolean(expected && token === expected)
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }
}

export async function loginAdmin(
  _state: { error?: string } | undefined,
  formData: FormData
) {
  const password = String(formData.get("password") ?? "")
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return { error: "Set ADMIN_PASSWORD in production environment variables." }
  }

  if (password !== expected) {
    return { error: "Invalid admin password." }
  }

  ;(await cookies()).set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  redirect("/admin")
}

export async function logoutAdmin() {
  ;(await cookies()).delete(ADMIN_COOKIE)
  redirect("/admin/login")
}
