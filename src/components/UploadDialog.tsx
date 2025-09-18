"use client";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db, firebaseEnabled } from "@/lib/firebase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadDialog({ uid }: { uid: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onUpload = async () => {
    if (!file) return;
    if (!firebaseEnabled || !storage || !db) {
      // Silently ignore when not configured
      return;
    }
    setUploading(true);
    try {
      const key = `docs/${uid}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, key);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      const doc = {
        uid,
        name: file.name,
        size: file.size,
        type: file.type,
        path: key,
        url,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "documents"), doc);
      setOpen(false);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground text-background hover:opacity-90" disabled={!firebaseEnabled}>
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            Supported: PDF, images. Files are stored securely in Firebase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Choose file</Label>
            <Input id="file" type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} disabled={!firebaseEnabled} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onUpload} disabled={!file || uploading || !firebaseEnabled}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}