import React from "react";
import Card from "@material-ui/core/Card";
import {useIon, useUserMedia} from "../contexts";
import CardHeader from "@material-ui/core/CardHeader";
import VideoView from "../components/VideoView";
import {BroadcastPreview} from "../components";
import {Button} from "@material-ui/core";

export default function SimplePeer({
                                       debug,
                                       publish,
                                       room,
                                       address,
                                       signal,
                                       subscribe,
                                       peerStreams,
                                       setPeerStreams,
                                   }) {
    const ion = useIon();
    const [publishStream, setPublishStream] = React.useState();
    const [peerState, setPeerState] = React.useState("");
    const [name, setName] = React.useState(
        `SimplePeer ${Math.ceil(Math.random() * 100)}`
    );
    const [tracks, setTracks] = React.useState({});
    const [trackStreams, setTrackStreams] = React.useState({});
    const [remoteStreams, setRemoteStreams] = React.useState({});

    React.useEffect(
        function SetupPeer() {
            if (
                ion && !ion.client
            ) {
                console.log("SetupPeer");
                const onTrack = (track, stream) => {
                    console.log("Got track", track, stream, track.id);
                    setTracks((previous) => ({...previous, [track.id]: track}));
                    setTrackStreams((previous) => ({...previous, [track.id]: stream}));
                    setRemoteStreams((previous) => ({...previous, [stream.id]: stream}));
                };
                ion.join({room, address, signal, onTrack})
            }
        },
        [ion]
    );

    async function doPublish() {
        setPeerState("offering");
        const stream = await ion.publishUserMedia();
        setPublishStream(stream)
        setPeerStreams(ps => ({...ps, [stream.id]: name}))
        setPeerState("webcam published!")
    }
    const streamIds = Object.keys(remoteStreams)

    return (
        <Card>
            <div style={{
                display: 'inline-block',
                float: 'right',
                position: 'relative',
                width: '160px',
                height: '90px'
            }}>
                <BroadcastPreview />
            </div>
            <CardHeader
                title={name}
                subheader={
                    debug
                        ? `${peerState} (${ion.ready ? 'ready' : ion.publisherSignalingState})`
                        : null
                }
            />
            <Button color="primary" onClick={doPublish}>Publish Webcam</Button>
            {streamIds.length || "No"} remote streams
            {streamIds.length ? <hr /> : null}
            {streamIds.map((id) => {
                const stream = remoteStreams[id];
                const name = peerStreams[id];
                if (!stream || !subscribe || !name) return null;
                return (
                    <ShowTrack
                        key={id}
                        stream={stream}
                        name={name}
                        debug={debug}
                    />
                );
            })}
        </Card>
    );
}

const ShowTrack = ({stream, name, debug}) => {
    return (
        <>
            <h6>
                {name} {debug ? `- Stream ${stream.id}` : null}
            </h6>
            <VideoView stream={stream} width={300}/>
        </>
    );
};

SimplePeer.defaultProps = {
    publish: true,
    subscribe: true,
};
