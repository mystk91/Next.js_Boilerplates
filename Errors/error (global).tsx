"use client";
import Error from "@/app/ui/Errors/Global Error/globalError";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Error error={error} reset={reset} />;
}
