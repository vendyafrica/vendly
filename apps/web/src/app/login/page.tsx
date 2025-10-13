"use client";

import { OnboardingService } from "@vendly/api/services/onboarding_service";

export default function LoginPage() {

  const handleGoogleSignIn = async () => {
    try {
      await OnboardingService.signInWithGoogle();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <button className="px-4 border-2 m-5 bg-amber-300 " onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}
