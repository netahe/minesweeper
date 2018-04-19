import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {UserMessage} from "./App";
import {shallow, mount, render} from 'enzyme';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders error UserMessage', () => {
    const msg = {type : 'Error', txt : 'this is some error'};

    const div = document.createElement('div');
    ReactDOM.render(<UserMessage msg={msg}/>, div);


    ReactDOM.unmountComponentAtNode(div);
});