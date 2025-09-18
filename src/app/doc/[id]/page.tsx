"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { db, firebaseEnabled } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocData {
  id: string;
  name: string;
  type: string;
  url: string;
}

export default function DocumentViewerPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DocData | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      if (!firebaseEnabled || !db) return;
      const snap = await getDoc(doc(db, "documents", id));
      if (snap.exists()) setData({ id: snap.id, ...(snap.data() as any) });
    };
    run();
  }, [id]);

  const analyze = async () => {
    if (!data) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url, extra: `Filename: ${data.name}` }),
      });
      const json = await res.json();
      if (json.result) setInsight(json.result);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading || !data) return <div className="min-h-[60vh] grid place-items-center">Loading…</div>;

  const isImage = data.type?.includes("image");
  const isPdf = data.type?.includes("pdf");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="border-r p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold truncate">{data.name}</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Back</Button>
        </div>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-muted">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.url} alt={data.name} className="w-full h-full object-contain" />
              ) : (
                <iframe src={data.url} className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <Button onClick={analyze} disabled={loadingAi}>{loadingAi ? "Analyzing…" : "Analyze"}</Button>
        </div>
        <Card>
          <CardContent>
            {insight ? (
              <article className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{insight}</article>
            ) : (
              <p className="text-muted-foreground">Click Analyze to generate a summary and action items for this document.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}