import React from 'react'

export function IonProvider({ children, signal, room }) {
    const [ion, setION] = React.useState()
    const [ice, setICE] = React.useState()

    function ConnectIon() {
        if(ion) {
            ion.close();
        }

        setION(new Client(room, signal))
    }

    return (
        <IonContext.Provider
            value={{ ion, ice }}
        >
            {children}
        </IonContext.Provider>
    )
}
