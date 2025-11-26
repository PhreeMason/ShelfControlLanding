import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ShelfControl - stop forgetting which arcs are due",
  description: "Stop forgetting which ARCs are due. See all your review copies in one place with days left and pages per day at your comfortable pace.",
  keywords: "ARC, advance reader copy, NetGalley, arc due dates, forgetting arcs, ADHD reading, arc organizer, multiple arcs, ebook arc, audio arc, book reviewer, pages per day, arc calendar, overwhelmed by arcs",
  icons: {
    icon: "/assets/transparent-logo.png",
    apple: "/assets/transparent-logo.png",
  },
  openGraph: {
    title: "ShelfControl - stop forgetting which arcs are due",
    description: "Finally see all your ARCs in one place. Know which ones are due, how many pages per day you need, and what you can finish at your comfortable pace.",
    url: defaultUrl,
    siteName: "ShelfControl",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/dashboard-1.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShelfControl - stop forgetting which arcs are due",
    description: "Finally see all your ARCs in one place. Know which ones are due, how many pages per day you need, and what you can finish at your comfortable pace.",
    images: ["/assets/dashboard-1.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
