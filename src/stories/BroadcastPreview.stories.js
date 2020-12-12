import React from 'react';

import {BroadcastPreview} from '../components';
import IonUserMediaProvider from "../components/IonUserMediaProvider";

export default {
  title: 'BroadcastPreview',
  component: BroadcastPreview,
};

const Template = (args) => <IonUserMediaProvider><div style={{height: 90, width: 160, position: "relative"}}><BroadcastPreview {...args} /></div></IonUserMediaProvider>

export const Preview = Template.bind({});
Preview.args = {
};