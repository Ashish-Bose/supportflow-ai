import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export const metadata = {
  title: "SupportFlow AI",
  description: "AI-powered SaaS support platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
  {children}

  <Toaster
    position="top-right"
    richColors
  />
</ThemeProvider>
      </body>
    </html>
  );
}