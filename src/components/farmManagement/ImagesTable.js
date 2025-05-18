import React, { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

export function ImagesTable({ images, setImages }) {
  const handleDelete = (index) => {
    const updatedList = [...images];
    updatedList.splice(index, 1);
    setImages(updatedList);

    console.log("images", images);
  };
  console.log("images", images);
  return (
    <table className="border-collapse border-separate border-0">
      <tbody className="">
        {images &&
          images.length > 0 &&
          images
            .reduce((rows, imageUrl, index) => {
              if (index % 2 === 0) rows.push([]);
              rows[rows.length - 1].push(
                <td key={index} className="py-2">
                  <div className="relative w max-w-[196px] ">
                    <img
                      className="rounded-2xl w-[196px] h-[120px]"
                      src={imageUrl}
                      alt={`Image ${index}`}
                    />
                    <div
                      className="absolute bg-white rounded-full right-2 bottom-3 p-1 cursor-pointer z-20"
                      onClick={() => handleDelete(index)}
                    >
                      <RiDeleteBinLine />
                    </div>
                  </div>
                </td>
              );
              return rows;
            }, [])
            .map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <React.Fragment key={cellIndex}>
                    {cell}
                    {cellIndex < row.length - 1 && ( // Conditionally render padding between cells
                      <td className="py-2 px-2" />
                    )}
                  </React.Fragment>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
}
