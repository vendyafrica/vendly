import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type CategoryHeaderProps = {
  title: string;
  slug: string;
};

export default function CategoryHeader({ title, slug }: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Link
        href={`/categories/${slug}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        See more
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
