"use client";

import { useRef, useState } from "react";
import { CALENDLY_URL } from "../constants";

export default function BannerSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const handleBookCall = () => {
    // Open Calendly in a new window/tab
    window.open(CALENDLY_URL, "_blank");
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggle mute clicked"); // Debug log
    console.log("Current video ref:", videoRef.current); // Debug log
    console.log("Current isMuted state:", isMuted); // Debug log

    if (videoRef.current) {
      const newMutedState = !isMuted;
      console.log("Setting video muted to:", newMutedState); // Debug log
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      console.log("State updated to:", newMutedState); // Debug log

      // Force update the video element
      if (newMutedState) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = 1;
      }
    } else {
      console.log("Video ref not available"); // Debug log
    }
  };

  const handleVideoError = (e) => {
    console.error("Video failed to load:", e);
    setVideoError(true);
  };

  return (
    <section
      className="banner-section position-relative d-flex align-items-end min-vh-100"
      style={{ paddingTop: "100px" }}
    >
      <video
        ref={videoRef}
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        onLoadedData={() => {
          console.log("Video loaded, setting initial mute state");
          if (videoRef.current) {
            videoRef.current.muted = isMuted;
          }
        }}
        onError={handleVideoError}
        onCanPlay={() => console.log("Video can play")}
      >
        <source
          src="https://res.cloudinary.com/df9ie3937/video/upload/v1758086789/CTG_post_no_ctg_post_final_frfr_1080p_wqz9lz.mp4"
          type="video/mp4"
        />
        <source
          src="/assets/images/backgrounds/banner-video.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support the video */}
        <p className="text-white text-center">
          Your browser does not support the video tag.
        </p>
      </video>

      {videoError && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
          <p className="text-white text-center">
            Video failed to load. Using fallback background.
          </p>
        </div>
      )}

      <div className="container">
        <div className="d-flex flex-column gap-4 pb-8 position-relative z-1">
          <div
            className="d-flex align-items-end gap-3"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="1000"
          >
            <h1 className="mb-0 fs-16 text-white lh-1"></h1>
          </div>
          <div
            className="subheading-section"
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-duration="1000"
            style={{ marginTop: "24px" }}
          >
            <p className="mb-0 text-white fs-5 text-opacity-90 leading-relaxed">
            </p>
          </div>
          <div
            className="d-flex align-items-center gap-4 position-relative"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="1000"
          >
            <p className="mb-0 text-white text-opacity-70 fs-6">
            </p>

            {/* Mute/Unmute Button - Positioned in bottom right */}
            <button
              type="button"
              onClick={toggleMute}
              className="btn btn-sm btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center position-absolute"
              style={{
                zIndex: 1000,
                width: "40px",
                height: "40px",
                cursor: "pointer",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              title={isMuted ? "Unmute video" : "Mute video"}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              <iconify-icon
                icon={isMuted ? "lucide:volume-x" : "lucide:volume-2"}
                className="fs-6"
                style={{ pointerEvents: "none" }}
              ></iconify-icon>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
