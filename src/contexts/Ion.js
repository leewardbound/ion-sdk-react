import React from 'react'

export const IonContext = React.createContext(null)
export const useIon = () => React.useContext(IonContext)