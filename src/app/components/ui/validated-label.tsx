import * as React from "react";
import { cn } from "./utils";

export interface ValidatedLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  isFilled?: boolean;
}

const ValidatedLabel = React.forwardRef<HTMLLabelElement, ValidatedLabelProps>(
  ({ className, required, isFilled, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && !isFilled && (
          <span className="text-red-600 ml-1">*</span>
        )}
      </label>
    );
  }
);
ValidatedLabel.displayName = "ValidatedLabel";

export { ValidatedLabel };
