import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";
import video3 from "../../assets/video1(1).mp4";

function VideoPreview({ file }) {
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    if (!file) {
      setVideoURL(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoURL(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4">

      <video
        src={videoURL || video3} // 👈 IMPORTANT
        className="w-full h-[400px] object-cover"
        controls
        autoPlay
        muted
        playsInline
      />

      {/* ADD MUSIC */}
      <button className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal-500/80 px-4 py-2 rounded-full flex items-center gap-2">
        <Music size={16} />
        Add Music
      </button>

      {/* SIDE CONTROLS */}
      <div className="absolute right-2 top-1/3 flex flex-col gap-3">
        <button className="bg-black/50 p-2 rounded">✂</button>
        <button className="bg-black/50 p-2 rounded">🎚</button>
        <button className="bg-black/50 p-2 rounded">CC</button>
      </div>

    </div>
  );
}

export default VideoPreview;