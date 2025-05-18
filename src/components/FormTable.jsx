const FormTable = ({ columnNames, columnData, onSortChange }) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 text-sm font-bold p-2 bg-gray-200">
        {columnNames.map((name, index) => (
          <div
            key={index}
            className="px-4 py-2 cursor-pointer"
            onClick={() => onSortChange(name.toLowerCase().replace(" ", "_"))}
          >
            {name}
          </div>
        ))}
      </div>
      {columnData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid grid-cols-7 text-sm p-2 ${
            rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
          }`}
        >
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="px-4 py-2">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormTable;
