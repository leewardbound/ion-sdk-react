import React from 'react';

import {BroadcastProvider, BroadcastPreview} from '../components';

export default {
  title: 'BroadcastPreview',
  component: BroadcastPreview,
};

const Template = (args) => <BroadcastProvider debug>
  <BroadcastPreview width={400} {...args} />
</BroadcastProvider>;

export const Preview = Template.bind({});
Preview.args = {
};