import { useState, type FormEvent } from "react";

export type QuoteRequestState = "idle" | "submitting" | "success" | "error";

export function useQuoteRequest() {
  const [state, setState] = useState<QuoteRequestState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    if (state === "submitting") return;

    if (!form.checkValidity()) {
      form.reportValidity();
      setErrorMessage("Please complete the required fields.");
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMessage("");
    try {
      const fields = new FormData(form);
      const response = await fetch("/api/submit-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          phone: fields.get("phone"),
          company: fields.get("company"),
          email: fields.get("email"),
          customerType: fields.get("customer-type"),
          service: fields.get("service"),
          projectLocation: fields.get("project-location"),
          message: fields.get("message"),
          botField: fields.get("bot-field"),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      if (!response.ok) {
        throw new Error(result?.message || "Could not send the enquiry. Please try again.");
      }

      form.reset();
      setState("success");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : "Could not send the enquiry. Please try again.",
      );
      setState("error");
    }
  }

  return { state, submit, errorMessage };
}
