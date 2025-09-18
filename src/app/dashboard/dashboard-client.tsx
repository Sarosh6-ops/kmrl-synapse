"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const DashboardClient = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-60 rounded bg-muted" />
          <div className="h-5 w-96 rounded bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="h-36 rounded bg-muted" />
            <div className="h-36 rounded bg-muted" />
            <div className="h-36 rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome, {user.displayName || user.email}</h1>
        <p className="text-muted-foreground mt-2">Here’s what’s happening in your workspace today.</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Upload documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Drop PDFs or images to process and make searchable.</p>
            <Button disabled>Upload (coming soon)</Button>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ask questions and get summaries powered by Gemini.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Share and chat with your team in real time.</p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-xl font-medium">Recent documents</h2>
        <p className="text-sm text-muted-foreground">You don’t have any documents yet. Upload to get started.</p>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <Card key={i} className="bg-card/60 backdrop-blur border-border/40">
              <CardContent className="p-4">
                <div className="h-32 rounded bg-muted/60" />
                <div className="mt-3 h-4 w-2/3 rounded bg-muted/60" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};