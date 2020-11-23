import React from "react";
import {IonUserMediaContext} from "../../contexts";
import {LocalStream} from 'ion-sdk-js'

export default function IonUserMediaProvider({children, stream, audio, video, resolution, codec, simulcast}) {
    const [constraints, setConstraints] = React.useState({
        audio: audio === undefined ? true : audio,
        video: video === undefined ? true : video,
        resolution: resolution === undefined ? 'hd' : resolution,
        codec: codec === undefined ? 'vp8' : codec,
        simulcast: simulcast === undefined ? false: simulcast,
    })
    const [localStream, setLocalStream] = React.useState(stream)

    async function getUserMedia() {
        if(stream) // Allow passing a custom MediaStream through via props
            return LocalStream(stream, constraints);
        const attached = await LocalStream.getUserMedia(constraints);
        console.log('Attached', constraints)
        setLocalStream(attached)
        return attached;
    }

    const userMedia = {
        constraints, setConstraints, getUserMedia, localStream
    }
    return <IonUserMediaContext.Provider value={userMedia}>
        {children}
    </IonUserMediaContext.Provider>
}