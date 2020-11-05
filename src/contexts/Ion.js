import React from 'react'
import { useWebsocket } from './websocket'
import studioDuck from 'ducks/studio'
import {useDispatch} from 'react-redux'

export const IonConnectionContext = React.createContext(null)
export const useIonConnection = () => React.useContext(IonConnectionContext)

const google = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
}

export function IonProvider({ children }) {
    const [pc, setPC] = React.useState()
    const dispatch = useDispatch()
    const simulcast = false;
    const setICE = (status) => dispatch(studioDuck.actions.ICE_STATUS_CHANGE(status))

    const socket = useWebsocket()

    function cleanup() {
        pc.close()
    }

    function setUpPC() {
        if (!pc) return setPC(new RTCPeerConnection(google))
        if (!pc || socket.status !== 'ready' || status !== null) return

        pcAddICEHandlers()
    }

    function pcAddICEHandlers() {
        pc.oniceconnectionstatechange = () => {
            setICE(pc.iceConnectionState)
        }
        pc.onicecandidate = (event) => {
            if (event.candidate !== null) {
                const params = {
                    candidate: event.candidate,
                }
                dispatch(studioDuck.actions.SEND_ION_MESSAGE({type: 'trickle', message: params}))
                socket.sendEvent(
                    'ion.trickle',
                    params,
                    { id: Math.random().toString(), jsonrpc: '2.0' }
                )
            }
        }
    }

    function pcAddNegotiation() {
        pc.onnegotiationneeded = async function () {
            console.log('Negotiation needed')
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            const params = { desc: offer }
            const id = Math.random();
            dispatch(studioDuck.actions.SEND_ION_MESSAGE({type: 'offer', message: params, id}))

            try {
                const reply = await socket.rpc_call('ion.offer', params)
                dispatch(studioDuck.actions.GOT_ION_REPLY({id, type: 'answer', message: reply}))
                pc.setRemoteDescription(reply)
            } catch (e) {
                dispatch(studioDuck.actions.GOT_ION_REPLY({id, type: 'error', message: e}))
            }
        }
    }

    function pcAddStreamHandlers() {
        pc.onaddstream = async function(event) {
            console.log('ON ADD STREAM', event)
            dispatch(studioDuck.actions.GOT_REMOTE_STREAM(event.stream))
        }
        pc.onremovestream = async function(stream) {
            console.log('ON remove STREAM', stream)
        }
    }

    async function pcGotOffer(event) {
        dispatch(studioDuck.actions.ON_ION_MESSAGE({type: 'offer', message: event.params}))
        await pc.setRemoteDescription(event.params)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.sendEvent(
            'ion.answer',
            {
                desc: answer,
            },
            { id: Math.random().toString(), jsonrpc: '2.0' }
        )
    }

    async function pcGotAnswer(event) {
        dispatch(studioDuck.actions.ON_ION_MESSAGE({type: 'answer', message: event.params}))
        await pc.setLocalDescription(event.params)
    }

    async function pcGotTrickle(event) {
        dispatch(studioDuck.actions.ON_ION_MESSAGE({type: 'trickle', message: event.params}))
        pc.addIceCandidate(event.params).catch(console.error)
    }

    async function joinHuddle(huddle_id) {
        console.info('Joining huddle...')
        dispatch(studioDuck.actions.JOINING_HUDDLE(huddle_id))

        pc.createDataChannel('ion-sfu')
        pcAddICEHandlers()
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        socket.onEvent('answer', pcGotAnswer)
        socket.onEvent('offer', pcGotOffer)
        socket.onEvent('trickle', pcGotTrickle)

        
        const params = {
            huddle_id,
            offer: pc.localDescription,
        }
        const id = Math.random();
        dispatch(studioDuck.actions.SEND_ION_MESSAGE({type: 'join', message: params, id}))
        try {
            const reply = await socket.rpc_call('huddle.join_huddle', params)
            dispatch(studioDuck.actions.GOT_ION_REPLY({id, type: 'answer', message: reply}))
            pc.setRemoteDescription(reply)
            pcAddNegotiation()
            pcAddStreamHandlers()
        } catch (e) {
            dispatch(studioDuck.actions.GOT_ION_REPLY({id, type: 'error', message: e}))
        }
    }

    function publishStream(stream) {
        if(simulcast)
            pc.addTransceiver(stream.getVideoTracks()[0], {
                streams: [stream],
                direction: 'sendonly',
                sendEncodings: [
                    {
                        rid: 'f',
                    },
                    {
                        rid: 'h',
                        scaleResolutionDownBy: 2.0,
                        maxBitrate: 150000,
                    },
                    {
                        rid: 'q',
                        scaleResolutionDownBy: 4.0,
                        maxBitrate: 100000,
                    },
                ],
            })
        else
            pc.addTrack(stream.getVideoTracks()[0], stream)

        pc.addTrack(stream.getAudioTracks()[0], stream)
    }

    React.useEffect(setUpPC, [socket.status, status])

    return (
        <IonConnectionContext.Provider
            value={{ pc, cleanup, joinHuddle, publishStream }}
        >
            {children}
        </IonConnectionContext.Provider>
    )
}
