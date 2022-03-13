import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import { TrendingCoins } from '../../config/apis';
import { CryptoState } from '../../context/CryptoContext';

const useStyles = makeStyles(() => ({

    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center",
        fontFamily: "Helvetica",

    },

    carouselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
        fontFamily: "Helvetica",

    }

}));

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
    const classes = useStyles();
    const responsive = {
        0: {
            items: 2
        },
        512: {
            items: 4
        }
    }
    const {
        currency,
        symbol,
    } = CryptoState();

    const [trending, setTrending] = useState([]);

    const items = trending.map((coin) => {
        let profit = coin.price_change_percentage_24h >= 0;
        return (
            <Link
                className={classes.carouselItem}
                to={`/coins/${coin.id}`}
            >
                <img
                    src={coin?.image}
                    alt={coin.name}
                    height="80"
                    style={{ marginBottom: 10 }}
                />
                <span>{coin?.symbol} &nbsp;
                    <span
                        style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                        }}
                    >{profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%</span>
                </span>
                <span style={{ fontSize: 22, fontWeight: 500 }}>
                    {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}

                </span>
            </Link>
        )
    });
    useEffect(() => {
        const fetchTrendingCoins = async () => {
            const { data } = await axios.get(TrendingCoins(currency));
            setTrending(data);
        }
        fetchTrendingCoins();
    }, [currency]);

    return (
        <div className={classes.carousel}>
            <AliceCarousel
                mouseTracking
                infinite
                autoPlayInterval={1000}
                animationDuration={1500}
                disableDotsControls
                disableButtonsControls
                responsive={responsive}
                autoPlay
                items={items} />

        </div>
    );
};

export default Carousel;