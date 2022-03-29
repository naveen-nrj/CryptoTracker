import { AppBar, Container, MenuItem, Toolbar, Typography, Select, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { CryptoState } from '../context/CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "gold",
        fontFamily: "Helvetica",
        fontWeight: "bold",
        cursor: "pointer",
    }
}));


const Header = () => {
    const classes = useStyles();

    const navigate = useNavigate();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#ffff",

            },
            type: 'dark',
        },
    });

    const {
        currency,
        setCurrency,
        user
    } = CryptoState();



    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar color="transparent" position='static'>
                <Container>
                    <Toolbar>

                        <Typography
                            onClick={() => navigate("/")}
                            className={classes.title}
                            variant="h6"
                        >
                            Crypto Tracker
                        </Typography>
                        <Select
                            variant="outlined"
                            style={{
                                width: 100,
                                height: 40,
                                marginRight: 15,
                            }}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"INR"}>INR</MenuItem>
                        </Select>
                        {
                            user ? <UserSidebar /> : <AuthModal />

                        }
                    </Toolbar>
                </Container>

            </AppBar>
        </ThemeProvider>

    );
};

export default Header;