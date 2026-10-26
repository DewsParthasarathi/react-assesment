import React from "react";

export interface TableColumn<T> {
  /** Unique column identifier (falls back to accessorKey or index) */
  id?: string;
  /** Header label or custom React node */
  header: React.ReactNode;
  /** Key of the data property to display directly */
  accessorKey?: keyof T;
  /** Custom render function for the cell */
  render?: (row: T, index: number) => React.ReactNode;
  /** Optional column width (e.g., '120px', '25%', 120) */
  width?: string | number;
  /** Alignment of column header and cells */
  align?: "left" | "center" | "right";
  /** Custom CSS classes for the td cell */
  className?: string;
  /** Custom CSS classes for the th header cell */
  headerClassName?: string;
}

export interface TableProps<T> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Array of row data records */
  data: T[];
  /** Function to extract a unique key per row */
  keyExtractor?: (row: T, index: number) => string | number;
  /** Wrapper div className */
  className?: string;
  /** HTML table element className */
  tableClassName?: string;
  /** HTML thead element className */
  headerClassName?: string;
  /** HTML thead tr element className */
  headerRowClassName?: string;
  /** HTML tbody element className */
  bodyClassName?: string;
  /** HTML tbody tr element className or resolver function */
  bodyRowClassName?: string | ((row: T, index: number) => string);
  /** Content to display when data array is empty */
  emptyText?: React.ReactNode;
  /** Callback fired when a row is clicked */
  onRowClick?: (row: T, index: number) => void;
  /** Whether rows show hover background styling (defaults to true) */
  hoverable?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className = "overflow-x-auto",
  tableClassName = "w-full text-left text-fs13",
  headerClassName = "",
  headerRowClassName = "border-b border-[#dbdade]/50 text-fs12 text-[#a5a3ae] font-medium uppercase tracking-wider",
  bodyClassName = "divide-y divide-[#dbdade]/30",
  bodyRowClassName,
  emptyText = "No data available",
  onRowClick,
  hoverable = true,
}: TableProps<T>): React.ReactElement {
  const getRowKey = (row: T, index: number): string | number => {
    if (keyExtractor) return keyExtractor(row, index);
    if (typeof row === "object" && row !== null && "id" in row) {
      return String((row as { id: unknown }).id);
    }
    if (typeof row === "object" && row !== null && "no" in row) {
      return String((row as { no: unknown }).no);
    }
    return index;
  };

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      case "left":
      default:
        return "text-left";
    }
  };

  return (
    <div className={className}>
      <table className={tableClassName}>
        <thead className={headerClassName}>
          <tr className={headerRowClassName}>
            {columns.map((col, colIndex) => {
              const alignClass = getAlignmentClass(col.align);
              return (
                <th
                  key={col.id || String(col.accessorKey) || colIndex}
                  className={`pb-3 ${alignClass} ${col.headerClassName || ""}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-[#a5a3ae] text-fs13 font-medium"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const customRowClass =
                typeof bodyRowClassName === "function"
                  ? bodyRowClassName(row, rowIndex)
                  : bodyRowClassName;

              const baseRowClass =
                customRowClass ??
                (hoverable ? "hover:bg-[#f8f7fa]/60 transition" : "");

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={`${baseRowClass} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const alignClass = getAlignmentClass(col.align);
                    const cellContent = col.render
                      ? col.render(row, rowIndex)
                      : col.accessorKey
                      ? (row[col.accessorKey] as unknown as React.ReactNode)
                      : null;

                    return (
                      <td
                        key={col.id || String(col.accessorKey) || colIndex}
                        className={`py-3 ${alignClass} ${col.className || ""}`}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export const CustomTable = Table;
export default Table;
