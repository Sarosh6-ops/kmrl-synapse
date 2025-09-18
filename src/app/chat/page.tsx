"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  uid: string;
  name?: string | null;
  text: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
}

export default function ChatHubPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  useEffect(() => {
    if (!firebaseEnabled || !db) return; // guard when Firebase isn't configured
    const q = query(collection(db, "rooms", "global", "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
    return () => unsub();
  }, []);

  const send = async () => {
    if (!user || !text.trim()) return;
    if (!firebaseEnabled || !db) return; // guard
    await addDoc(collection(db, "rooms", "global", "messages"), {
      uid: user.uid,
      name: user.displayName ?? user.email,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center">Loading…</div>;

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Collaboration Hub</h1>
          <p className="text-sm text-muted-foreground">Real-time chat for your team</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </header>

      <main className="p-4 overflow-y-auto space-y-3">
        {!firebaseEnabled && (
          <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-900/40 p-2 rounded">
            Chat is unavailable because Firebase isn't configured. Please set NEXT_PUBLIC_FIREBASE_* variables.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="max-w-[72ch]">
            <div className="text-xs text-muted-foreground">{m.name}</div>
            <div className={`px-3 py-2 rounded-md mt-1 ${m.uid === user?.uid ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <footer className="border-t p-3 flex gap-2">
        <Input placeholder="Message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} disabled={!firebaseEnabled} />
        <Button onClick={send} disabled={!firebaseEnabled}>Send</Button>
      </footer>
    </div>
  );
}