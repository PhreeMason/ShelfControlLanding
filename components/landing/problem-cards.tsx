export function ProblemCards() {
  const problems = [
    {
      title: "too far gone",
      description:
        "You checked the calendar. Downloaded anyway. Now drowning in ARCs with no clear path forward.",
    },
    {
      title: "deadline anxiety",
      description:
        "Every NetGalley approval feels like a commitment you might not keep. Your ratio haunts you.",
    },
    {
      title: "professional worry",
      description:
        "Publishers and authors deserve better. You want to maintain relationships but keep missing deadlines.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          sound familiar?
        </h2>
        <div className="grid gap-6 md:grid-cols-3 mt-12 max-w-6xl mx-auto">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-slate-600">{problem.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center italic text-slate-500 mt-8">
          You&apos;re not alone. This is what we hear from book reviewers everywhere.
        </p>
      </div>
    </section>
  );
}
