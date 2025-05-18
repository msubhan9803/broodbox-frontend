import React from 'react';
import CameraIcon from 'assets/icons/CameraIcon';

function ProfilePictureSelector({ imagePreview, error, onImageChange, disabled }) {
  return (
    <>
      <div className="w-[100px] h-[100px] flex items-center justify-center rounded-full overflow-hidden mb-4">
        <button
          type="button"
          className={`w-full h-full rounded-full ${!imagePreview ? 'bg-[#EAEFF9] text-[2rem]' : ''}`}
          onClick={() => document.getElementById("formFile").click()}
          disabled={disabled}
        >
          {!imagePreview ? (
            <CameraIcon className="mx-auto" />
          ) : (
            <img
              src={imagePreview}
              className="w-full h-full object-cover object-center"
              alt="Selected profile"
            />
          )}
        </button>
        <input
          type="file"
          id="formFile"
          className="hidden"
          onChange={onImageChange}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </>
  );
}

export default ProfilePictureSelector;
