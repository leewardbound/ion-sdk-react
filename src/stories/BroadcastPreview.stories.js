import React from 'react';

import {BroadcastPreview} from '../components';
import IonUserMediaProvider from "../components/IonUserMediaProvider";

export default {
  title: 'BroadcastPreview',
  component: BroadcastPreview,
};

const Template = (args) => <IonUserMediaProvider><BroadcastPreview width={400} {...args} /></IonUserMediaProvider>

export const Preview = Template.bind({});
Preview.args = {
};