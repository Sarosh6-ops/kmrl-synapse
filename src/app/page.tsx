"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1546167790-85f1a2d8bb30?q=80&w=2400&auto=format&fit=crop"
        alt="Kochi city night skyline"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />

      <section className="relative z-10 container mx-auto px-6 pt-24 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/60 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Live prototype
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight">KMRL Synapse</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A high-end document intelligence platform for Kochi Metro. Upload, search, summarize, and collaborate with AI—faster than ever.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">Get started</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Explore demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 container mx-auto px-6 pb-24 grid gap-6 md:grid-cols-3">
        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">AI Insights</h3>
            <p className="text-sm text-muted-foreground mt-2">Send any document to Gemini for crisp summaries, risks, and action items tailored to metro ops.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">Real-time Collaboration</h3>
            <p className="text-sm text-muted-foreground mt-2">Comment and chat live on documents using secure Firebase-backed rooms.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">OCR + Search</h3>
            <p className="text-sm text-muted-foreground mt-2">Extract text from images and scanned PDFs with on-demand OCR to make everything searchable.</p>
          </CardContent>
        </Card>
      </section>

      <footer className="relative z-10 border-t bg-background/60 backdrop-blur">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} KMRL Synapse</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}