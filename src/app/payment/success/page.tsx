import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[70vh] bg-stone-50 px-5 py-16 dark:bg-stone-950 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-900 dark:bg-stone-900 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700 dark:text-green-400">
          Checkout complete
        </p>
        <h1 className="mt-3 text-3xl font-bold text-stone-900 dark:text-white">
          Thanks for your payment
        </h1>
        <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
          Stripe is confirming the payment. Check your appointment dashboard in
          a moment to see the updated payment status.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex rounded-lg bg-[#647548] px-5 py-3 font-semibold text-white transition hover:bg-[#53643b]"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
