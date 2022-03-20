import { AppBar, Box, Button, Container, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import HomeView from './HomeView';
import QuestionView from './QuestionView';
import QuestionViewOfResponses from './QuestionViewOfResponses';
import ResponseView from './ResponseView';
import ResponseViewOfQuestions from './ResponseViewOfQuestions';
import Cookies from 'universal-cookie';


var _ = require('lodash');
const cookies = new Cookies();


function loginReducer(state, action){
    switch(action.type){
        case 'username':
            return {...state, 'username': action.payload}
        case 'password':
            return {...state, 'password': action.payload}

    }
}

function AdminView(props) {

    const [token, setToken] = useState("");
    const [loginInformation, loginDispatch] = useReducer(loginReducer, {username:"", password:""})

    useEffect(() => {
        let cookieToken = cookies.get("token");
        axios.post('/api/verifytoken/', { token:cookieToken }).then((response) => { setToken(cookieToken) })
    }, [])


    let login = function(){
        axios.post('/api/login/', {username:loginInformation.username, password:loginInformation.password }).then((response) => {setToken(response.data.token); cookies.set('token',response.data.token) })
    }

    let logout = function(){
        cookies.remove('token')
        setToken("")
        loginDispatch({type:"username", payload:""})
        loginDispatch({type:"password", payload:""})

    }


    if (token != "") {


        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Link component={Button} to="/admin">Home</Link>
                        <Link component={Button} to="/admin/responses">Responses</Link>
                        <Link component={Button} to="/admin/questions">Questions</Link>
                        <Button onClick={logout}>Logout</Button>
                    </Toolbar>
                </AppBar>

                <Switch>
                    <Route exact path="/admin/responses">
                        <ResponseView token={token}/>
                    </Route>
                    <Route exact path="/admin/questions">
                        <QuestionView />
                    </Route>
                    <Route exact path="/admin">
                        <HomeView token={token} />
                    </Route>
                    <Route exact path="/admin/responses/:id">
                        <ResponseViewOfQuestions token={token}/>
                    </Route>
                    <Route exact path="/admin/question/:id">
                        <QuestionViewOfResponses token={token}/>
                    </Route>
                </Switch>
            </div>

        );
    }
    else {
        return (
            <Container maxWidth="xs">
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <form >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Username"
                                            name="username"
                                            size="small"
                                            variant="outlined"
                                            value={loginInformation.username}
                                            onChange={(e)=>{loginDispatch({type:"username", payload: e.target.value})}}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            size="small"
                                            type="password"
                                            variant="outlined"
                                            value={loginInformation.password}
                                            onChange={(e)=>{loginDispatch({type:"password", payload: e.target.value})}}

                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Button color="secondary" fullWidth onClick={login} variant="contained">
                                    Log in
            </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        )
    }

}



export default AdminView;
