export default function Input({ label, error, id, ...props }) {
  return <label className="field" htmlFor={id}>{label}<input id={id} aria-invalid={Boolean(error)} {...props} />{error && <small role="alert">{error}</small>}</label>;
}