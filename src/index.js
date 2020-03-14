import React from 'react';
import { render } from 'react-dom';
import FlexMenu from './FlexMenu';

const App = () => (
  <div className="container">
    <FlexMenu>
      <a href="/">Menu Item 1</a>
      <a href="/">Menu Item 2</a>
      <a href="/">Menu Item 3</a>
      <a href="/">Menu Item 4</a>
      <a href="/">Menu Item 5</a>
      <a href="/">Menu Item 6</a>
      <a href="/">Menu Item 7</a>
      <a href="/">Menu Item 8</a>
    </FlexMenu>
  </div>
);

render(<App />, document.getElementById('root'));
