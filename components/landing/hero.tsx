import Image from "next/image";

export function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-violet-200 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              From drowning to breathing
            </h1>
            <p className="text-xl text-slate-600 max-w-xl">
              ShelfControl shows which ARCs you can actually finish on time
            </p>
            <div>
              <a
                href="#waitlist"
                className="inline-block px-8 py-4 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition-colors"
              >
                Join the Waitlist
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative z-30">
              <Image
                src="/screenshot.png"
                alt="ShelfControl app showing reading goals and active deadlines"
                width={400}
                height={800}
                className="drop-shadow-lg"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
