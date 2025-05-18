import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ImageGallery = ({
  selectedClass,
  areaCode,
  businessAccountRef,
  farmId,
  location_code,
}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Function to generate full image URL
  const getImageUrl = (imageName) => {
    return `${baseUrl}/v1/S3/getChildMedia/images_${businessAccountRef}/results_${farmId}/${areaCode}/${location_code}/${imageName}`;
  };

  // Assume titles are available or create them dynamically here
  const images =
    selectedClass?.data?.image_names?.map((imageName) => ({
      url: getImageUrl(imageName),
      title: `Class Image - ${imageName}`, // Example title based on image name
    })) || [];

  return (
    <PhotoProvider className="z-[99999999]">
      <div
        className="grid grid-cols-3 gap-2 p-4 overflow-y-auto"
        style={{ height: "40vh" }} // Set a fixed height to enable scrolling
      >
        {images.map((image, index) => (
          <PhotoView key={index} src={image.url} intro={image.title}>
            <img
              src={image.url}
              alt={image.title}
              className="object-cover w-full rounded-md"
              style={{ height: "auto" }} // Ensure images have a minimum height
            />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default ImageGallery;
