import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Per-page metadata. Next merges metadata shallowly, so a page that sets
 * `openGraph` or `alternates` replaces the layout's version entirely — this
 * builds the full set (canonical, Open Graph, Twitter) for one path.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} · ${site.fullName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.fullName,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
