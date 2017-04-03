import React from 'react';
import { render } from 'react-dom';
import homePage from './controller/homePage';

render((
    <homePage />
), document.querySelector('div#main'));