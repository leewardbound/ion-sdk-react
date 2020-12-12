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
  const style = {
    ...props.style,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
    objectFit: 'cover',
    bottom: '0',
    right: '0',
  }

  return (
    <video
      ref={videoRef}
      onCanPlay={onCanPlay}
      autoPlay
      playsInline
      {...props}
      style={style}
    />
  );
}
