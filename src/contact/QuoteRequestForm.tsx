import { ArrowRight, Check } from "../icons";
import { services } from "../data";
import { useQuoteRequest } from "./useQuoteRequest";

export default function QuoteRequestForm() {
  const { state, submit } = useQuoteRequest();

  return (
    <form
      id="quote-request"
      className="contact-form"
      name="quote-request"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      aria-busy={state === "submitting"}
      onSubmit={submit}
    >
      <input type="hidden" name="form-name" value="quote-request" />
      <p className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty: {" "}
          <input
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </label>
      </p>
      <p className="form-kicker">PROJECT BRIEF</p>
      <h3>Request a site consultation</h3>
      <p className="form-intro">
        Give us a few details about your facility and requirements.
      </p>
      <div className="form-row">
        <label>
          Contact name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Name"
          />
        </label>
        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={32}
            inputMode="tel"
            placeholder="+91"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Company / facility <span>(optional)</span>
          <input
            name="company"
            autoComplete="organization"
            maxLength={160}
            placeholder="Business or site name"
          />
        </label>
        <label>
          Email address <span>(optional)</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Customer / facility type
          <select name="customer-type" defaultValue="" required>
            <option value="" disabled>
              Choose a facility type
            </option>
            <option>Industrial / manufacturing</option>
            <option>Commercial</option>
            <option>Residential</option>
            <option>Infrastructure / utilities</option>
            <option>Contractor / consultant</option>
          </select>
        </label>
        <label>
          Service required
          <select name="service" defaultValue="" required>
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.number}>{service.title}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Project location <span>(city / district)</span>
        <input
          name="project-location"
          autoComplete="address-level2"
          maxLength={120}
          placeholder="Where is the work required?"
        />
      </label>
      <label>
        Scope of work
        <textarea
          name="message"
          rows={4}
          required
          maxLength={3000}
          placeholder="Describe the work, site conditions, and preferred timeline"
        />
      </label>
      {state === "success" && (
        <p className="form-status success" role="status">
          <Check size={17} /> Thank you. Your project enquiry has been sent.
        </p>
      )}
      {state === "submitting" && (
        <p className="form-status" role="status">
          Sending your project enquiry…
        </p>
      )}
      {state === "error" && (
        <p className="form-status error" role="alert">
          Please complete the required fields and check your connection before
          submitting.
        </p>
      )}
      <button
        className="button button-accent form-submit"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Sending enquiry…" : "Send project enquiry"}
        {state !== "submitting" && <ArrowRight size={17} />}
      </button>
      <p className="form-note">
        Your information is used only to respond to your enquiry.
      </p>
    </form>
  );
}
