import { useState } from "react";
import { sendMessage } from "../../../services/contactService";
import Button from "../../ui/Button/Button";
import "./ContactForm.css";

const EMPTY = { name: "", phone: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Le nom est requis.";
  if (!values.phone.trim() && !values.email.trim()) errors.phone = "Indiquez un téléphone ou un email.";
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) errors.email = "Adresse email invalide.";
  if (!values.message.trim()) errors.message = "Le message est requis.";
  else if (values.message.trim().length < 10) errors.message = "Message trop court.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === "email" || field === "phone" ? { phone: undefined } : {}),
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await sendMessage(values);
      setSent(true);
      setValues(EMPTY);
    } catch {
      setSubmitError("Votre message n’a pas pu être envoyé. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="contact-form__sent" role="status">
        <h2>Merci, votre message a bien été envoyé.</h2>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <Button variant="outline" onClick={() => setSent(false)}>Envoyer un autre message</Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2>Envoyez-nous un message</h2>
      <div className="field">
        <label htmlFor="c-name">Nom *</label>
        <input id="c-name" autoComplete="name" value={values.name} onChange={handleChange("name")} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "c-name-error" : undefined} />
        {errors.name && <span id="c-name-error" className="field__error" role="alert">{errors.name}</span>}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="c-phone">Téléphone</label>
          <input id="c-phone" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange("phone")} placeholder="Ex : 0555 12 34 56" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "c-phone-error" : undefined} />
          {errors.phone && <span id="c-phone-error" className="field__error" role="alert">{errors.phone}</span>}
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" autoComplete="email" value={values.email} onChange={handleChange("email")} placeholder="vous@email.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "c-email-error" : undefined} />
          {errors.email && <span id="c-email-error" className="field__error" role="alert">{errors.email}</span>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-message">Message *</label>
        <textarea id="c-message" rows={5} value={values.message} onChange={handleChange("message")} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "c-message-error" : undefined} />
        {errors.message && <span id="c-message-error" className="field__error" role="alert">{errors.message}</span>}
      </div>
      {submitError && <p className="contact-form__error" role="alert">{submitError}</p>}
      <Button type="submit" size="lg" full disabled={submitting}>{submitting ? "Envoi en cours..." : "Envoyer le message"}</Button>
    </form>
  );
}