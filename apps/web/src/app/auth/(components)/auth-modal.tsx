"use client";
import { Button } from "@vendly/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@vendly/ui/components/dialog";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Separator } from "@vendly/ui/components/separator";
import { Google } from "@vendly/ui/components/svgs/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@vendly/auth/client";

interface AuthModalProps {
  defaultMode?: "login" | "signup";
}

export function AuthModal({ defaultMode = "signup" }: AuthModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });

        if (error) {
          console.log("Login error:", error);
          console.log("Error message:", error.message);
          return setError((error.message || "An error occurred") as string);
        }
        if (data) {
          setOpen(false);
          router.push("/");
        }
      } else {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name: name || "",
          callbackURL: "/store",
        });

        if (error) {
          console.log("Signup error:", error);
          console.log("Error message:", error.message);
          return setError(error.message || "An error occurred");
        }
        if (data) {
          setOpen(false);
          router.push("/store");
        }
      }
    } catch (err) {
      console.log("Catch error:", err);
      if (err instanceof Error) {
        console.log("Error message:", err.message);
      }
      setError(
        err instanceof Error
          ? err.message || "Something went wrong"
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/store",
      });
    } catch (err) {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login" ? "Sign in to your account" : "Create your free account";
  const buttonText = mode === "login" ? "Sign In" : "Create Account";
  const footerText =
    mode === "login" ? "Create an account" : "Already have an account?";
  const footerLink = mode === "login" ? "Join vendly." : "Sign in";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-start text-left gap-4">
          <DialogTitle className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/apple-icon.png"
                alt="vendly logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-lg text-foreground">vendly.</span>
            </Link>
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : buttonText}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="grid gap-4">
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={handleGoogle}
          >
            <Google className="size-5 mr-2" />
            Continue with Google
          </Button>
        </div>

        <DialogDescription>
          {footerText}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline cursor-pointer"
          >
            {footerLink}
          </button>
        </DialogDescription>

        <p className="px-6 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
