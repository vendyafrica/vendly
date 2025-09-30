// Adjust the import according to the actual export from "@vendly/auth"
import { authClient } from "@vendly/auth";


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
      <button onClick={handle}>Sign in with Google</button>
    </div>
  );
}
