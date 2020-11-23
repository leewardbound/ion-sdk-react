import React from 'react'

export const IonUserMediaContext = React.createContext({
    constraints: {audio: true, video: true},
    setConstraints: null,
    getUserMedia: null,
    localStream: null
})
export const useUserMedia = () => React.useContext(IonUserMediaContext)