"use client"

import React from "react";
import * as AuthButtons from "@vendly/auth/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    await Auth.signInWithGoogle();
  };

  const handleInstagramSignIn = async () => {
    await AuthButtons.signInWithInstagram();
  };

  return (
    <div>
      <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
      <Button onClick={handleInstagramSignIn}>Sign in with Instagram</Button  >
    </div>
  );
}
