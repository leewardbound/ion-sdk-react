import React from 'react'
import VideoView from '../VideoView'
import {useUserMedia} from "../../contexts";

export function BroadcastPreview(props) {
    const { localStream, getUserMedia, constraints} = useUserMedia();

    React.useEffect(
        () => {
            if(!localStream)
                getUserMedia()
        }, [localStream, constraints]
    )
    if(localStream)
        return <VideoView stream={localStream} muted {...props} />
    else
        return <>Requesting video...</>
}

export default BroadcastPreview;