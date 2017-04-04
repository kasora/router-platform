import React from 'react';
import { render } from 'react-dom';
import HomePageController from './controller/HomePageController';

render((
    <HomePageController />
), document.querySelector('div#main'));