export function Steps() {
  const steps = [
    {
      number: "1",
      title: "Add your books",
      description: "Title, pages, deadline. That's it.",
    },
    {
      number: "2",
      title: "See your reality",
      description: "Books sort automatically by what's possible.",
    },
    {
      number: "3",
      title: "Update progress",
      description: "Quick daily check-ins recalculate everything.",
    },
    {
      number: "4",
      title: "Make confident decisions",
      description: "Clear guidance on new ARCs and priorities.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          simple by design
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-violet-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
