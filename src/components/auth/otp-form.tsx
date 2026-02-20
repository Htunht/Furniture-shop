import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect } from "react";
import { emailOtp } from "@/lib/auth-client";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const searchParams = useSearchParams();
  const email = searchParams[0].get("email") || "";
  const [value, setValue] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  // Redirect to signup if email is not present
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    // Verify OTP
    try {
      await emailOtp.verifyEmail({ email, otp: value });
      navigate("/login");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setPending(false);
    }
    //console.log(email, value);
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your phone.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="otp-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                pattern={REGEXP_ONLY_DIGITS}
                required
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your phone.
              </FieldDescription>
            </Field>
            <Button
              type="submit"
              form="otp-form"
              disabled={pending}
              className="w-full"
            >
              {pending ? "Ah Wine Lal te" : "Verify"}
              Code
            </Button>
            {error && (
              <p className="mt-2 text-sm text-destructive text-center">
                {error}
              </p>
            )}
            <FieldDescription className="text-center">
              Didn&apos;t receive the code? <Link to="#">Resend</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
