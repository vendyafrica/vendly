import BusinessForm from "./business-form";
import { getCategoriesAction } from "../lib/categories";
import { type Category } from "../components/tag-selector";

export default async function BusinessPage() {
    const res = await getCategoriesAction();

    const initialCategories: Category[] = res.success && res.data
        ? res.data.map((c) => ({ id: c.slug, label: c.name }))
        : [];

    return <BusinessForm initialCategories={initialCategories} />;
}
