import { useState } from "react";
import { signUpWithEmail,signInWithEmail,signInWithGoogle,signInWithGithub,} from "@vendly/auth";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpWithEmail({ email, password, name });
      // Redirect or show success
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail({ email, password });
      // Redirect or show success
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Will redirect to Google
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      // Will redirect to GitHub
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>

      <div className="divider">OR</div>

      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button onClick={handleGithubSignIn}>Sign in with GitHub</button>
    </div>
  );
}
