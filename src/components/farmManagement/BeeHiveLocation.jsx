import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { MdOutlineImage } from "react-icons/md";
import SearchBar from "components/table/SearchBar";
import Pagination from "components/table/Pagination";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiRefreshCcw } from "react-icons/fi";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import { toast } from "react-toastify";
import Table from "components/table/Table";
import { generateGenericQueryString, convertStringToArray } from "utils/helper";
import "react-responsive-modal/styles.css";
import {
  useAllBeeHiveByFarmId,
  useDeleteBeeHiveLocation,
  useGenerateAllPredictionsAndUpdateSpatialData,
  useGenerateSpecificSpatialUpdatesAndPredictionsGeneration,
} from "hooks/useFarmManagement";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const BeeHiveLocation = ({ businessAccountRef }) => {
  const { farmId } = useParams();
  const fileInputRef = useRef();
  const location = useLocation();
  // const { businessAccountRef: businessAccRef } = location?.state;
  const useRemoveBeeHiveLocation = useDeleteBeeHiveLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState({
    field: "location_code",
    direction: "desc",
  });
  // const [beehives, setBeeHives] = useState([]);
  const [isSpecificPredictionLoading, setIsSpecificPredictionLoading] =
    useState(false);

  const [currentAreaLocationPrediction, setCurrentAreaLocationPrediction] =
    useState(null);

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

  const generateAllPredictionsAndUpdateSpatialDataMutation =
    useGenerateAllPredictionsAndUpdateSpatialData();

  const generateSpecificSpatialUpdatesAndPredictionsGenerationMutation =
    useGenerateSpecificSpatialUpdatesAndPredictionsGeneration();

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === "asc";
    setSort({
      field,
      direction: isAsc ? "desc" : "asc",
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = (
    businessAccountRef,
    farmId,
    areaCode,
    locationCode
  ) => {
    if (allBeeHives?.hive_details.length === 1) {
      Swal.fire({
        icon: "error",
        title: "Atleast one hive location is required",
      });
      return;
    }

    const params = {
      businessAccountRef,
      farmId,
      areaCode,
      locationCode,
    };
    const onSuccess = () => {
      swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Location has been deleted.",
        icon: "success",
        timer: 1000, // Automatically close after 1 second
        showConfirmButton: false, // Hide the OK button
      });
    };

    const onError = (error) => {
      swalWithBootstrapButtons.fire({
        title: "Error",
        text: "An error occurred while deleting the location.",
        icon: "error",
        timer: 1000,
        showConfirmButton: false,
      });
      console.error("Error deleting location:", error);
    };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        popup: "", // Add a custom class for the whole dialog
      },
      buttonsStyling: true,
      confirmButtonColor: "#5604A9",
    });

    const swalWithRoundedBorder = Swal.mixin({
      customClass: {
        popup: "rounded-[10px] w-[400px] ",
      },
      buttonsStyling: true,
      // confirmButtonColor: "#5604A9",
    });

    swalWithRoundedBorder
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "info",
        iconColor: "#5604A9",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonClass: "custom-confirm-button-class",
        cancelButtonClass: "custom-cancel-button-class",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            useRemoveBeeHiveLocation.mutate(params);
            onSuccess();
          } catch (error) {
            onError(error);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "",
            icon: "error",
            timer: 1000,
            showConfirmButton: false,
          });
        }
      });
  };

  const handleGenerateAllPredictions = () => {
    setIsSpecificPredictionLoading(true);

    generateAllPredictionsAndUpdateSpatialDataMutation.mutate(
      {
        farmId,
      },
      {
        onSuccess: () => {
          toast.success("Predictions generated successfully");
          setIsSpecificPredictionLoading(false);
        },
        onError: (error) => {
          toast.error(error.response.data.error);
          setIsSpecificPredictionLoading(false);
        },
      }
    );
  };

  const handleGenerateSpecificPredictions = (areaCode, locationCode) => {
    setIsSpecificPredictionLoading(true);

    setCurrentAreaLocationPrediction({ areaCode, locationCode });

    generateSpecificSpatialUpdatesAndPredictionsGenerationMutation.mutate(
      {
        farmId,
        businessAccRef,
        areaCode,
        locationCode,
      },
      {
        onSuccess: () => {
          toast.success("Predictions generated successfully");
          setIsSpecificPredictionLoading(false);
          setCurrentAreaLocationPrediction(null);
        },
        onError: (error) => {
          toast.error(error.response.data.error);
          setIsSpecificPredictionLoading(false);
          setCurrentAreaLocationPrediction(null);
        },
      }
    );
  };

  const doesBeehiveLocationsExists = useMemo(
    () => allBeeHives?.hive_details?.length >= 1 || false,
    [allBeeHives]
  );
  const doesImagesExists = useMemo(
    () =>
      allBeeHives?.hive_details?.some(
        (location) => convertStringToArray(location.img_urls).length >= 1
      ) || false,
    [allBeeHives]
  );

  const hiveTableConfig = {
    columns: [
      {
        headerName: "Area Code",
        field: "area_code",
        sortable: true,
        renderSortIcon: () =>
          sort.field === "role" &&
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
          sort.field === "role" &&
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
        render: (row) => (
          <button
            className="flex items-center space-x-1 font-bold disabled:text-gray-400"
            onClick={() => {
              handleGenerateSpecificPredictions(
                row.area_code,
                row.location_code
              );
            }}
            disabled={isSpecificPredictionLoading ? true : convertStringToArray(row.img_urls).length >= 1 ? false : true}
          >
            {isSpecificPredictionLoading &&
            currentAreaLocationPrediction?.areaCode === row?.area_code &&
            currentAreaLocationPrediction?.locationCode ===
              row.location_code ? (
              <ButtonSpinner color="text-gray-800" />
            ) : (
              <FiRefreshCcw className="text-lg" />
            )}

            <span>Generate Prediction</span>
          </button>
        ),
      },
      {
        // label: "Manage Images",
        label: (
          <div className="flex items-center space-x-1">
            <MdOutlineImage className="text-lg" />
            <span>Manage Images</span>
          </div>
        ),
        onClick: (row) => ({
          pathname: `/farm_management/manage_images`,
          search: farmId
            ? `?${generateGenericQueryString({
                farmId,
                businessAccRef,
                area_code: row.area_code,
                location_code: row.location_code,
                // latitude: row.latitude,
                // longitude: row.longitude,
                // img_urls: row.img_urls || '',
                // total_beehives: row.total_beehives,
              })}`
            : "",
          state: { background: location },
        }),
      },
      {
        label: (
          <div className="flex items-center space-x-1">
            <FaRegEdit className="text-lg" />
            <span>Edit</span>
          </div>
        ),
        onClick: (row) => ({
          pathname: `/farm_management/edit_beehive_location/${farmId}/${row.location_code}`,
          state: {
            ...row,
            farmId,
            // beehives,
          }, // mohd i am sending some params that we need for
        }),
      },
      {
        render: (row) => (
          <span
            onClick={() =>
              handleDeleteConfirm(
                businessAccRef,
                farmId,
                row.area_code,
                row.location_code
              )
            }
            className="flex items-center space-x-1 cursor-pointer"
          >
            <RiDeleteBin5Line />
            Delete
          </span>
        ),
      },
    ],
  };

  const isGenerateButtonDisabled = () => {
    if (doesBeehiveLocationsExists && doesImagesExists) {
      if (
        generateAllPredictionsAndUpdateSpatialDataMutation.isLoading ||
        isSpecificPredictionLoading
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-[32px] gap-y-2 lg:gap-y-0 lg:gap-x-4 lg:justify-between lg:items-center">
        <SearchBar
          placeholder="Search by Area code or Location code"
          onSearch={handleSearch}
        />

        <div className="flex items-center gap-x-2">
          <button
            type="button"
            className="w-auto min-w-32 h-[40px] px-3 flex justify-center items-center text-white gap-[5px] bg-primary-main disabled:bg-primary-light rounded-lg"
            disabled={isGenerateButtonDisabled()}
            onClick={() => handleGenerateAllPredictions()}
          >
            {generateAllPredictionsAndUpdateSpatialDataMutation.isLoading ? (
              <ButtonSpinner />
            ) : (
              "Generate All Preditions"
            )}
          </button>

          <Link
            to={{
              pathname: `/farm_management/add_beehive_location/${farmId}`,
              // state: { beehives },
            }}
            className="w-auto h-[40px] px-3 flex justify-center items-center text-white gap-[5px] bg-primary-main rounded-lg"
          >
            Add Location +
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table
          data={allBeeHives?.hive_details || []}
          isLoading={false}
          {...hiveTableConfig}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={allBeeHives?.pagination?.total_pages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default BeeHiveLocation;
