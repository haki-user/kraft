import { Separator } from "@kraft/ui";
import { ThemeProvider } from "@kraft/ui";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/toaster";
import AuthProvider from "@/components/auth-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="w-full h-screen overflow-hidden" lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <AuthProvider>
            {/* <nav className="flex justify-start bg-slate-900 color-white">
            <div>Home</div>
            <div>Contest</div>
            <div>Problems</div>
          </nav> */}
            <Toaster />
            <Navbar />
            <Separator />
            <main>{children}</main>
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
