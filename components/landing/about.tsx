import { Heart, Target, Shield } from "lucide-react";

export function About() {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          built by readers, for readers
        </h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-violet-700" />
              <h3 className="text-xl font-semibold text-slate-900">
                Creator Story
              </h3>
            </div>
            <p className="text-slate-600">
              Created by @instabookology after recognizing the widespread struggle
              with ARC deadline management among book reviewers.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-violet-700" />
              <h3 className="text-xl font-semibold text-slate-900">
                Our Approach
              </h3>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-violet-700 mt-1">•</span>
                <span>Research shows most readers struggle with deadline planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-700 mt-1">•</span>
                <span>Designed for the reality of reviewer overwhelm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-700 mt-1">•</span>
                <span>Built with book reviewer needs in mind</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-violet-700" />
              <h3 className="text-xl font-semibold text-slate-900">
                Our Promise
              </h3>
            </div>
            <p className="text-slate-600">
              No shame. No judgment. Just reality checks that help you be the
              reviewer you want to be.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
