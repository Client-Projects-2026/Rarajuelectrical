import { useState, type FormEvent } from "react";

export type QuoteRequestState = "idle" | "submitting" | "success" | "error";

export function useQuoteRequest() {
  const [state, setState] = useState<QuoteRequestState>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setState("error");
      return;
    }

    setState("submitting");
    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") body.append(key, value);
      });

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return { state, submit };
}
