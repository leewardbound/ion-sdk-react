import React from 'react'
import {useBroadcast} from '../../contexts/Broadcast'
import VideoView from '../VideoView'

export default function BroadcastPreview(props) {
    const {localStream, getUserMedia} = useBroadcast();

    React.useEffect(
        () => {
            if(!localStream || !localStream.stream)
                getUserMedia()
        }, []
    )
    if(localStream && localStream.stream)
        return <VideoView stream={localStream.stream} {...props} />
    else
        return <>Requesting video...</>
}