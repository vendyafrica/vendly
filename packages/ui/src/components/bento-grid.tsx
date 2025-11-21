import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  tag?: string;
  mediaClassName?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-min grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  tag,
  mediaClassName,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col overflow-hidden rounded-[10px] p-5 sm:p-8",
      "bg-gray-80 border border-gray-100 shadow-sm",
      "dark:bg-neutral-900 dark:border-neutral-800",
      className
    )}
    {...props}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-purple-500 dark:text-gray-400" />
        {/* <span className="text-xs font-medium text-purple-500 dark:text-gray-400">
          {tag}
        </span> */}
      </div>
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 leading-tight">
          {name}
        </h3>
        <p className="text-[14px] text-black-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className={cn(
          "relative flex-1 rounded-[10px]",
          // "bg-purple-50 dark:bg-neutral-800/50",
          "overflow-hidden flex items-center justify-center",
          "min-h-[200px] sm:min-h-[240px]",
          mediaClassName
        )}
      >
        {background}
      </div>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
