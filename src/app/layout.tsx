import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { ReactQueryProvider } from "./query-provider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <ReactQueryProvider>
          <body className={inter.className + " "}>
            <div
              className="fixed top-0 left-0 h-full w-1/2 bg-white"
              aria-hidden="true"
            />
            <div
              className="fixed top-0 right-0 h-full w-1/2 bg-gray-50"
              aria-hidden="true"
            />
            <div className="relative flex flex-col">
              <Header />
              {children}
            </div>
          </body>
        </ReactQueryProvider>
      </UserProvider>
    </html>
  );
}
