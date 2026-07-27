import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

    const variants = {
      primary: "bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/20",
      secondary: "bg-surface text-foreground border border-border hover:bg-muted",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
      ghost: "text-foreground hover:bg-surface",
      neon: "bg-neon/10 text-neon border border-neon/30 hover:bg-neon/20 shadow-lg shadow-neon/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-sm gap-2",
    };

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
