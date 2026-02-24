"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Enter your password")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

const LOGIN_PATH = "/login";

export function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: SignUpValues) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setError("root", { message: error.message });
      return;
    }

    if (data.user?.identities?.length === 0) {
      toast.error("An account with this email already exists.");
      setError("email", { message: "An account with this email already exists." });
      return;
    }

    toast.success("Account created. Please check your email to confirm.");
    router.push(LOGIN_PATH);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6 py-16">
      <Card className="auth-card-signup flex shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card py-0 shadow-md">
        {/* Header: фон и лого из макета — как в sign-in-form (CONSISTENCY) */}
        <div className="relative flex h-52 flex-col justify-end overflow-hidden pb-6 pt-8">
          <img
            src="/assets/bg.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <img
              src="/assets/logo.svg"
              alt="PWS"
              className="h-8 w-auto"
            />
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold leading-tight text-foreground">
                Sign Up
              </h1>
              <p className="text-sm font-normal text-muted-foreground">
                Please enter your details to sign in
              </p>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-col gap-6 px-6 pb-8 pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex w-full flex-col gap-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="············"
                autoComplete="new-password"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password*
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="············"
                autoComplete="new-password"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value === true}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    className="size-5 rounded border border-input bg-background"
                  />
                )}
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer text-sm font-medium text-foreground"
              >
                I agree to{" "}
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  privacy policy & terms
                </Link>
              </Label>
            </div>
            {errors.terms && (
              <p role="alert" className="text-sm text-destructive">
                {errors.terms.message}
              </p>
            )}

            {errors.root && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground">
            Already have an account?{" "}
            <Link
              href={LOGIN_PATH}
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
