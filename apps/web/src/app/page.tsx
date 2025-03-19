import type { Metadata, Viewport } from "next";
import { LandingPage } from "@/components";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kraft-eight.vercel.app"),
  title: {
    default: "Kraft - Modern Coding Assessment Platform",
    template: "%s | Kraft",
  },
  description:
    "Kraft is an enterprise-grade, open-source platform for conducting coding contests, technical assessments, and programming challenges with robust security and scalability.",
  keywords: [
    "Kraft",
    "coding platform",
    "technical assessment",
    "programming contests",
    "online judge",
    "coding challenges",
    "developer recruitment",
    "skill assessment",
    "programming exercises",
    "code evaluation",
    "coding contests",
  ],
  icons: [
    {
      url: "/code.png",
    },
    // {
    //   url: "favicon.ico",
    // },
  ],
  authors: [{ name: "haki-user", url: "https://github.com/haki-user" }],
  creator: "haki-user",
  openGraph: {
    type: "website",
    title: "Kraft - Modern Coding Assessment Platform",
    description:
      "Enterprise-grade platform for coding contests and assessments",
    siteName: "Kraft",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kraft",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "github:creator": "https://github.com/haki-user",
    "linkedin:creator": "https://www.linkedin.com/in/aditya-pratap-singh333",
  },
};

export default function Home(): JSX.Element {
  return (
    <div className="">
      <LandingPage />
    </div>
  );
}
