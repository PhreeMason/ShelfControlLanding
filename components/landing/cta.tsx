export function CTA() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-pink-100 to-pink-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to stop drowning?
          </h2>
          <p className="text-xl text-slate-700">
            Take back control of your reading deadlines
          </p>
          <a
            href="#waitlist"
            className="inline-block px-8 py-4 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition-colors"
          >
            Join the Waitlist
          </a>
          <p className="text-sm text-slate-600">
            No spam. Just one email when we launch.
          </p>
        </div>
      </div>
    </section>
  );
}
