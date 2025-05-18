import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import DrawerDateTimeFilter from "components/DrawerDateTimeFilter";
import { useState } from "react";

const PollinationTimeFilter = ({ context }) => {
  const history = useHistory();

  const [selectedDays, setSelectedDays] = useState([]);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <>
      <DrawerDateTimeFilter
        isOpen={true}
        handleClose={handleClose}
        handleSubmit={() => {}}
        title="Filter Map by Date/Time"
        loading={false}
      ></DrawerDateTimeFilter>
    </>
  );
};

export default PollinationTimeFilter;
