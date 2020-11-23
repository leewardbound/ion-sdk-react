import React from "react";

import StoryProvider from "./StoryProvider";

import SimplePeer from "./SimplePeer";

import Grid from "@material-ui/core/Grid";

export default {
  title: "Simple Peer",
  component: SimplePeer,
};

const PeerTemplate = ({ count, ...args }) => {
  const [room, setRoom] = React.useState(
    `room-${Math.ceil(Math.random() * 100)}`
  );
  const [peerStreams, setPeerStreams] = React.useState({})
  const num = count === null ? 1 : count
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <h4>Room: {room}</h4>
      </Grid>
      {Array(num).fill(num).map((n, idx) => (
        <Grid item sm={6} md={4} lg={3} key={idx}>
        <StoryProvider>
          <SimplePeer {...args} room={room} peerStreams={peerStreams} setPeerStreams={setPeerStreams} />
        </StoryProvider>
        </Grid>
      ))}
    </Grid>
  );
};

export const OnePeer = PeerTemplate.bind({});
OnePeer.args = { debug: true };

export const BuddyTest = PeerTemplate.bind({});
BuddyTest.args = { debug: true, count: 4 };
