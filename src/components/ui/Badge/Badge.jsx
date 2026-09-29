import "./Badge.css";

export default function Badge({ variant = "new", children }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}