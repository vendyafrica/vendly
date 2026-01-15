import Link from "next/link";

export interface FooterData {
    storeName?: string;
    linkColumns?: Array<{
        _key: string;
        title: string;
        links: Array<{ _key: string; label: string; url: string }>;
    }>;
    copyrightText?: string;
}

export default function Footer({ data }: { data: FooterData }) {
    if (!data) return null;

    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Store Info */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-bold mb-4">{data.storeName}</h3>
                    </div>

                    {/* Link Columns */}
                    {data.linkColumns?.map((column) => (
                        <div key={column._key}>
                            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-900">
                                {column.title}
                            </h4>
                            <ul className="space-y-3">
                                {column.links?.map((link) => (
                                    <li key={link._key}>
                                        <Link
                                            href={link.url}
                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p>{data.copyrightText || `© ${new Date().getFullYear()} ${data.storeName}. All rights reserved.`}</p>
                </div>
            </div>
        </footer>
    );
}
