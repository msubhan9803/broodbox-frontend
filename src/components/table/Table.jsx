import React from "react";
import { Link } from "react-router-dom";

const Skeleton = () => (
  <div className="animate-pulse bg-gray-300 h-4 w-full rounded"></div>
);

const Table = ({ data, columns, rowKey, actions, isLoading }) => {
  const renderCellContent = (row, column) => {
    if (isLoading) {
      return <Skeleton />;
    }
    return column.render ? column.render(row) : row[column.field];
  };

  return (
    <table className="w-full text-left rtl:text-right border-separate border-spacing-y-4 overflow-x-scroll">
      <thead className="text-xs text-gray-700 uppercase bg-transparent">
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.field}
              className={`px-6 uppercase text-[#909FBA] text-[13px] text-openSan font-normal leading-[18px] py-3${
                index === 0 ? "rounded-tl-md" : ""
              } ${
                !actions && index === columns.length - 1 ? "rounded-tr-md" : ""
              }
              ${column.sortable && "cursor-pointer"}
              `}
              onClick={column?.onClick}
            >
              <span className="flex items-center">
                {column.headerName} {column.sortable && column.renderSortIcon()}{" "}
                <span className="ml-2">{column.renderInfo && column.renderInfo()}</span>
              </span>
            </th>
          ))}
          {actions && actions.some((action) => !!action) && (
            <th className="px-6 uppercase text-[#909FBA] text-[13px] text-openSan font-normal leading-[18px] py-3 rounded-tr-md">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {(isLoading ? Array.from(new Array(5)) : data).map((row, rowIndex) => (
          <tr
            className="bg-white drop-shadow"
            key={row ? row[rowKey] : rowIndex}
          >
            {columns.map((column, columnIndex) => (
              <td
                className={`px-6 py-4 text-gray-900 font-normal text-openSan text-[14px] whitespace-nowrap ${
                  columnIndex === 0 ? "rounded-l-md" : ""
                } ${
                  !actions && columnIndex === columns.length - 1
                    ? "rounded-r-md"
                    : ""
                }`}
                key={`${row ? row[rowKey] : rowIndex}-${column.field}`}
              >
                {renderCellContent(row, column)}
              </td>
            ))}
            {actions && (
              <td
                className={`px-6 text-gray-900 text-[14px] font-normal text-openSan py-4 whitespace-nowrap rounded-r-md`}
              >
                <div className="flex gap-[30px]">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    actions
                      .filter((action) => action)
                      .map((action, index) => (
                        <>
                          {action.render ? (
                            action.render(row)
                          ) : (
                            <Link
                              key={index}
                              to={() => action.onClick(row)}
                              className="font-semibold"
                            >
                              {action.label}
                            </Link>
                          )}
                        </>
                      ))
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
