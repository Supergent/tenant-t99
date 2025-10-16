import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn76g7re6eaetkbr28pxzdp73x7sk4zg/components";

export const metadata: Metadata = {
  title: "Todo List - Manage Your Tasks",
  description: "A minimal, elegant todo list application with AI assistant powered by Convex",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
