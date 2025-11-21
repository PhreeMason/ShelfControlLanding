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
  title: "ShelfControl - see which arcs you can finish on time",
  description: "ShelfControl - Know which ARCs you can actually finish on time.",
  keywords: "ARC, book reviews, NetGalley, reading due dates, book tracking, arc tracker, arc tracking, advance reader copy, arc reader, arc reviewer, book reviewer",
  icons: {
    icon: "/assets/transparent-logo.png",
    apple: "/assets/transparent-logo.png",
  },
  openGraph: {
    title: "ShelfControl - see which arcs you can finish on time",
    description: "Know which ARCs you can actually finish on time.",
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
    title: "ShelfControl - see which arcs you can finish on time",
    description: "Know which ARCs you can actually finish on time.",
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
