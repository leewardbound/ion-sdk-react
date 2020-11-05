import React from "react";

export default function VideoView({ stream, ...props }) {
  const videoRef = React.useRef();

  React.useEffect(() => {
    if (stream && videoRef.current) {
      setTimeout(() => {
        videoRef.current.srcObject = stream;
      }, 500)
    }
  }, [stream]);

  function onCanPlay() {
    videoRef.current.play();
  }

  return (
    <video
      ref={videoRef}
      onCanPlay={onCanPlay}
      autoPlay
      playsInline
      {...props}
    />
  );
}
