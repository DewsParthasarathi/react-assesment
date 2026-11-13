import React from "react";

export interface TableColumn<T> {
  id?: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  bodyRowClassName?: string | ((row: T, index: number) => string);
  emptyText?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  hoverable?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className = "overflow-x-auto",
  tableClassName = "w-full text-left text-fs14",
  headerClassName = "",
  headerRowClassName = "border-b border-[#dbdade]/50 text-fs13 text-[#a5a3ae] font-medium uppercase tracking-wider",
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
                className="py-8 text-center text-[#a5a3ae] text-fs14 font-medium"
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
                (hoverable
                  ? "hover:bg-[#f8f7fa]/60 dark:hover:bg-[#353952] transition-colors"
                  : "");

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
