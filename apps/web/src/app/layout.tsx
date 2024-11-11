import { ThemeProvider, Separator } from "@kraft/ui";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/toaster";

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
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          {/* <nav className="flex justify-start bg-slate-900 color-white">
            <div>Home</div>
            <div>Contest</div>
            <div>Problems</div>
          </nav> */}
          <Navbar />
          <Separator />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
