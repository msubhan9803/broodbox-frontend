import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pagination from "components/table/Pagination";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import SearchBar from "components/table/SearchBar";
import { getResultImageUrl } from "utils/helper";
import { getSpecificPredictions } from "api/farmManagementApi";
import { useAllBeeHiveByFarmId } from "hooks/useFarmManagement";
import PredictionModal from "components/common/Modals/PredictionModal";
import TableActionSimpleFunction from "components/table/TableActionSimpleFunction";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { RxCross1 } from "react-icons/rx";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const PredictionTable = ({ businessAccountRef, farmDetailData }) => {
  const [open, setOpen] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);
  const closeModal = () => setOpen(false);
  const { farmId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState({
    field: "location_code",
    direction: "desc",
  });

  const { _id: businessAccRef } = businessAccountRef.farm.businessAccountRef;
  const { data: allBeeHives, isLoading: allBeeHivesLoading } =
    useAllBeeHiveByFarmId({
      farmId,
      businessAccRef,
      search: searchQuery,
      sortBy: `${sort.field}:${sort.direction}`,
      page: currentPage,
      limit,
    });

  const hiveTableConfig = {
    columns: [
      {
        headerName: "Area Code",
        field: "area_code",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "area_code" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("area_code"),
      },
      {
        headerName: "Location Code",
        field: "location_code",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "location_code" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("location_code"),
      },
      {
        headerName: "Latitude",
        field: "latitude",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "latitude" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("latitude"),
      },
      {
        headerName: "Longitude",
        field: "longitude",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "longitude" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("longitude"),
      },
      {
        headerName: "Total Beehives",
        field: "total_beehives",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "total_beehives" &&
          (sort.direction === "asc" ? (
            <HiMiniChevronUp className="text-lg" />
          ) : (
            <HiMiniChevronDown className="text-lg" />
          )),
        onClick: () => handleSortChange("total_beehives"),
      },
    ],
    rowKey: "_id",
    actions: [
      {
        label: <span>Predictions</span>,
        onClick: (row) => handleModal(row),
      },
    ],
  };

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === "asc";
    setSort({
      field,
      direction: isAsc ? "desc" : "asc",
    });
  };

  const handleModal = async (row) => {
    setRowDetails(row);
    setOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // useEffect(() => {
  //   if (!allBeeHivesLoading && allBeeHives) {
  //     setBeeHives(allBeeHives.hive_details || []);
  //   }
  // }, [allBeeHives, allBeeHivesLoading, setBeeHives]);

  return (
    <>
      <div className="flex mt-[32px] gap-x-4 justify-between items-center">
        <SearchBar
          placeholder="Search by Area code or Location code"
          onSearch={handleSearch}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <TableActionSimpleFunction
          data={allBeeHives?.hive_details || []}
          isLoading={false}
          {...hiveTableConfig}
        />
      </div>

      <PredictionModal
        isOpen={open}
        onRequestClose={closeModal}
        contentLabel="My Custom Modal"
      >
        <span className="absolute right-20 lg:right-8 top-6">
          <RxCross1 size={24} onClick={() => setOpen(false)} />
        </span>

        <PhotoProvider className="z-[99999999]">
          <div className="p-8 lg:py-4 lg:px-4">
            <div className="grid gap-y-4">
              <div className="w-11/12 mx-auto lg:w-full">
                <div className="font-inter text-sm font-medium leading-29 tracking-normal text-left">
                  {farmDetailData &&
                    farmDetailData.farm.businessAccountRef.businessAccountName}
                </div>
                <div className="font-inter text-xl font-bold leading-29 tracking-normal text-left">
                  {farmDetailData &&
                    `${farmDetailData.farmId} - ${farmDetailData.farm.title}`}
                </div>
              </div>

              <div class="overflow-x-auto mb-2 w-11/12 mx-auto lg:w-full">
                <table class="table-auto">
                  <thead>
                    <tr>
                      <th class="font-inter font-medium pr-4 text-[12px] text-start ">
                        Area Code
                      </th>
                      <th class="font-inter font-medium pr-4 text-[12px] text-start">
                        Location Code
                      </th>
                      <th class="font-inter font-medium pr-4 text-[12px] text-start">
                        Latitude
                      </th>
                      <th class="font-inter font-medium pr-4 text-[12px] text-start">
                        Longitude
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-base  px-1 font-bold font-inter text-start">
                        {rowDetails?.area_code}
                      </td>
                      <td class="text-base  px-1 font-bold font-inter text-start">
                        {rowDetails?.location_code}
                      </td>
                      <td class="text-base  px-1 font-bold font-inter text-start">
                        {parseFloat(rowDetails?.latitude).toFixed(4)}
                      </td>
                      <td class="text-base  px-1 font-bold font-inter text-start">
                        {parseFloat(rowDetails?.longitude).toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <PredictionCustomTable
                farmDetailData={farmDetailData}
                rowDetails={rowDetails}
              />
            </div>
          </div>
        </PhotoProvider>
      </PredictionModal>

      <Pagination
        currentPage={currentPage}
        totalPages={allBeeHives?.pagination?.total_pages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

function PredictionCustomTable({ farmDetailData, rowDetails }) {
  const [loading, setLoading] = useState(true);
  const [predictionsList, setPredictionsList] = useState([]);

  useEffect(() => {
    getSpecificPredictions({
      businessAccountRef: farmDetailData.farm.businessAccountRef._id,
      farmId: farmDetailData.farmId,
      areaCode: rowDetails?.area_code,
      locationCode: rowDetails?.location_code,
    }).then(({ results }) => {
      const objectList =
        results?.active_frame_count.map((count, index) => ({
          active_frame_count: count,
          area_code: results.area_code[index],
          classes: results.classes[index],
          confidence: results.confidence[index],
          image_name: results.image_name[index],
          location_code: results.location_code[index],
        })) || [];

      setPredictionsList(objectList);
      setLoading(false);
    });
  }, []);

  return (
    <section class=" w-11/12 lg:w-full mx-auto">
      <div class="w-full mb-8 overflow-hidden rounded-lg shadow-sm">
        <div class="w-full overflow-x-auto max-h-[350px]">
          <table class="w-full">
            <thead>
              <tr class="text-md text-left text-gray-900 bg-[#eef4fe] border">
                <th class="px-4 py-3">Active Frame Count</th>
                {/* <th class="px-4 py-3">Area Code</th> */}
                <th class="px-4 py-3">Classes / Confidence</th>
                {/* <th class="px-4 py-3">Location Code</th> */}
                <th class="px-4 py-3">Image</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              {loading && (
                <td colSpan={6} className="w-full text-center min-h-[350px]">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary-main border-t-transparent mx-auto my-2"></div>
                </td>
              )}
              {!loading &&
                farmDetailData &&
                predictionsList?.length > 0 &&
                predictionsList.map((row) => {
                  const imageUrl = getResultImageUrl(
                    farmDetailData.farm.businessAccountRef._id,
                    farmDetailData.farmId,
                    rowDetails?.area_code,
                    rowDetails?.location_code,
                    row.image_name
                  );

                  return (
                    <tr class="text-gray-700">
                      <td class="px-4 py-3 border">{row.active_frame_count}</td>
                      {/* <td class="px-4 py-3 border">{row.area_code}</td> */}
                      <td class="px-4 py-3 border">
                        {row.confidence.map((confidence, index) => (
                          <span className="flex gap-x-2 items-center">
                            {row.classes[index]} <FaArrowRightArrowLeft />
                            {confidence}
                          </span>
                        ))}
                      </td>
                      {/* <td class="px-4 py-3 border">{row.location_code}</td> */}
                      <td class="px-4 py-3 border">
                        <PhotoView src={imageUrl.replace("100", "800")}>
                          <img
                            src={imageUrl}
                            alt="Thumbnail"
                            style={{
                              width: 40,
                              height: 20,
                              borderRadius: "10%",
                            }}
                          />
                        </PhotoView>
                      </td>
                    </tr>
                  );
                })}

              {!loading && predictionsList?.length === 0 && (
                <tr class="text-gray-700">
                  <td colspan="5" className="text-center py-2 font-bold">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default PredictionTable;
