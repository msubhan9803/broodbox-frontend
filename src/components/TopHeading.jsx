import React from "react";

const TopHeading = ({ subHeading, mainHeading, primaryTextColor }) => {
  return (
    <div className="text-roboto">
      {subHeading && (
        <h4 className="text-2xl my-2 font-bold text-gray-800">
          {subHeading}
        </h4>
      )}

      <h1 className={`text-4xl font-bold ${primaryTextColor || 'text-gray-700' }`}>
        {mainHeading}
      </h1>
    </div>
  );
};

export default TopHeading;
