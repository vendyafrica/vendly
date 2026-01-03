import type { ReactNode } from "react";

import { Card, CardContent } from "@vendly/ui/components/card";

export default function OnboardingShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <Card className="w-full">
          <CardContent className="p-6 md:p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {description ? (
                <p className="text-muted-foreground text-sm text-balance">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="mt-8">{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
