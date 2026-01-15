export interface OnboardingInput {
    fullName: string;
    email: string;
    phoneNumber: string;
    businessInfo: {
        location: string;
        categories: string[];
        mode: string;
    }
    storeInfo: {
        name: string;
        slug: string;
    }
}