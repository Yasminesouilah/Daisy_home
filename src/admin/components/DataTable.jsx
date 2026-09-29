export default function DataTable({ columns = [], rows = [] }) {
  return <table><thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id ?? index}>{columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}</tr>)}</tbody></table>;
}