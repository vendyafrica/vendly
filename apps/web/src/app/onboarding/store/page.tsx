import { Button } from "@vendly/ui/components/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@vendly/ui/components/field"
import { Input } from "@vendly/ui/components/input"
import { Textarea } from "@vendly/ui/components/textarea"

export default function StoreInfo() {
    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
            <form className="space-y-6 rounded-md p-8 shadow-md">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">
                        Tell us about your store
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        This helps us personalize your storefront
                    </p>
                </div>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="storeName">
                            Store name
                        </FieldLabel>
                        <Input
                            id="storeName"
                            type="text"
                            placeholder="Acme"
                            required
                            className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="storeDescription">
                            Store description
                        </FieldLabel>
                        <Textarea
                            id="storeDescription"
                            placeholder="What do you sell?"
                            rows={2}
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
