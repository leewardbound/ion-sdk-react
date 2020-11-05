import React from 'react';

import {IonProvider} from '../components';

export default {
  title: 'IonProvider',
  component: IonProvider,
};

const Template = (args) => <IonProvider debug {...args} />;

export const JSONRPC = Template.bind({});
JSONRPC.args = {
};