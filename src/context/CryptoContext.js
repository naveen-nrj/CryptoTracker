import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CoinList } from '../config/apis';
import { auth, db } from '../firebase';

const Crypto = createContext();

const CryptoContext = ({ children }) => {

    const [currency, setCurrency] = useState("USD");
    const [symbol, setSymbol] = useState("$");
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: ""
    })

    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "watchlist", user.uid);
            const unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setWatchlist(coin.data().coins);
                } else {
                    console.log("No items in Watchlist");
                }
            });
            return () => {
                unsubscribe();
            }
        }

    }, [user])
    const fetchCoinsList = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false);

    };

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) setUser(user);
            else setUser(null)
        });
    }, [])

    useEffect(() => {
        if (currency === "INR") {
            setSymbol("₹");
        } else if (currency === "USD") {
            setSymbol("$")
        }
    }, [currency]);

    return (
        <Crypto.Provider
            value={{ currency, symbol, setCurrency, coins, loading, fetchCoinsList, alert, setAlert, user, watchlist }}
        >
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;


export const CryptoState = () => {
    return useContext(Crypto);
}