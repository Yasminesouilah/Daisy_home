export default function Select({ label, error, id, children, ...props }) {
  return <label className="field" htmlFor={id}>{label}<select id={id} aria-invalid={Boolean(error)} {...props}>{children}</select>{error && <small role="alert">{error}</small>}</label>;
}