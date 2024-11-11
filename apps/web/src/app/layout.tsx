import { ThemeProvider } from "@kraft/ui";
import { Navbar } from "@/components/navbar";
import { Separator } from "@kraft/ui";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
