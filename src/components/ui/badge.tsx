import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80": variant === "default",
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80": variant === "secondary",
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600": variant === "destructive",
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400": variant === "success",
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400": variant === "warning",
          "text-foreground border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
