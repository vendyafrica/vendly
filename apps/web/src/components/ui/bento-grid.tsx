import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  mediaClassName?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        // 12-col grid on lg for precise card spans; 6-col on small screens
        "grid w-full auto-rows-auto grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-8",
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
  mediaClassName,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl p-8",
      // light styles
      "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300",
      // dark styles
      "dark:bg-background dark:border-gray-800 transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    <div className="relative z-10">
      <div className="flex transform-gpu flex-col gap-2 mb-6">
        <Icon className="h-8 w-8 origin-left transform-gpu text-gray-800" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-xl text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "relative h-56 rounded-xl bg-gray-50 ring-1 ring-gray-200 overflow-hidden flex items-center justify-center",
          mediaClassName
        )}
      >
        {background}
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu bg-[radial-gradient(120%_120%_at_0%_0%,#0000000d_0%,transparent_50%)] transition-opacity duration-300 group-hover:opacity-100" />
  </div>
);

export { BentoCard, BentoGrid };
