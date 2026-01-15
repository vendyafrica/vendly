

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        subdomain: string;
        productId: string;
    }>;
};

export default async function ProductPage({ params }: Props) {
    const { subdomain, productId } = await params;

    return (
       <h1>hello</h1>
    );
}
