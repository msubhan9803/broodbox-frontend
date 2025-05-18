/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import DrawerComponent from "components/DrawerComponent";
import { toast } from "react-toastify";
import { HiOutlineDownload } from "react-icons/hi";
import useQueryParams from "hooks/common/useQueryParams";
import {
  useFarmById,
  useUploadFile,
  useUpdateHive,
  useUploadMultipleFilesForHiveLocation,
  useDownloadBeehiveImages,
} from "hooks/useFarmManagement";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";
import { convertStringToArray, convertArrayToString } from "utils/helper";
import { ImagesTable } from "components/farmManagement/ImagesTable";
import { useSingleBeeHiveByFarmId } from "hooks/useFarmManagement";

const ManageImages = () => {
  const history = useHistory();
  const [updated_img_urls, setUpdatedImgUrls] = useState("");
  const [previewLinks, setpreviewLinks] = useState([]);
  const uploadFileMutation = useUploadFile;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [updatedImgList, setUpdatedImgList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const query = useQueryParams();

  const farmId = query.get("farmId");
  const businessAccRef = query.get("businessAccRef");
  const area_code = query.get("area_code");
  const location_code = query.get("location_code");

  const { data: beehiveLocationData, isLoading: beehiveLocationLoading } =
    useSingleBeeHiveByFarmId({
      farmId,
      businessAccRef,
      area_code,
      location_code,
    });

  const fileInputRef = useRef();

  const useUploadMultipleMutation = useUploadMultipleFilesForHiveLocation();
  const useUpdateHiveMutation = useUpdateHive();
  const {
    mutate: useDownloadBeehiveImagesMutation,
    isLoading: useDownloadBeehiveImagesLoading,
  } = useDownloadBeehiveImages();

  const handleFileButtonClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  const { data: farmDetailData, isLoading: farmDetailLoading } =
    useFarmById(farmId);

  const handleClose = () => {
    history.goBack();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    useUploadMultipleMutation.mutate(
      {
        params: {
          businessId: farmDetailData.farm.businessAccountRef._id,
          farmId,
          areaCode: area_code,
          locationCode: location_code,
        },
        selectedFiles,
      },
      {
        onSuccess: (data) => {
          console.log("👍", data);
          const updatedImages = data.fileKeys.map(
            (fileKey) =>
              `${process.env.REACT_APP_BASE_URL}/v1/S3/getChildMedia/${fileKey}`
          );

          const newImages = [...images, ...updatedImages];

          // Filter out images starting with "blob:"
          const filteredImages = newImages.filter(
            (imageUrl) => !imageUrl.startsWith("blob:")
          );
          let urls = convertArrayToString(filteredImages);

          setUpdatedImgUrls(urls);

          const { longitude, latitude, total_beehives } = beehiveLocationData;

          const body = {
            total_beehives,
            ac: area_code,
            lc: location_code,
            farmId,
            area_code,
            latitude,
            location_code,
            longitude,
            img_urls: urls,
            businessAccountRef: farmDetailData.farm.businessAccountRef._id,
            isUpdatingHiveImages: true,
          };

          // You should perform the submission logic here, using the updated_img_urls state.

          useUpdateHiveMutation.mutate(body, {
            onSuccess: () => {
              toast.success("Successfully Updated Hive Images");
              handleClose();
            },
            onError: (error) => {
              toast.error(error.response?.data?.message || "An error occurred");
              handleClose();
            },
          });
        },

        onError: () => {
          console.log("Cannot upload files");
        },
      }
    );
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    const fileList = Array.from(files);
    setSelectedFiles(fileList);
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
      event.target.value = "";
    } else {
      console.log("File selection canceled");
    }
  };

  const handleDownloadBeehiveImages = () => {
    console.log("🌺🌺🌺 images: ", images);

    useDownloadBeehiveImagesMutation(
      { farmId, businessAccRef, area_code, location_code },
      {
        onSuccess: async (res) => {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${farmId}-${area_code}-${location_code}.zip`; // The name of the downloaded file
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        onError: (error) => {
          toast.error(error.response.data.error);
        },
      }
    );
  };

  useEffect(() => {
    if (beehiveLocationData && beehiveLocationData.img_urls !== "null") {
      setImages(convertStringToArray(beehiveLocationData.img_urls));
    }
  }, [beehiveLocationData]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <DrawerComponent
          isOpen={true}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          title="Manage Hive Images"
          loading={
            useUploadMultipleMutation.isLoading ||
            useUpdateHiveMutation.isLoading
          }
        >
          <div className="overflow-x-hidden">
            <div className="font-inter text-sm font-medium leading-29 tracking-normal text-left">
              {farmDetailData &&
                farmDetailData.farm.businessAccountRef.businessAccountName}
            </div>
            <div className="font-inter text-xl font-bold leading-29 tracking-normal text-left">
              {farmDetailData &&
                `${farmDetailData.farmId} - ${farmDetailData.farm.title}`}
            </div>
            <div class="overflow-x-auto mt-4">
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
                      {area_code}
                    </td>
                    <td class="text-base  px-1 font-bold font-inter text-start">
                      {location_code}
                    </td>
                    <td class="text-base  px-1 font-bold font-inter text-start">
                      {beehiveLocationData &&
                        parseFloat(beehiveLocationData?.latitude).toFixed(4)}
                    </td>
                    <td class="text-base  px-1 font-bold font-inter text-start">
                      {beehiveLocationData &&
                        parseFloat(beehiveLocationData?.longitude).toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr class="mt-10" />

            <div className="bg-white py-4 flex justify-end md:rounded-bl-xl pr-3 gap-x-2">
              <form>
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <input
                    multiple
                    ref={fileInputRef}
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    className="bg-primary-main text-white w-[125px] h-[46px] rounded-lg flex justify-center items-center"
                  >
                    {uploadFileMutation.isLoading ? (
                      <ButtonSpinner color="text-white" />
                    ) : (
                      "Add +"
                    )}
                  </button>
                </label>
              </form>

              <button
                type="button"
                onClick={handleDownloadBeehiveImages}
                className="bg-primary-main text-white w-[136px] h-[46px] rounded-lg flex justify-center items-center"
                disabled={useDownloadBeehiveImagesLoading}
              >
                {useDownloadBeehiveImagesLoading ? (
                  <ButtonSpinner color="text-white" />
                ) : (
                  <>
                    Download <HiOutlineDownload />
                  </>
                )}
              </button>
            </div>
            <ImagesTable
              images={images}
              previewLinks={previewLinks}
              setUpdatedImgList={setUpdatedImgList}
              setImages={setImages}
            />
          </div>
        </DrawerComponent>
      </form>
    </>
  );
};

export default ManageImages;
