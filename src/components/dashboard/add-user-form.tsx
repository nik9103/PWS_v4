"use client";

import { useCallback, useState } from "react";
import { EyeIcon, EyeOffIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROLE_OPTIONS: { value: "judge" | "manager" | "athlete"; label: string }[] = [
  { value: "judge", label: "Судья" },
  { value: "manager", label: "Спортивный менеджер" },
  { value: "athlete", label: "Спортсмен" },
];

function generatePassword(length: number = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

type AddUserFormProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function AddUserForm({ onCancel, onSuccess }: AddUserFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"judge" | "manager" | "athlete">("athlete");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGeneratePassword = useCallback(() => {
    setPassword(generatePassword());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.();
  };

  return (
    <>
      <DialogHeader className="gap-1 text-left">
        <DialogTitle className="text-foreground text-lg font-semibold">
          Добавить пользователя
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm font-normal">
          Пользователь получает приглашение на указанный email. После авторизации он проходит
          полную процедуру регистрации
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-user-first-name" className="text-foreground font-normal">
              Имя
            </Label>
            <Input
              id="add-user-first-name"
              type="text"
              placeholder="Иван"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-md border-border bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-user-last-name" className="text-foreground font-normal">
              Фамилия
            </Label>
            <Input
              id="add-user-last-name"
              type="text"
              placeholder="Петров"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-md border-border bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-foreground font-normal">Роль</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger className="w-full rounded-md border-border bg-card">
                <SelectValue placeholder="Выбрать" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-user-email" className="text-foreground font-normal">
              Email
            </Label>
            <Input
              id="add-user-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border-border bg-card"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="add-user-password" className="text-foreground font-normal">
            Временный пароль
          </Label>
          <div className="relative">
            <Input
              id="add-user-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border-border bg-card pr-20"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={handleGeneratePassword}
                    aria-label="Сгенерировать пароль"
                  >
                    <RefreshCwIcon className="size-4" aria-hidden />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Сгенерировать пароль</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" aria-hidden />
                    ) : (
                      <EyeIcon className="size-4" aria-hidden />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? "Скрыть пароль" : "Показать пароль"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Пользователь сможет изменить пароль после первого входа
          </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Добавить</Button>
        </DialogFooter>
      </form>
    </>
  );
}
