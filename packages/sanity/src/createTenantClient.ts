import { getClient } from './client'

export function createTenantClient(storeId: string) {
    const baseClient = getClient()

    return {
        ...baseClient,
        // Fetch documents filtered by storeId
        fetchForTenant: <T>(query: string, params?: Record<string, any>) =>
            baseClient.fetch<T>(query, { ...params, storeId }),
    }
}
