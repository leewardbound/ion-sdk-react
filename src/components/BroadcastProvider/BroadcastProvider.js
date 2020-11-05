import React from "react";
import {LocalStream} from 'ion-sdk-js'
import { BroadcastContext, useBroadcast } from "../../contexts";

export default function BroadcastProvider({children, stream, audio, video, simulcast, options}) {
    const [constraints, setContstraints] = React.useState({audio, video, simulcast})
    const [localStream, setLocalStream] = React.useState(stream)

    async function getUserMedia() {
        console.debug('getUserMedia', constraints, options)
        const attached = await LocalStream.getUserMedia(constraints, options);
        setLocalStream(attached)
        return attached;
    }

    const broadcast = {
        constraints, setContstraints, getUserMedia, setLocalStream, localStream
    }
    return <BroadcastContext.Provider value={broadcast}>
        {children}
    </BroadcastContext.Provider>
}