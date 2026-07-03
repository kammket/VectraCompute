import { getBaseURL } from "@lib/util/env"
import {
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  JsonLd,
} from "@lib/util/json-ld"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "VectraCompute | AI Workstations & GPU Servers",
    template: "%s",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
