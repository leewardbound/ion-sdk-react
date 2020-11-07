import React from 'react'

export const BroadcastContext = React.createContext({
    constraints: {audio: true, video: true, simulcast: true},
    setConstraints: null,
    getUserMedia: null,
    setLocalStream: null,
    localStream: null
})
export const useBroadcast = () => React.useContext(BroadcastContext)