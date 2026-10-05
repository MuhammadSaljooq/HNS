import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  company: z.string().max(160).optional().or(z.literal("")),
  budget: z.string().min(1, "Select a budget range"),
  message: z.string().min(10, "Tell us a little more").max(4000),
});

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // TODO: wire a real email/CRM provider here (e.g. Resend, Postmark, or push
  // straight into NHS Autopilot). For now we just log and acknowledge.
  console.log("[contact] new enquiry:", parsed.data);

  return NextResponse.json({ ok: true }, { status: 200 });
}
