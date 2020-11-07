import React from 'react'
import { Client, IonSFUJSONRPCSignal } from 'ion-sdk-js'
import { IonContext, useIon } from '../../contexts'

export function IonConnectionStatus() {
    const { connectionState, signalingState, address } = useIon()

    return (
        <div>
            {address || 'Ion'} Status:{' '}
            {connectionState && signalingState
                ? `${connectionState}, ${signalingState}`
                : 'unknown!'}
        </div>
    )
}

export default function IonProvider({ children, debug }) {
    const [ion, setIon] = React.useState({
        client: null,
        room: null,
        address: null,
        signal: null,
    })
    const connectionState = ion.client?.pc?.connectionState
    const signalingState = ion.client?.pc?.signalingState
    React.useEffect(() => {
        if (ion.client) {
            setIon((_old) => ({ ..._old, connectionState, signalingState }))
        }
    }, [connectionState, signalingState])

    function Join({ signal, room, address, onTrack }) {
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

    function Leave() {
        if (ion.client) {
            ion.client.close()
        }
    }

    React.useEffect(() => {
        return Leave
    }, [])

    return (
        <IonContext.Provider value={{ ...ion, Join, Leave }}>
            {children}
            {debug === true ? <IonConnectionStatus /> : debug}
        </IonContext.Provider>
    )
}
