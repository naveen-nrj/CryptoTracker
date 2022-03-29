import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from "./components/Header";
import CoinsPage from './pages/CoinsPage';
import HomePage from "./pages/HomePage";
import { makeStyles } from "@material-ui/core";
import Alert from "./components/Alert"

const useStyles = makeStyles(() => ({
    App: {
        backgroundColor: "#14161a",
        color: "white",
        minHeight: "100vh",
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <BrowserRouter>
            <div className={classes.App}>
                <Header />
                <Routes>
                    <Route path="/coins/:id" element={<CoinsPage />} />
                    <Route exact path="/" element={<HomePage />} />
                </Routes>

            </div>
            <Alert />
        </BrowserRouter >
    )
}
export default App;