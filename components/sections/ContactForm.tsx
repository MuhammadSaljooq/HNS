"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

type Fields = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const budgets = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
];

const empty: Fields = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: "",
};

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Name is required";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Enter a valid email";
  if (!f.budget) e.budget = "Select a budget range";
  if (f.message.trim().length < 10) e.message = "Tell us a little more";
  return e;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");
  const successRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof Fields) => (value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  useIsomorphicLayoutEffect(() => {
    if (status !== "success") return;
    const el = successRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.from(el, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" });
  }, [status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors({ message: "Something went wrong. Please try again." });
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} className="flex flex-col gap-4">
        <span className="text-accent">✦ Message sent</span>
        <h3 className="font-display text-3xl tracking-tight">
          Thanks — we&apos;ll be in touch.
        </h3>
        <p className="max-w-md text-muted-dark">
          We read every message and reply within one business day. In the
          meantime, your follow-up is safe with us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <Field
        label="Name"
        value={fields.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="name"
      />
      <Field
        label="Email"
        type="email"
        value={fields.email}
        onChange={set("email")}
        error={errors.email}
        autoComplete="email"
      />
      <Field
        label="Company"
        value={fields.company}
        onChange={set("company")}
        error={errors.company}
        autoComplete="organization"
      />

      <SelectField
        label="Budget range"
        value={fields.budget}
        onChange={set("budget")}
        error={errors.budget}
        options={budgets}
      />

      <Field
        label="Message"
        value={fields.message}
        onChange={set("message")}
        error={errors.message}
        multiline
      />

      {/* aria-live region for the top-level error, if any */}
      <div aria-live="polite" className="sr-only">
        {Object.values(errors).filter(Boolean).join(". ")}
      </div>

      <button
        type="submit"
        disabled={status === "pending"}
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-accent px-8 text-xs font-medium uppercase tracking-[0.15em] text-ink transition-colors disabled:opacity-60"
      >
        {status === "pending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function baseInput(hasError?: boolean) {
  return cn(
    "peer w-full border-b bg-transparent py-3 text-base outline-none transition-colors placeholder-transparent",
    hasError ? "border-red-400" : "border-white/20 focus:border-accent",
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={baseInput(!!error)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={baseInput(!!error)}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-3 text-base text-paper/45 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: string[];
}) {
  const id = "budget";
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-xs uppercase tracking-[0.15em] text-paper/45"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full border-b bg-transparent py-3 text-base outline-none transition-colors [&>option]:bg-ink-soft",
          error ? "border-red-400" : "border-white/20 focus:border-accent",
        )}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
