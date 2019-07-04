import React from 'react';
import { Route, Switch } from "react-router-dom"; 

import MainPage from "./components/MainPage";

function App() {
  return (
      <Switch>
        <Route path="/" component={MainPage} />
      </Switch>
  );
}

export default App;
