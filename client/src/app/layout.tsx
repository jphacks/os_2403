import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Toaster } from "@/components/ui/sonner";
import { BackGroundColor } from "@/features/account/components/Background";

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
      <body className="min-h-screen">
        <BackGroundColor>
          <Menubar />
          <main className="flex-grow">{children}</main>
          <Toaster />
        </BackGroundColor>
      </body>
    </html>
  );
}
