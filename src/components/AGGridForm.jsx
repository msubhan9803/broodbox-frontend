import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedRow } from "../redux/Slices/AGGridFormSlice";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import FormStats from "./FormStats";

const AGGridForm = () => {
  const gridFormRef = useRef(null);
  const data = useSelector((state) => state.agGridForm.data);
  const stats = useSelector((state) => state.agGridForm.stats);
  const dispatch = useDispatch();

  const gridOptions = {
    rowDragManaged: true,
    rowHeight: 48,
    suppressMovableColumns: true,
    defaultColDef: {
      minWidth: 200,
    },
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const handleOutsideClick = (e) => {
    if (gridFormRef.current && !gridFormRef.current.contains(e.target)) {
      dispatch(updateSelectedRow(null));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <div className="w-full border border-light rounded-md drop-shadow-md bg-white overflow-hidden selector3">
      <div className="ag-theme-quartz w-full h-[calc(48px*8)]">
        <AgGridReact
          rowData={data.data}
          columnDefs={data.names}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </div>
      <FormStats stats={stats} />
    </div>
  );
};

export default AGGridForm;
