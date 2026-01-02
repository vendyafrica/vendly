import { CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card"

interface StepHeaderProps {
  title: string
  description: string
  stepNumber: number
  totalSteps: number
}

export function StepHeader({ title, description, stepNumber, totalSteps }: StepHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{title}</span>
        <span className="text-sm font-normal text-muted-foreground tabular-nums">
          {stepNumber}/{totalSteps}
        </span>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  )
}