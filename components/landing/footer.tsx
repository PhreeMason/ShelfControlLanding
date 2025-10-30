import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 bg-pink-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">ShelfControl</h3>
          <div className="flex gap-6 text-sm">
            <a
              href="mailto:contact@shelfcontrolapp.com"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
            <a
              href="https://instagram.com/instabookology"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              @instabookology
            </a>
            <Link
              href="/terms"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm text-slate-600 text-center">
            © 2025 ShelfControl. Built with love by @instabookology.
          </p>
        </div>
      </div>
    </footer>
  );
}
