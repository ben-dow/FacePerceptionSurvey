import {AppBar, BottomNavigation, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  CssBaseline,
  createMuiTheme
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AdminView from './AdminDisplays/AdminView';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
        <Route path="/admin">
          <AdminView/>
        </Route>
        <Route path="/admin/*">
          <AdminView/>
        </Route>
        <Route path ="/" exact>
          <App />
        </Route>
        <Route> 
          <Redirect to="/"/>
        </Route>
        </Switch>

      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

