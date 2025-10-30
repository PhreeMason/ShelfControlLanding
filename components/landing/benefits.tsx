import { CheckCircle2, Calendar, Users } from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      icon: CheckCircle2,
      title: "Know what's actually possible",
      description:
        "See instantly which books you can finish at your reading speed. No math required.",
    },
    {
      icon: Calendar,
      title: "Should I accept this ARC?",
      description:
        "Clear yes/no guidance before you download. Based on your actual capacity.",
    },
    {
      icon: Users,
      title: "Maintain publisher relationships",
      description: "Know when to email teams proactively.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          reality checks, not more tracking
        </h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-violet-700 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
