export interface TenantData {
  name: string;
  slug: string;
  phoneNumber: string;
  billingEmail: string;
  status: "active";
  plan: "free";
}

export interface StoreData {
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  status: "active";
  defaultCurrency: "KES";
}
