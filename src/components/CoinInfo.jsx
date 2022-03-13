import { CircularProgress, createTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HistoricalChart } from '../config/apis';
import { CryptoState } from '../context/CryptoContext';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { chartDays } from '../config/data';
import { Chart as ChartJS } from "chart.js/auto";
import SelectButton from './SelectButton';


const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme?.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
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

const CoinInfo = ({ coin }) => {
    const classes = useStyles();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#ffff",

            },
            type: 'dark',
        },
    });
    const { currency } = CryptoState();
    const [chartData, setChartData] = useState([]);
    const [days, setDays] = useState(1);


    useEffect(() => {
        const fetchChartData = async () => {
            const { data } = await axios.get(HistoricalChart(coin?.id, days, currency))
            setChartData(data.prices);
        };
        fetchChartData();
    }, [currency, days, coin?.id]);
    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.container}>
                {
                    !chartData ? (
                        <CircularProgress
                            size={250}
                            thickness={1}
                            style={{ color: "gold" }}
                        />
                    ) : (
                        <>
                            <Line
                                data={{
                                    labels: chartData.map((coin) => {
                                        let date = new Date(coin[0]);
                                        let time =
                                            date.getHours() > 12
                                                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                                : `${date.getHours()}:${date.getMinutes()} AM`;
                                        return days === 1 ? time : date.toLocaleDateString();
                                    }),

                                    datasets: [
                                        {
                                            data: chartData.map((coin) => coin[1]),
                                            label: `Price ( Past ${days} Days ) in ${currency}`,
                                            borderColor: "#EEBC1D",
                                        },
                                    ],
                                }}
                                options={{
                                    elements: {
                                        point: {
                                            radius: 1,
                                        },
                                    },
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 20,
                                    justifyContent: "space-around",
                                    width: "100%",
                                }}
                            >
                                {chartDays.map((day) => (
                                    <SelectButton
                                        key={day.value}
                                        onClick={() => {
                                            setDays(day.value);
                                        }}
                                        selected={day.value === days}
                                    >
                                        {day.label}
                                    </SelectButton>
                                ))}
                            </div>
                        </>
                    )
                }
            </div>
        </ThemeProvider>
    );
};

export default CoinInfo;