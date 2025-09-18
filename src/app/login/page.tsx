"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, firebaseEnabled } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!firebaseEnabled || !auth) {
        throw new Error("Authentication is not available. Firebase is not configured.");
      }
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!firebaseEnabled || !auth || !googleProvider) {
        throw new Error("Google Sign-In is not available. Firebase is not configured.");
      }
      await signInWithPopup(auth, googleProvider);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1546167790-85f1a2d8bb30?q=80&w=2000&auto=format&fit=crop"
          alt="Kochi Metro night cityscape"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative z-10 p-12 h-full flex flex-col justify-end">
          <h1 className="text-4xl font-semibold tracking-tight">KMRL Synapse</h1>
          <p className="text-muted-foreground mt-4 max-w-md">
            Smart, secure, and stunning document intelligence for Kochi Metro. Reduce overload, surface insights, and collaborate in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to continue to your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/40 p-2 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@kmrl.in" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={loading || authLoading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <div className="my-6 flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
            <Button variant="secondary" className="w-full" onClick={onGoogle} disabled={loading || authLoading}>
              Continue with Google
            </Button>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <button type="button" className="underline" onClick={() => setMode("signup")}>Need an account? Sign up</button>
              ) : (
                <button type="button" className="underline" onClick={() => setMode("signin")}>Have an account? Sign in</button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}