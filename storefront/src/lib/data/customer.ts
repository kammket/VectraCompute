"use server"

import { HttpTypes } from "@medusajs/types"
import { redirect } from "next/navigation"

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    return null
  }

export const updateCustomer = async (_body: HttpTypes.StoreUpdateCustomer) => {
  return null
}

export async function signup(_currentState: unknown, _formData: FormData) {
  return "Customer accounts are disabled. Please checkout as a guest."
}

export async function login(_currentState: unknown, _formData: FormData) {
  return "Customer accounts are disabled. Please checkout as a guest."
}

export async function signout(countryCode: string) {
  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  return null
}

export const addCustomerAddress = async (): Promise<{
  success: boolean
  error: string | null
}> => {
  return { success: false, error: "Customer accounts are disabled." }
}

export const deleteCustomerAddress = async (): Promise<void> => {}

export const updateCustomerAddress = async (): Promise<{
  success: boolean
  error: string | null
}> => {
  return { success: false, error: "Customer accounts are disabled." }
}
