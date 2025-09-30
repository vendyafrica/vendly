
"use client";

import { authClient } from "@vendly/auth/client";


export default function Home() {
  const handle = async () => {
    // Optionally pass callbackURL to return the user to your frontend route after sign-in.
    // Example: callbackURL: "http://localhost:3000/after-auth"
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      // callbackURL: "/", // optional - server will redirect to this after success
    });

    if (error) {
      console.error("sign-in error", error);
      return;
    }
    // Usually signIn.social triggers a redirect flow — this call may not return useful `data`
    // because the browser will be redirected to the provider and then back.
  };
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={handle}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >Sign in with Google</button>
    </div>
  );
}
