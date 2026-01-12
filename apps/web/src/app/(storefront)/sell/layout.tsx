import { OnboardingProvider } from '../../../contexts/onboarding-context';

export default function SellLayout({ children }: { children: React.ReactNode }) {
    return (
        <OnboardingProvider>
            <div className="min-h-screen w-full relative">
                {/* Radial Gradient Background from Top */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
                    }}
                />
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                    <div className="w-full max-w-4xl">
                        {children}
                    </div>
                </div>
            </div>
        </OnboardingProvider>
    );
}
