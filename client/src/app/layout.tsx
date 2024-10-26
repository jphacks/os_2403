import type { Metadata } from "next";
import { Menubar } from "../feature/menubar"
import localFont from "next/font/local";
import "@/styles/globals.scss";


export const metadata: Metadata = {
  title: "HubMe",
  description: "HubMe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Menubar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}