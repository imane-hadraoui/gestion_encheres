export function ATable({ columns, data }) {
  return (
    <>
      <table className={"table table-striped "}>
        <thead>
          <tr>
            {columns.map(function (column) {
              return <th key={column.selector}>{column.label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map(function (item) {
            return (
              <tr key={item.id}>
                {columns.map(function (column) {
                  return (
                    <td key={column.selector}>
                      {column.render
                        ? column.render(item)
                        : item[column.selector]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
