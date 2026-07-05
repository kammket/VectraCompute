"use client"

import dynamic from "next/dynamic"

// The configurator is a large interactive component below the fold on the home
// page. Defer its JS so it doesn't weigh down initial load; it hydrates once
// the browser is idle. The /configure page still imports the component directly
// (server-rendered) since it's that page's primary content.
const WorkloadConfigurator = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => (
    <section className="bg-grey-5 border-y border-ui-border-base">
      <div className="content-container py-8 small:py-14">
        <div className="h-64 animate-pulse rounded-md bg-grey-10" />
      </div>
    </section>
  ),
})

export default function LazyWorkloadConfigurator() {
  return <WorkloadConfigurator />
}
