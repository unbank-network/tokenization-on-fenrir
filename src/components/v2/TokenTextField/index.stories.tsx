import React from 'react';
import { State } from 'react-powerplug';
// import { ComponentMeta } from '@storybook/react';

// import { withCenterStory } from 'stories/decorators';
import { TokenTextField } from '.';

// export default {
//   title: 'Components/TokenTextField',
//   component: TokenTextField,
//   decorators: [withCenterStory({ width: 600 })],
//   parameters: {
//     backgrounds: {
//       default: 'Paper',
//     },
//   },
// } as ComponentMeta<typeof TokenTextField>;

const initialData: { value: string } = { value: '' };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        tokenSymbol="usdt"
        value={state.value}
        onChange={value => setState({ value })}
      />
    )}
  </State>
);

// export const WithMaxTokens = () => (
//   <State initial={initialData}>
//     {({ state, setState }) => (
//       <TokenTextField
//         tokenSymbol="fnr"
//         value={state.value}
//         onChange={value => setState({ value })}
//         max="10"
//       />
//     )}
//   </State>
// );

export const WithRightMaxButtonLabel = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        tokenSymbol="usdt"
        value={state.value}
        onChange={value => setState({ value })}
        max="10"
        rightMaxButtonLabel="80% limit"
      />
    )}
  </State>
);
