import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit min-w-0 whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none outline-none transition-[color,box-shadow] overflow-hidden data-[single-digit]:size-5 data-[single-digit]:min-w-5 data-[single-digit]:p-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
      size: {
        default: "",
        lg: "h-[26px] min-h-[26px] text-sm px-3 py-1 gap-2 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function isSingleDigitContent(children: React.ReactNode): boolean {
  if (typeof children === "number") return children >= 1 && children <= 9
  if (typeof children === "string") return /^[1-9]$/.test(children.trim())
  return false
}

function isZeroContent(children: React.ReactNode): boolean {
  if (typeof children === "number") return children === 0
  if (typeof children === "string") return children.trim() === "0"
  return false
}

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  if (!asChild && isZeroContent(children)) return null

  const Comp = asChild ? Slot.Root : "span"
  const singleDigit = !asChild && isSingleDigitContent(children)

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-single-digit={singleDigit || undefined}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
