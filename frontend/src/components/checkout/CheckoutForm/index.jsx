import { WILAYAS } from "../../../data/wilayas";
import "./CheckoutForm.css";

function FieldError({ id, children }) {
	return children ? <span id={id} className="field__error" role="alert">{children}</span> : null;
}

export default function CheckoutForm({ values, errors, onChange }) {
	const handle = (field) => (event) => onChange(field, event.target.value);

	return (
		<div className="checkout-form">
			<h2>Vos informations</h2>
			<div className="field">
				<label htmlFor="fullName">Nom complet *</label>
				<input id="fullName" autoComplete="name" value={values.fullName} onChange={handle("fullName")} placeholder="Ex : Yasmine Benali" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
				<FieldError id="fullName-error">{errors.fullName}</FieldError>
			</div>
			<div className="field">
				<label htmlFor="phone">Téléphone *</label>
				<input id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={handle("phone")} placeholder="Ex : 0555 12 34 56" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
				<FieldError id="phone-error">{errors.phone}</FieldError>
			</div>
			<div className="field-row">
				<div className="field">
					<label htmlFor="wilaya">Wilaya *</label>
					<select id="wilaya" autoComplete="address-level1" value={values.wilaya} onChange={handle("wilaya")} aria-invalid={Boolean(errors.wilaya)} aria-describedby={errors.wilaya ? "wilaya-error" : undefined}>
						<option value="">Choisir une wilaya...</option>
						{WILAYAS.map((wilaya) => <option key={wilaya.code} value={wilaya.code}>{wilaya.name}</option>)}
					</select>
					<FieldError id="wilaya-error">{errors.wilaya}</FieldError>
				</div>
				<div className="field">
					<label htmlFor="commune">Commune *</label>
					<input id="commune" autoComplete="address-level2" value={values.commune} onChange={handle("commune")} placeholder="Ex : Hydra" aria-invalid={Boolean(errors.commune)} aria-describedby={errors.commune ? "commune-error" : undefined} />
					<FieldError id="commune-error">{errors.commune}</FieldError>
				</div>
			</div>
			<div className="field">
				<label htmlFor="address">Adresse *</label>
				<input id="address" autoComplete="street-address" value={values.address} onChange={handle("address")} placeholder="Rue, numéro, repère..." aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} />
				<FieldError id="address-error">{errors.address}</FieldError>
			</div>
			<div className="field">
				<label htmlFor="notes">Instructions de livraison (optionnel)</label>
				<textarea id="notes" rows={3} value={values.notes} onChange={handle("notes")} placeholder="Ex : appeler avant d'arriver" />
			</div>
		</div>
	);
}