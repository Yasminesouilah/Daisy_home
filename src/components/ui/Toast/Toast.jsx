export default function Toast({ message, onDismiss }) {
  if (!message) return null;
  return <div className="toast" role="status">{message}<button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button></div>;
}