import { onboardingRepository } from "./onboarding-repository";
import {
    type OnboardingStep,
    type OnboardingData,
    type PersonalInfoDto,
    type StoreInfoDto,
    type BusinessInfoDto,
    type OnboardingStatusResponse,
    type StepSaveResponse,
    type OnboardingCompleteResponse,
    isValidPersonalInfo,
    isValidStoreInfo,
    isValidBusinessInfo,
} from "./onboarding-dto";

// =====================================
// Step Order Configuration
// =====================================

const STEP_ORDER: OnboardingStep[] = ["signup", "personal", "store", "business", "complete"];

function getNextStep(current: OnboardingStep): OnboardingStep {
    const idx = STEP_ORDER.indexOf(current);
    return idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : "complete";
}

function getPrevStep(current: OnboardingStep): OnboardingStep {
    const idx = STEP_ORDER.indexOf(current);
    return idx > 0 ? STEP_ORDER[idx - 1] : "signup";
}

// =====================================
// Service Class
// =====================================

class OnboardingService {
    /**
     * Get current onboarding status for user
     */
    async getStatus(userId: string): Promise<OnboardingStatusResponse> {
        let tenant = await onboardingRepository.findTenantByUserId(userId);

        // Create initial tenant if none exists
        if (!tenant) {
            tenant = await onboardingRepository.createInitialTenant(userId, userId);
        }

        return {
            currentStep: tenant.onboardingStep,
            data: tenant.onboardingData,
            isComplete: tenant.onboardingStep === "complete",
        };
    }

    /**
     * Save personal info step
     */
    async savePersonalInfo(
        userId: string,
        data: PersonalInfoDto
    ): Promise<StepSaveResponse> {
        if (!isValidPersonalInfo(data)) {
            throw new Error("Invalid personal info: fullName and phoneNumber required");
        }

        const tenant = await this.ensureTenant(userId);
        const updatedData: OnboardingData = {
            ...tenant.onboardingData,
            personal: {
                fullName: data.fullName.trim(),
                phoneNumber: data.phoneNumber.trim(),
            },
        };

        const nextStep = "store";
        await onboardingRepository.updateOnboardingProgress(tenant.id, nextStep, updatedData);

        return {
            success: true,
            nextStep,
            message: "Personal info saved",
        };
    }

    /**
     * Save store info step
     */
    async saveStoreInfo(
        userId: string,
        data: StoreInfoDto
    ): Promise<StepSaveResponse> {
        if (!isValidStoreInfo(data)) {
            throw new Error("Invalid store info: storeName required");
        }

        const tenant = await this.ensureTenant(userId);
        const updatedData: OnboardingData = {
            ...tenant.onboardingData,
            store: {
                storeName: data.storeName.trim(),
                storeDescription: data.storeDescription?.trim() ?? "",
            },
        };

        const nextStep = "business";
        await onboardingRepository.updateOnboardingProgress(tenant.id, nextStep, updatedData);

        return {
            success: true,
            nextStep,
            message: "Store info saved",
        };
    }

    /**
     * Save business info step
     */
    async saveBusinessInfo(
        userId: string,
        data: BusinessInfoDto
    ): Promise<StepSaveResponse> {
        if (!isValidBusinessInfo(data)) {
            throw new Error("Invalid business info: at least one category required");
        }

        const tenant = await this.ensureTenant(userId);
        const updatedData: OnboardingData = {
            ...tenant.onboardingData,
            business: {
                categories: data.categories.map(c => c.trim()),
            },
        };

        // Stay on business step until complete is called
        await onboardingRepository.updateOnboardingProgress(tenant.id, "business", updatedData);

        return {
            success: true,
            nextStep: "complete",
            message: "Business info saved",
        };
    }

    /**
     * Complete onboarding - creates tenant and store
     */
    async completeOnboarding(userId: string, userEmail: string): Promise<OnboardingCompleteResponse> {
        const tenant = await this.ensureTenant(userId);
        const data = tenant.onboardingData;

        // Validate all steps are complete
        if (!data.personal || !isValidPersonalInfo(data.personal)) {
            throw new Error("Personal info incomplete");
        }
        if (!data.store || !isValidStoreInfo(data.store)) {
            throw new Error("Store info incomplete");
        }
        if (!data.business || !isValidBusinessInfo(data.business)) {
            throw new Error("Business info incomplete");
        }

        const result = await onboardingRepository.completeOnboarding(
            tenant.id,
            userEmail,
            data as Required<OnboardingData>
        );

        return {
            success: true,
            tenantId: result.tenant.id,
            storeId: result.store.id,
            storeSlug: result.store.slug,
            message: "Onboarding complete! Your store is ready.",
        };
    }

    /**
     * Navigate to previous step
     */
    async goBack(userId: string): Promise<StepSaveResponse> {
        const tenant = await this.ensureTenant(userId);
        const prevStep = getPrevStep(tenant.onboardingStep);

        if (prevStep === tenant.onboardingStep) {
            throw new Error("Already at first step");
        }

        await onboardingRepository.updateOnboardingProgress(
            tenant.id,
            prevStep,
            tenant.onboardingData
        );

        return {
            success: true,
            nextStep: prevStep,
            message: `Navigated back to ${prevStep}`,
        };
    }

    /**
     * Ensure tenant exists for user
     */
    private async ensureTenant(userId: string) {
        const tenant = await onboardingRepository.findTenantByUserId(userId);
        if (!tenant) {
            throw new Error("Tenant not found. Please start onboarding.");
        }
        return tenant;
    }
}

export const onboardingService = new OnboardingService();
