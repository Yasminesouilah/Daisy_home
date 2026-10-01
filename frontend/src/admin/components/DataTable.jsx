import "./DataTable.css";

export default function DataTable({ columns = [], rows = [], emptyMessage = "Aucune donnée." }) {
  if (rows.length === 0) return <p className="data-table__empty">{emptyMessage}</p>;

  return (
    <div className="data-table__wrapper">
      <table className="data-table">
        <thead>
          <tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}