import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Loading from "./loading";
import Navbar from "./components/Navbar/Navbar";
import "./globals.css";
import ThemeContextProvider from "./context/ThemeContext";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordle",
  description: "Wordle game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{

  let loggedIn = cookies().has("paeruxToken");
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeContextProvider>
          <Navbar loggedIn={loggedIn} />
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
