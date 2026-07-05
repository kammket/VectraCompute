// Horizontal, scrollable strip of component regulatory markings shown on the
// About and Trust pages. Deliberately limited to markings that genuinely apply
// to the hardware we ship (carried by the components from their original
// manufacturers): CE, FCC, RoHS, WEEE. Certification-body badges (ISO, UL,
// TUV, FDA) are intentionally NOT shown unless the company actually holds the
// certification — an unverifiable badge destroys more trust than it builds.

const MARKS: { key: string; label: string; description: string; art: React.ReactNode }[] = [
  {
    key: "ce",
    label: "CE",
    description: "EU conformity marking carried by system components",
    art: (
      <span
        aria-hidden
        className="text-4xl font-semibold tracking-[0.18em] text-grey-70"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        CE
      </span>
    ),
  },
  {
    key: "fcc",
    label: "FCC",
    description: "US electromagnetic compliance marking on components",
    art: (
      <span
        aria-hidden
        className="text-4xl font-bold tracking-tight text-grey-70"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        FCC
      </span>
    ),
  },
  {
    key: "rohs",
    label: "RoHS",
    description: "Restriction of hazardous substances compliance",
    art: (
      <span aria-hidden className="flex items-center gap-1.5 text-grey-70">
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M7 12.5l3.2 3.2L17 8.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="leading-none text-left">
          <span className="block text-xl font-bold">RoHS</span>
          <span className="block text-[10px] uppercase tracking-wide">
            compliant
          </span>
        </span>
      </span>
    ),
  },
  {
    key: "weee",
    label: "WEEE",
    description: "Separate-collection marking for electronics recycling",
    art: (
      <svg viewBox="0 0 24 28" className="h-9 w-8 text-grey-70" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 8h12l-1.4 13H7.4L6 8z" />
          <path d="M4 8h16" strokeLinecap="round" />
          <path d="M10 8V6h4v2" />
          <path d="M9.5 11v7M12 11v7M14.5 11v7" strokeWidth="1.2" />
        </g>
        <path d="M2 26h20" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 2l18 22" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
]

const ComplianceMarks = () => {
  return (
    <section className="border-t border-ui-border-base py-6 small:py-10">
      <p className="text-small-semi uppercase tracking-wide text-brand-700">
        Standards &amp; compliance
      </p>
      <h2 className="mt-1 text-xl font-semibold text-ui-fg-base">
        Component regulatory markings
      </h2>
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
        {MARKS.map((mark) => (
          <div
            key={mark.key}
            className="flex min-w-[210px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-md border border-ui-border-base bg-white px-6 py-6 text-center"
            role="img"
            aria-label={`${mark.label}: ${mark.description}`}
          >
            <span className="flex h-12 items-center">{mark.art}</span>
            <span className="text-xs leading-5 text-ui-fg-subtle">
              {mark.description}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 max-w-3xl text-xs leading-5 text-ui-fg-muted">
        Our systems are assembled from components — GPUs, power supplies,
        mainboards, and chassis — that carry these regulatory markings from
        their original manufacturers. Marking documentation for specific
        components is available on request with your quote or order.
      </p>
    </section>
  )
}

export default ComplianceMarks
