import TopHeading from "components/TopHeading";
import fake_training from "utils/fake_training";
import YouTube from "react-youtube";
import Pagination from "components/table/Pagination";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { useGetAllTrainings, useDeleteTraining } from "hooks/useTraining";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
import { checkActionPrivilege, checkScreenPrivilege } from "utils/helper";
import { actionConfig, modulesConfig, screenConfig } from "utils/constants";
import { useGetPrivilegesByRoleName } from "hooks/useUserManagement";

const Training = () => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(6);
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const { user } = useSelector((state) => state.user);

  const moduleName = modulesConfig.training;
  const screenName = screenConfig.add_training;

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };
  const handleOpen = () => {
    history.push({
      pathname: `/training/add`,
    });
  };

  const navigateToView = (item, i) => {
    checkScreenPrivilege(
      moduleName,
      "view_training",
      privilegedModulesData?.moduleList
    )
      ? history.push({
          pathname: `/training/view/${item._id}`,
          state: { item: { ...item, index: i } },
        })
      : history.push("/not_authorized");
  };

  const handleEdit = (item, event) => {
    event.stopPropagation();
    history.push({
      pathname: `/training/edit_training/${item._id}`,
      state: {
        item,
        background: { pathname: "/training" },
      },
    });
  };

  const { data: allTrainings, isLoading: allTrainingsLoading } =
    useGetAllTrainings({
      search: searchQuery,
      sortBy: `${sort.field}:${sort.direction}`,
      page: currentPage,
      limit,
    });

  const { data: privilegedModulesData } = useGetPrivilegesByRoleName(
    user?.user?.role
  );

  // Delete Mutation
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "custom-confirm-button-class",
      cancelButton: "custom-cancel-button-class",
    },
    buttonsStyling: false,
  });

  const swalWithRoundedBorder = Swal.mixin({
    customClass: {
      popup: "rounded-[10px] w-[400px]",
    },
    buttonsStyling: true,
    confirmButtonColor: "#5604A9", // Custom color for the confirm button
    cancelButtonColor: "#fff", // Custom color for the cancel button
  });
  const useDeleteTrainingMutation = useDeleteTraining();
  const handleDelete = (itemId, event) => {
    event.stopPropagation();
    swalWithRoundedBorder
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        iconColor: "#5604A9",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          useDeleteTrainingMutation.mutate(itemId, {
            onSuccess: () => {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Training has been deleted.",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });
              // Optional: Refresh data or update UI here
            },
            onError: (error) => {
              swalWithBootstrapButtons.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error",
                timer: 1000,
                showConfirmButton: false,
              });
              console.error("Error deleting:", error);
            },
          });
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

  function extractYouTubeVideoId(videoUrl) {
    // Check if the provided URL is empty or not a string
    if (!videoUrl || typeof videoUrl !== "string") {
      return null;
    }

    // Split the URL to extract query parameters
    const urlParams = new URLSearchParams(videoUrl.split("?")[1]);

    // Retrieve the value of the 'v' parameter (video ID)
    return urlParams.get("v");
  }
  return (
    <>
      <div className="flex justify-between items-center ">
        <TopHeading mainHeading={"Welcome to Training!"} />
        {checkScreenPrivilege(
          moduleName,
          screenName,
          privilegedModulesData?.moduleList
        ) && (
          <Link
            className="w-[108px] h-[44px] flex justify-center items-center text-white gap-[5px] bg-primary-main rounded-lg"
            to={{
              pathname: "/training/add_training",
              state: {
                background: {
                  pathname: "/training",
                },
              },
            }}
          >
            Add +
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-6">
        {allTrainings?.results?.map((item, i) => {
          const itemNumber = (currentPage - 1) * limit + 1 + i;
          return (
            <div
              onClick={() => navigateToView(item, i)}
              class="cursor-pointer flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div class="w-full h-auto min-h-40 rounded-t-lg">
                <YouTube
                  videoId={extractYouTubeVideoId(item.video_url)}
                  opts={opts}
                  className="h-full w-full"
                  iframeClassName="rounded-t-lg"
                />
              </div>

              <div className="flex flex-col h-full p-3">
                <div class="flex gap-x-2 justify-start items-start">
                  <div className="flex justify-center items-center w-10 h-10 min-h-10 min-w-10 border border-gray-200 rounded-xl text-xl md:text-2xl font-medium">
                    {itemNumber}
                  </div>

                  <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                    {item?.title}
                  </h5>
                </div>

                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1 pt-1 line-clamp-3">
                  {item?.description}
                </p>

                <div className="flex space-x-2 items-center mt-4">
                  {checkScreenPrivilege(
                    moduleName,
                    "edit_training",
                    privilegedModulesData?.moduleList
                  ) && (
                    <button
                      className="text-gray-500 border border-gray-400 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-sm font-bold rounded-lg cursor-pointer px-3 py-1"
                      onClick={(event) => handleEdit(item, event)}
                    >
                      Edit
                    </button>
                  )}
                  {checkScreenPrivilege(
                    moduleName,
                    "edit_training",
                    privilegedModulesData?.moduleList
                  ) && (
                    <button
                      type="button"
                      className="text-red-500 border border-red-300 bg-red-50 hover:bg-red-100 disabled:bg-red-100 text-sm font-bold rounded-lg cursor-pointer px-3 py-1"
                      onClick={(event) => handleDelete(item._id, event)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={allTrainings?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Training;
