import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/layout/Preloader";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollRefresh } from "@/components/layout/ScrollRefresh";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = `https://${site.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.fullName} (${site.name}) — ${site.tagline}`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: [
    "automated reminders",
    "AI reminder agent",
    "CRM software",
    "follow-up automation",
    "scheduling automation",
    site.product,
    site.fullName,
  ],
  authors: [{ name: site.fullName, url: siteUrl }],
  creator: site.fullName,
  publisher: site.fullName,
  category: "technology",
  // No `alternates.canonical` here: it would be inherited by every page and
  // point them all at the home page. Each page sets its own via pageMetadata.
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.fullName,
    title: `${site.fullName} (${site.name}) — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} (${site.name}) — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

// JSON-LD: Organization + WebSite + SoftwareApplication (Autopilot).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: site.fullName,
      alternateName: site.name,
      url: siteUrl,
      email: site.email,
      description: site.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.fullName,
      publisher: { "@id": `${siteUrl}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      name: site.product,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI automation agent for scheduled and automated reminders, with a built-in CRM.",
      publisher: { "@id": `${siteUrl}/#org` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Preloader />
          <Nav />
          <ScrollProgress />
          <ScrollRefresh />
          {/* Opaque, higher-z main so the footer is revealed from underneath. */}
          <main className="relative z-10 bg-ink">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
