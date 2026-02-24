import { AppShell } from "@/components/shared/app-shell";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
