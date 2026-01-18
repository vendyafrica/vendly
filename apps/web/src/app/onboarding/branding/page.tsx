import { Button } from "@vendly/ui/components/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@vendly/ui/components/field"
import { Input } from "@vendly/ui/components/input"
import { Textarea } from "@vendly/ui/components/textarea"

export default function Branding() {
    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
            <form className="space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">
                        Let's get your brand right
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Choose a theme for your store
                    </p>
                </div>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="theme">
                            Theme
                        </FieldLabel>
                        <Input
                            id="theme"
                            type="text"
                            placeholder="Minimalistic"
                            readOnly
                            required
                            className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="logo">
                            Upload your logo
                        </FieldLabel>
                        <Input
                            id="logo"
                            type="file"
                            required
                            className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
                        />
                    </Field>
                </FieldGroup>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-muted hover:bg-red-400 hover:text-white border-0"
                    >
                        Back
                    </Button>

                    <Button type="submit" className="bg-primary hover:bg-primary/90 hover:text-white">
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    )
}
