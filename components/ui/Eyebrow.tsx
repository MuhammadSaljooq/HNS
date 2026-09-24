import { cn } from "@/lib/utils";

export type EyebrowProps = {
  children: string;
  /** Show the leading accent dot. */
  dot?: boolean;
  className?: string;
};

/** Bracketed, uppercase, letter-spaced section label: [ SECTION NAME ]. */
export function Eyebrow({ children, dot = true, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]",
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-accent"
        />
      )}
      <span>[ {children} ]</span>
    </span>
  );
}
