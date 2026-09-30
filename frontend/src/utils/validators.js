export function isValidAlgerianPhone(phone) {
  return /^(?:\+213|00213|0)(?:5|6|7)\d{8}$/.test(phone.replace(/[\s().-]/g, ""));
}

export function validateRequired(value) {
  return String(value ?? "").trim().length > 0;
}

const PHONE_RE = /^0[5-7](\s|-)?\d{2}(\s|-)?\d{2}(\s|-)?\d{2}(\s|-)?\d{2}$/;

export function validateCheckout(values) {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = "Le nom complet est requis.";
  else if (values.fullName.trim().length < 3) errors.fullName = "Nom trop court.";

  if (!values.phone?.trim()) errors.phone = "Le numéro de téléphone est requis.";
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = "Numéro invalide (ex : 0555 12 34 56).";

  if (!values.wilaya) errors.wilaya = "Veuillez choisir une wilaya.";
  if (!values.commune?.trim()) errors.commune = "La commune est requise.";
  if (!values.address?.trim()) errors.address = "L'adresse est requise.";
  else if (values.address.trim().length < 8) errors.address = "Adresse trop courte.";

  return errors;
}