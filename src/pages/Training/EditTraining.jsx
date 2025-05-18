import DrawerComponent from "components/DrawerComponent";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import YouTube from "react-youtube";
import { useUpdateTraining } from "hooks/useTraining";
import { toast } from "react-toastify";

const EditTraining = ({ context }) => {
  const location = useLocation();
  const { item } = location.state;
  const history = useHistory();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [videoUrl, setVideoUrl] = useState(item.video_url);
  const [videoUrlError, setVideoUrlError] = useState("");

  const useUpdateTrainingMutation = useUpdateTraining();

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleClose = () => {
    history.goBack();
  };
  const urlParams = new URLSearchParams(videoUrl.split("?")[1]);
  const videoId = urlParams.get("v");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate YouTube URL
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!regex.test(videoUrl)) {
      setVideoUrlError("Please enter a valid YouTube video URL");
      return;
    }
    setVideoUrlError("");

    const body = {
      title,
      description,
      video_url: videoUrl,
      _id: item._id,
    };
    useUpdateTrainingMutation.mutate(body, {
      onSuccess: () => {
        toast.success("Successfully edited training.");
        setVideoUrlError("");
        handleClose();
      },
      onError: (error) => {
        toast.error("Error editing training");
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <DrawerComponent
          isOpen={true}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          title="Edit Training Guide"
          loading={false}
        >
          <div className="overflow-x-hidden">
            <div className="bg-white py-4 flex justify-end md:rounded-bl-xl pr-3">
              <div className="w-full mx-auto max-w-lg">
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="py-3 px-4  w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="description"
                    className="py-3 px-4  w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="videoUrl"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="videoUrl"
                    className="py-3 px-4  w-full border rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:outline-none "
                    placeholder="Enter YouTube video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                  />
                  {videoUrlError && (
                    <p className="text-red-500 text-xs italic">
                      {videoUrlError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr class="my-10" />

          {videoUrl && (
            <YouTube
              videoId={videoId}
              opts={opts}
              className="h-auto lg:h-[250px] "
            />
          )}
        </DrawerComponent>
      </form>
    </>
  );
};

export default EditTraining;
