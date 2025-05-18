import React, { useState } from "react";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";

const Skeleton = () => (
  <div className="animate-pulse bg-gray-300 h-4 w-full rounded"></div>
);

const TableExpandible = ({
  data,
  columns,
  rowKey,
  actions,
  isLoading,
  expandableContent,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const renderCellContent = (row, column) => {
    if (isLoading) {
      return <Skeleton />;
    }
    return column.render ? column.render(row) : row[column.field];
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
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
                {column.headerName} {column.sortable && column.renderSortIcon()}
              </span>
            </th>
          ))}
          {expandableContent && (
            <th className="px-6 uppercase text-[#909FBA] text-[13px] text-openSan font-normal leading-[18px] py-3 rounded-tr-md">
              Details
            </th>
          )}
          {actions && actions.some((action) => !!action) && (
            <th className="px-6 uppercase text-[#909FBA] text-[13px] text-openSan font-normal leading-[18px] py-3 rounded-tr-md">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {(isLoading ? Array.from(new Array(5)) : data).map((row, rowIndex) => (
          <React.Fragment key={row ? row?._id : rowIndex}>
            <tr className="bg-white drop-shadow">
              {columns.map((column, columnIndex) => (
                <td
                  className={`px-6 py-4 text-gray-900 font-normal text-openSan text-[14px] whitespace-nowrap ${
                    columnIndex === 0 ? "rounded-l-md" : ""
                  } ${
                    !actions && columnIndex === columns.length - 1
                      ? "rounded-r-md"
                      : ""
                  }`}
                  key={`${row ? row?._id : rowIndex}-${column.field}`}
                >
                  {renderCellContent(row, column)}
                </td>
              ))}
              {expandableContent && (
                <td
                  colSpan={actions ? 1 : 2}
                  className="px-6 py-4 text-gray-900 font-normal text-openSan text-[14px] whitespace-nowrap rounded-r-md"
                >
                  <button onClick={() => toggleRowExpansion(row?._id)}>
                    {expandedRow === row?._id ? (
                      <HiMiniChevronUp size={20} />
                    ) : (
                      <HiMiniChevronDown size={20} />
                    )}
                  </button>
                </td>
              )}
            </tr>
            {/* {expandedRow === row?._id && (
              <tr>
                <td
                  colSpan={columns.length + (expandableContent ? 1 : 0)}
                  className="border-b-2 border-gray-200"
                >
                  <div className="p-4 bg-white">{expandableContent(row)}</div>
                </td>
              </tr>
            )} */}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableExpandible;
