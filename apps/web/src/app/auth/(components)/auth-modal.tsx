"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Google } from "@/components/ui/svgs/google";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthModalProps {
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({ defaultMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = mode === 'login' ? { email, password } : { email };
    console.log(`${mode === 'login' ? 'Logging in' : 'Signing up'} with:`, data);
    // Add your auth logic here
  };

  const title = mode === 'login' ? 'Sign in to your account' : 'Create your free account';
  const buttonText = mode === 'login' ? 'Sign In' : 'Create Account';
  const footerText = mode === 'login' ? 'Create an account' : 'Already have an account?';
  const footerLink = mode === 'login' ? 'Join vendly.' : 'Sign in';

  return (
    <Dialog>
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
          {mode === 'login' && (
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
          )}
          <Button type="submit" className="w-full cursor-pointer">
            {buttonText}
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
          <Button variant="outline" type="button" className="cursor-pointer">
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