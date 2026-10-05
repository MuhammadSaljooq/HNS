import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Below-the-fold sections are code-split out of the initial bundle (still SSR'd).
const LogoMarquee = dynamic(() =>
  import("@/components/sections/LogoMarquee").then((m) => m.LogoMarquee),
);
const MethodIntro = dynamic(() =>
  import("@/components/sections/MethodIntro").then((m) => m.MethodIntro),
);
const MethodHorizontal = dynamic(() =>
  import("@/components/sections/MethodHorizontal").then(
    (m) => m.MethodHorizontal,
  ),
);
const ServicesGrid = dynamic(() =>
  import("@/components/sections/ServicesGrid").then((m) => m.ServicesGrid),
);
const TextTicker = dynamic(() =>
  import("@/components/sections/TextTicker").then((m) => m.TextTicker),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/Testimonials").then((m) => m.Testimonials),
);
const Industries = dynamic(() =>
  import("@/components/sections/Industries").then((m) => m.Industries),
);
const CTA = dynamic(() =>
  import("@/components/sections/CTA").then((m) => m.CTA),
);

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <MethodIntro />
      <MethodHorizontal />
      <ServicesGrid />
      <TextTicker />
      <Testimonials />
      <Industries />
      <CTA />
    </>
  );
}
