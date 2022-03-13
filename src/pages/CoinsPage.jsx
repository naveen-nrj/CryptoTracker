import { LinearProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoinInfo from '../components/CoinInfo';
import { SingleCoin } from '../config/apis';
import { CryptoState } from '../context/CryptoContext';
import parse from "html-react-parser";
import { numberWithCommas } from '../components/Banner/Carousel';
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme?.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center",
        },
    },
    sidebar: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
        width: "30%",
        [theme?.breakpoints.down("md")]: {
            width: "30%",
        },
    },
    heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Helvetica"
    },
    description: {
        width: "100%",
        fontFamily: "Helvetica",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
    },
    marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme?.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-around"
        },
        [theme?.breakpoints.down("sm")]: {
            flexDirection: "column",
            alignItems: "center",
        },
        [theme?.breakpoints.down("xs")]: {
            alignItems: "start",
        },

    }

}
));

const CoinsPage = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [coin, setCoin] = useState();

    const {
        currency, symbol
    } = CryptoState();

    useEffect(() => {

        const fetchCoin = async () => {
            const { data } = await axios.get(SingleCoin(id));
            setCoin(data);
        }
        fetchCoin();

    }, [id]);

    if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />

    return (
        <div className={classes.container}>
            <div className={classes.sidebar}>
                <img
                    src={coin?.image.large}
                    alt={coin?.name}
                    height="200"
                    style={{ marginBottom: 20 }}
                />
                <Typography variant="h3" className={classes.heading}>
                    {coin?.name}
                </Typography>
                <Typography
                    variant="subtitle1"
                    className={classes.description}
                >
                    {parse(coin?.description.en.split(". ")[0])}.
                </Typography>
                <div className={classes.marketData}>
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Rank:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Helvetica" }} >
                            {coin?.market_cap_rank}                        </Typography>
                    </span>
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Current Price:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Helvetica" }} >
                            {symbol} {" "}
                            {numberWithCommas(coin.market_data.current_price[currency.toLowerCase()].toFixed(2))}                       </Typography>
                    </span>
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Market Cap:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Helvetica" }} >
                            {symbol} {" "}
                            {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6)
                            )}{" M"}
                        </Typography>
                    </span>
                </div>
            </div>
            { }
            <CoinInfo coin={coin}></CoinInfo>
        </div>
    );
};

export default CoinsPage;