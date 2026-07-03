import AdminLoginForm from "./form"

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-md border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
        <p className="mb-2 text-xs font-semibold uppercase text-brand-600">
          VectraCompute Admin
        </p>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage AI hardware products, pricing, images, and customer orders.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  )
}
