## Alpha-Quality Warning

I have only begun to build and test this library; the storybook views leak connections and memory and need cleanup routines.

Use at your own risk.

### Ion React Contexts `src/contexts`

+ IonContext: provides access to ion-sdk-js Client
+ BroadcastContext: provides access to the ion-sdk-js LocalStream for broadcasting
  
### Reusable Ion Components `src/components/`

+ `<IonProvider>`: Wrap your components in an IonProvider to enable `useIon()` hook
+ `<BroadcastProvider audio video simulcast constraints={...} options={{codec: 'vp8'}}>`: Wrap your components in a BroadcastProvider to enable the `useBroadcast()` hook to get the local stream
+ `<VideoView stream={stream}>`: Helper for rendering streams; *TODO* add debug latency / codec / quality overlay
+ `<BroadcastPreview />`: Quickly render your own broadcast stream
+ Broadcast Controls: *TODO* Provide Mute/Unmute handlers for local audio/video


### Running Storybooks

Just `yarn storybook` and you're off to the races! Ensure you have `ion-sfu:jsonrpc` listening on port `:7000` (or plug in your own signalling)

