"use server"

import {
  listSimpleOrders,
  retrieveOrder as retrieveSimpleOrder,
} from "@lib/data/simple-orders"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string) => {
  return retrieveSimpleOrder(id)
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  _filters?: Record<string, unknown>
) => {
  const orders = await listSimpleOrders()
  return orders.slice(offset, offset + limit)
}

export const createTransferRequest = async (
  _state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string
  const order = id ? await retrieveSimpleOrder(id) : null
  return order
    ? { success: true, error: null, order }
    : { success: false, error: "Order not found", order: null }
}

export const acceptTransferRequest = async (id: string, _token: string) => {
  const order = await retrieveSimpleOrder(id)
  return order
    ? { success: true, error: null, order }
    : { success: false, error: "Order not found" }
}

export const declineTransferRequest = async (id: string, _token: string) => {
  const order = await retrieveSimpleOrder(id)
  return order
    ? { success: true, error: null, order }
    : { success: false, error: "Order not found" }
}
