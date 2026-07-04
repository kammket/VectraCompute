const Star = ({ fill }: { fill: number }) => {
  const id = `star-${Math.random().toString(36).slice(2, 8)}`
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${Math.round(fill * 100)}%`} stopColor="#f59e0b" />
          <stop offset={`${Math.round(fill * 100)}%`} stopColor="#d1d5db" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
      />
    </svg>
  )
}

// Renders a 0–5 rating as stars with partial fill. Pure display — the numbers
// always come from stored, moderated reviews.
const ReviewStars = ({
  rating,
  label,
}: {
  rating: number
  label?: string
}) => {
  const clamped = Math.max(0, Math.min(5, rating))
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `${clamped.toFixed(1)} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <Star key={index} fill={Math.max(0, Math.min(1, clamped - index))} />
      ))}
    </span>
  )
}

export default ReviewStars
