import 'react-app-polyfill/ie11'; 
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Providers from "./Providers";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Providers>
    <App/>
  </Providers>
);