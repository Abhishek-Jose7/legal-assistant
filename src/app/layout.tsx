import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css"; // Assuming this exists
import Script from "next/script";
import ErrorReporter from "@/components/ErrorReporter";
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";

export const metadata: Metadata = {
  title: "NyaayaAi - AI Legal Assistant",
  description: "Your AI-powered legal assistant for Indian Law.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-sans">
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "NyaayaAi", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
          <VisualEditsMessenger />
        </body>
      </html>
    </ClerkProvider>
  );
}