const highlights = [
  {
    title: "Haircut & Styling",
    description:
      "Explore haircut and styling options to find the service that suits you.",
  },
  {
    title: "Beard Grooming",
    description:
      "Browse beard grooming services and choose the style you want.",
  },
  {
    title: "Easy Appointment Requests",
    description:
      "Compare available services and prepare your appointment request in one place.",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="salonbook-highlights-title"
      className="bg-stone-50 px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            The SalonBook experience
          </p>

          <h2
            id="salonbook-highlights-title"
            className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          >
            Grooming Made Simple
          </h2>

          <p className="mt-4 leading-7 text-stone-600">
            Find grooming services and plan your next appointment with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div
                aria-hidden="true"
                className="mb-5 h-1 w-12 rounded-full bg-orange-700"
              />

              <h3 className="text-lg font-semibold text-stone-900">
                {highlight.title}
              </h3>

              <p className="mt-3 leading-7 text-stone-600">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
