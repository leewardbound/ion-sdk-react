import React from "react";
import Card from "@material-ui/core/Card";
import { useIon, useBroadcast } from "../contexts";
import CardHeader from "@material-ui/core/CardHeader";
import VideoView from "../components/VideoView";

export default function SimplePeer({
  debug,
  publish,
  subscribe,
  peerStreams,
  setPeerStreams,
}) {
  const { client, address, connectionState, signalingState } = useIon();
  const [peerState, setPeerState] = React.useState("");
  const { localStream, getUserMedia } = useBroadcast();
  const [name, setName] = React.useState(
    `SimplePeer ${Math.ceil(Math.random() * 100)}`
  );
  const [tracks, setTracks] = React.useState({});
  const [trackStreams, setTrackStreams] = React.useState({});

  React.useEffect(() => {
    if (publish && (!localStream || !localStream.stream)) getUserMedia();
  }, [localStream]);

  React.useEffect(
    function SetupPeer() {
      if (
        client &&
        signalingState === "stable" &&
        peerState === "" &&
        localStream
      ) {

        client.ontrack = (track, stream) => {
          console.log("Got track");
          setTracks((previous) => ({ ...previous, [track.id]: track }));
          setTrackStreams((previous) => ({ ...previous, [track.id]: stream }));
        };

        if (localStream && publish) {
          const id = localStream.stream.id

          setPeerState("offering");
          setPeerStreams((ps) => ({ ...ps, [id]: name }));
          console.log("Publishing", id);        

          client.publish(localStream);
          setPeerState("broadcasting")        
        }
      }
    },
    [client, peerState, signalingState, localStream]
  );

  return (
    <Card>
      <CardHeader
        title={name}
        subheader={
          debug
            ? `${peerState} (${address}: ${connectionState}, ${signalingState})`
            : null
        }
      />
      {Object.keys(tracks).map((id) => {
        const stream = trackStreams[id];
        const name = peerStreams[stream?.id];
        if (!stream || !subscribe || !name) return null;
        return (
          <ShowTrack
            key={id}
            track={tracks[id]}
            stream={stream}
            name={name}
            debug={debug}
          />
        );
      })}
    </Card>
  );
}

const ShowTrack = ({ track, stream, name, debug }) => {
  return (
    <>
      <h6>
        {name} {debug ? `- Track ${track.id}` : null}
      </h6>
      <VideoView stream={stream} width={300} />
    </>
  );
};

SimplePeer.defaultProps = {
  publish: true,
  subscribe: true,
};
