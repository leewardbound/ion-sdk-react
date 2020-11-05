import React from "react";
import { Client, IonSFUJSONRPCSignal } from "ion-sdk-js";
import { IonContext, useIon } from "../../contexts";

export function IonConnectionStatus() {
  const {connectionState, signalingState, address} = useIon();

  return (
    <div>
      {address || "Ion"} Status: {connectionState && signalingState ? `${connectionState}, ${signalingState}` : "unknown!"}
    </div>
  );
}

export default function IonProvider({
  children,
  signal,
  address,
  room,
  debug,
}) {
  const [ion, setIon] = React.useState({ client: null });
  const connectionState = ion.client?.pc?.connectionState;
  const signalingState = ion.client?.pc?.signalingState;
  React.useEffect(() => {
    if (ion.client && ion.client.pc) {
      setIon(_old => ({..._old, connectionState, signalingState}))
    }
  }, [connectionState, signalingState]);
  
  function ConnectIon() {
    if (ion.client) {
      ion.client.close();
    }
    if (signal) setIon({ client: new Client(room, signal), address, room});
    else {
      setIon({
        address: address || "ws://localhost:7000/ws",
        room: room,
        client: new Client(
          room,
          new IonSFUJSONRPCSignal(address || "ws://localhost:7000/ws")
        ),
      });
    }
  }

  React.useEffect(() => {
    ConnectIon();
  }, [room, address]);
  

  return (
    <IonContext.Provider value={ion}>
      {children}
      {debug === true ? <IonConnectionStatus /> : debug}
    </IonContext.Provider>
  );
}
