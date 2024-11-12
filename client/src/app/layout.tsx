import { Menubar } from "@/feature/menubar";
import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Toaster } from "@/components/ui/sonner";

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
        <main className="flex-grow">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
