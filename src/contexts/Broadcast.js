import React from 'react'

export const BroadcastContext = React.createContext()
export const useBroadcast = () => React.useContext(BroadcastContext)