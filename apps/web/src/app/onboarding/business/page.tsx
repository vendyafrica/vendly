import {
    Field,
    FieldGroup,
} from "@vendly/ui/components/field"
import CategoriesSelector from "../components/categories"

export default function BusinessInfo() {
    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
            <FieldGroup>
                <Field>
                    <CategoriesSelector />
                </Field>
            </FieldGroup>
        </div>
    )
}
