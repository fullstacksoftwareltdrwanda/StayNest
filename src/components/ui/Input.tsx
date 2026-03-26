import * as React from "react"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[var(--primary)]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex w-full rounded-2xl border-none bg-[var(--warm-gray)] px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all disabled:opacity-50",
              Icon && "pl-11",
              error && "ring-2 ring-red-300",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
