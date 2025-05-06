import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[#DFE1E6] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#172B4D] dark:text-gray-200 px-3 py-2 text-sm placeholder:text-[#7A869A] dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 