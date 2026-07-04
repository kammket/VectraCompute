import { redirect } from "next/navigation"

// The password-based customer account system was part of the retired Medusa
// backend; its sign-in form can no longer authenticate anyone. Until a real
// account system exists, every /account URL forwards to order tracking, which
// is the working "where is my stuff" feature (order # + checkout email).
export default async function AccountPageLayout({
  params,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  redirect(`/${countryCode}/order/status`)
}
