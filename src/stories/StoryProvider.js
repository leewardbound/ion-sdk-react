import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles'


import {IonProvider, BroadcastProvider} from "../components"

const theme = createMuiTheme({
    
  });

export default function StoryProvider({children, debug, localStream, address, room, signal}) {
    return <IonProvider debug={debug} address={address} room={room} signal={signal}>
            <BroadcastProvider stream={localStream}>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </BroadcastProvider>
        </IonProvider>
}