import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

export interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showValidation?: boolean;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, showValidation = false, value, ...props }, ref) => {
    const isValid = value && value.toString().length > 0;

    return (
      <div className="relative">
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        {showValidation && isValid && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
        )}
      </div>
    );
  }
);
ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };
