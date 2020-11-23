import React from 'react'
import {Client, IonSFUJSONRPCSignal} from 'ion-sdk-js'
import {IonContext, useIon, useUserMedia} from '../../contexts'

export function IonConnectionStatus() {
    const {connectionState, signalingState, address} = useIon()

    return (
        <div>
            {address || 'Ion'} Status:{' '}
            {connectionState && signalingState
                ? `${connectionState}, ${signalingState}`
                : 'unknown!'}
        </div>
    )
}

export default function IonProvider({children, debug}) {
    const [ion, setIon] = React.useState({
        client: null,
        room: null,
        address: null,
        signal: null,
    })

    const {constraints, setConstraints, localStream} = useUserMedia();

    const pub = ion.client?.transports[0]
    const sub = ion.client?.transports[1]
    const publisherConnectionState = pub?.pc?.connectionState
    const subscriberConnectionState = sub?.pc?.connectionState
    const publisherSignalingState = pub?.pc?.signalingState
    const subscriberSignalingState = sub?.pc?.signalingState

    React.useEffect(() => {
        setIon(function (_old) {
            const newState = ({..._old, publisherConnectionState, publisherSignalingState, subscriberConnectionState, subscriberSignalingState})

            newState.publisherConnectionReady = (publisherConnectionState === 'new' || publisherConnectionState === 'connected')
            newState.publisherSignalingReady = publisherSignalingState === 'stable'
            newState.publisherReady = newState.publisherConnectionReady && newState.publisherSignalingReady

            newState.subscriberConnectionReady = (subscriberConnectionState === 'new' || subscriberConnectionState === 'connected')
            newState.subscriberSignalingReady = subscriberSignalingState === 'stable'
            newState.subscriberReady = newState.subscriberConnectionReady && newState.subscriberSignalingReady

            newState.connectionReady = newState.publisherConnectionReady && newState.subscriberConnectionReady
            newState.signalingReady = newState.publisherSignalingReady && newState.subscriberSignalingReady
            newState.ready = newState.publisherReady && newState.subscriberReady

            return newState
        })
    }, [publisherConnectionState, subscriberConnectionState, publisherSignalingState, subscriberSignalingState])

    function join({signal, room, address, onTrack}) {
        if (!room) return
        if (ion.client) {
            ion.client.close()
        }
        let joinRoom = room || ion.room
        const client = new Client(
            joinRoom,
            signal ||
            new IonSFUJSONRPCSignal(address || 'ws://localhost:7000/ws')
        )
        client.ontrack = onTrack

        setIon({
            room: joinRoom,
            address,
            client,
            signal,
        })
    }

    async function publishUserMedia() {
        ion.client.publish(localStream)
        return localStream
    }

    function leave() {
        if (ion.client) {
            ion.client.close()
        }
    }

    React.useEffect(() => leave, [])

    return (
        <IonContext.Provider value={{...ion, join, leave, publishUserMedia}}>
            {children}
            {debug === true ? <IonConnectionStatus/> : debug}
        </IonContext.Provider>
    )
}
