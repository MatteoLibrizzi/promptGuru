import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import { ReactQueryProvider } from "@/app/query-provider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { classNames } from "./utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pronto Prompt",
  description: "Create and Use Prompts on Demand",
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
              <a
                href="mailto:librizzimatteo.ml@gmail.com"
                className="fixed inline-flex items-center gap-2 right-0 bottom-0 mb-10 mr-10 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Feedback
                <EnvelopeIcon
                  className={classNames("h-6 w-6 transform")}
                  aria-hidden="true"
                />
              </a>
            </div>
          </body>
        </ReactQueryProvider>
      </UserProvider>
    </html>
  );
}
