"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Введите email")
    .email("Введите корректный email"),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(6, "Пароль не менее 6 символов"),
  remember: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

const DASHBOARD_PATH = "/competitions";
const ADMIN_PATH = "/admin";

export function SignInForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: SignInValues) {
    setServerError(null);
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    const userId = authData.user?.id;
    const { data: profileData } = userId
      ? await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single()
      : { data: null };

    const path =
      profileData?.role === "admin" ? ADMIN_PATH : DASHBOARD_PATH;
    router.push(path);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6 py-16">
      <Card className="auth-card-login flex shrink-0 flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card py-0 shadow-md">
        {/* Header: фон из макета (ASSETS .cursorrules) */}
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
                С возвращением
              </h1>
              <p className="text-sm font-normal text-muted-foreground">
                Введите данные для входа
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
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Введите email"
                autoComplete="email"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Пароль*
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      className="size-5 rounded border border-input bg-background"
                    />
                  )}
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-medium text-foreground"
                >
                  Запомнить меня
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Забыли пароль?
              </Link>
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Вход…" : "Войти"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground">
            Впервые у нас?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Создать аккаунт
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
