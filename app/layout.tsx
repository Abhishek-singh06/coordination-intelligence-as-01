import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEC Coordination Intelligence System â€” AS-01",
  description: "Advanced AEC Coordination Command Center & Graph-based Blast Radius Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-aec-bg text-slate-100 min-h-screen antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
