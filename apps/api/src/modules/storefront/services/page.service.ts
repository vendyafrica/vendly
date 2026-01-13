import { pageRepository, type PageRepository } from "../repositories/page.repository";

export class PageService {
    constructor(private pageRepo: PageRepository = pageRepository) { }

    async getPages(storeId: string) {
        return this.pageRepo.findAllByStoreId(storeId);
    }

    async getPage(storeId: string, slug: string) {
        return this.pageRepo.findBySlug(storeId, slug);
    }

    async createPage(input: {
        tenantId: string;
        storeId: string;
        title: string;
        slug: string;
        type?: string;
    }) {
        const existing = await this.pageRepo.findBySlug(input.storeId, input.slug);
        if (existing) {
            throw new Error(`Page with slug '${input.slug}' already exists`);
        }

        return this.pageRepo.create({
            tenantId: input.tenantId,
            storeId: input.storeId,
            title: input.title,
            slug: input.slug,
            type: input.type || "custom",
            puckData: { content: [], root: { props: {} }, zones: {} },
        });
    }

    async updatePageContent(id: string, puckData: any) {
        return this.pageRepo.update(id, { puckData });
    }

    async publishPage(id: string) {
        const page = await this.pageRepo.findById(id);
        if (!page) throw new Error("Page not found");

        return this.pageRepo.publish(id, page.puckData);
    }
}

export const pageService = new PageService();
