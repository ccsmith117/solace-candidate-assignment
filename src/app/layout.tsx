import type { Metadata } from "next";
import { Lato, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const lato = Lato({ 
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato"
});
const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${dmSerifDisplay.variable} font-sans`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
