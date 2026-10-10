import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-background p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Your session has expired</h1>
        <p className="text-sm text-muted-foreground">Sign in again to continue.</p>
        <Link href="/sign-in" className="inline-flex w-full">
          <Button className="w-full">Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
