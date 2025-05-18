import BackButton from "components/common/Buttons/BackButton";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import YouTube from "react-youtube";

const ViewTraining = () => {
  const location = useLocation();
  const history = useHistory();

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  function extractYouTubeVideoId(videoUrl) {
    if (!videoUrl || typeof videoUrl !== "string") {
      return null;
    }

    const urlParams = new URLSearchParams(videoUrl.split("?")[1]);

    return urlParams.get("v");
  }

  const { description, message, title, video_url, index } = location.state.item;
  return (
    <div>
      <BackButton />
      <div className="space-y-6">
        <div className="flex space-x-4 items-center my-6">
          <div className="border bg-white border-gray-200 rounded-2xl px-6 py-3 text-2xl font-medium  drop-shadow">
            {parseInt(index) + 1}
          </div>

          <div className="font-medium text-2xl">{title}</div>
        </div>

        <div className="bg-white p-5 px-4 rounded-2xl drop-shadow h-full">
          <YouTube
            videoId={extractYouTubeVideoId(video_url)}
            opts={opts}
            iframeClassName="h-full min-h-[400px]"
          />
        </div>

        <div className="bg-white p-5 px-4 rounded-sm  drop-shadow space-y-4">
          <div className="font-bold">Description</div>
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
};
export default ViewTraining;
