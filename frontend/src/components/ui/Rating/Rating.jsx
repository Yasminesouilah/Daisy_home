export default function Rating({ value = 0, count }) {
  return <span aria-label={`${value} out of 5 stars`}>★ {value.toFixed(1)}{count != null ? ` (${count})` : ''}</span>;
}