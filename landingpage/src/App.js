import React from 'react';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import Routes from './routes';
import {MATOMO_ID} from './environment/current.js'

const instance = createInstance({
  urlBase: 'https://matomo.doneviz.com',
  siteId: MATOMO_ID,
});

function App() {
  return (
    <MatomoProvider value={instance}>
      <Routes/>
    </MatomoProvider>
  );
}

export default App;
