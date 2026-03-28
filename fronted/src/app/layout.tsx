import type { Metadata } from "next";
import { Passion_One, Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { openSauce } from "./font";
import Footer from "@/component/Footer";
import { TRPCProvider, TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Head from "next/head";
import Script from "next/script";

const passionOne = Passion_One({
  variable: "--font-passion-one",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vicky Akku",
  description: "Vicky Akku",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${passionOne.variable} ${inter.className} ${openSauce.variable} ${openSans.variable} antialiased`}
      >
      <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <Head>
        <link
          rel="preload"
          as="image"
          href="/image/hero_background.png"
        />
      </Head>
        <TRPCReactProvider>
          <Toaster />
          <main className="min-h-screen">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
