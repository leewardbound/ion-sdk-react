import React from 'react'

import {Client} from 'ion-sdk-js'
import {IonSFUJSONRPCSignal} from 'ion-sdk-js/lib/signal/json-rpc-impl';


import {IonContext, useUserMedia} from '../../contexts'

export default function IonProvider({children, ...props}) {
    const [sid, setSid] = React.useState(props.sid)
    const [status, setStatus] = React.useState()
    const [signal, setSignal] = React.useState(props.signal ? props.signal : new IonSFUJSONRPCSignal(props.address || "ws://localhost:7000/ws"))
    const [config, setConfig] = React.useState(props.config)
    const [client, setClient] = React.useState()

    const {localStream} = useUserMedia();

    const hasTransports = Object.keys(client?.transports || {}).length === 2
    const pub = hasTransports ? client.transports[0] : null
    const sub = hasTransports ? client.transports[1] : null

    const publisherConnectionState = pub?.pc?.connectionState
    const subscriberConnectionState = sub?.pc?.connectionState
    const publisherSignalingState = pub?.pc?.signalingState
    const subscriberSignalingState = sub?.pc?.signalingState

    React.useEffect(() => {
        if (!signal) return
        let _client = new Client(signal, config)

        setClient(_client)
    }, [signal,])

    React.useEffect(updateStatus,
        [publisherSignalingState, publisherSignalingState, subscriberConnectionState, subscriberSignalingState])

    function updateStatus() {
        setStatus(function (_old) {
            const newState = ({
                ..._old,
                publisherConnectionState,
                publisherSignalingState,
                subscriberConnectionState,
                subscriberSignalingState
            })

            newState.publisherConnectionReady = (publisherConnectionState === 'new' || publisherConnectionState === 'connected')
            newState.publisherSignalingReady = publisherSignalingState === 'stable'
            newState.publisherReady = newState.publisherConnectionReady && newState.publisherSignalingReady

            newState.subscriberConnectionReady = (subscriberConnectionState === 'new' || subscriberConnectionState === 'connected')
            newState.subscriberSignalingReady = subscriberSignalingState === 'stable'
            newState.subscriberReady = newState.subscriberConnectionReady && newState.subscriberSignalingReady

            newState.connectionReady = newState.publisherConnectionReady && newState.subscriberConnectionReady
            newState.signalingReady = newState.publisherSignalingReady && newState.subscriberSignalingReady
            newState.ready = newState.publisherReady && newState.subscriberReady

            console.log("SetStatus")
            return newState
        })
    }


    async function join(join_sid, onTrack) {
        if (!join_sid) return
        if (!signal) {
            throw new Error("Cannot call join before signal is set")
        }
        leave()

        if (onTrack)
            client.ontrack = onTrack

        signal.onopen = () => {
            console.info("joining...",join_sid)
            client.join(join_sid)
        }

        setSid(join_sid)

        setInterval(updateStatus, 2500)
    }

    async function publishUserMedia() {
        client.publish(localStream)
        return localStream
    }

    function leave() {
        if (sid) {
            console.info("Ion Close")
            client.close()
        }
    }

    React.useEffect(() => {
        leave()
    }, [])

    return (
        <IonContext.Provider
            value={{
                client,
                sid,
                join,
                leave,
                publishUserMedia,
                status,
                setClient,
                setSignal,
                setConfig
            }}>
            {children}
        </IonContext.Provider>
    )
}
