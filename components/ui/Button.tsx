"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "link";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type LinkButton = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ClickButton = BaseProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export type ButtonProps = LinkButton | ClickButton;

const base =
  "group relative inline-flex items-center justify-center rounded-full uppercase text-xs tracking-[0.15em] transition-colors";

const sizing = "px-7 h-12";

const variants: Record<Variant, string> = {
  // Fill sweep from the bottom on hover; label inverts. Pure CSS.
  primary: cn(
    sizing,
    "overflow-hidden bg-accent text-ink font-medium",
    "before:absolute before:inset-0 before:origin-bottom before:scale-y-0",
    "before:bg-ink before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:before:scale-y-100 hover:text-paper",
  ),
  ghost: cn(
    sizing,
    "border border-white/20 text-[var(--fg)] hover:border-accent hover:text-accent",
  ),
  link: "text-[var(--fg)] underline underline-offset-4 decoration-1 hover:decoration-accent hover:underline-offset-8 transition-all",
};

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className } = props;
  const classes = cn(base, variants[variant], className);
  const label = <span className="relative z-10">{children}</span>;

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={classes}
    >
      {label}
    </button>
  );
}
