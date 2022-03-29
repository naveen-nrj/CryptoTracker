import React, { useEffect, useState } from 'react';
import { CryptoState } from '../context/CryptoContext';
import { Container, Typography, createTheme, ThemeProvider, TextField, TableContainer, LinearProgress, TableHead, TableRow, TableCell, Table, TableBody } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Banner/Carousel';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111"
        },
        fontFamily: "Helvetica"
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold",

        }
    }
}));

const CoinsTable = () => {
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

    const { currency, symbol, coins, loading, fetchCoinsList } = CryptoState();


    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCoinsList();
    }, [currency]);

    const handleSearch = () => {
        return coins.filter((coin) =>
        (
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        ));
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    style={{ margin: 18, fontFamily: "Helvetica" }}
                >
                    Crypto Prices by Market Cap
                </Typography>
                <TextField
                    label="Search for your favourite Crypto!!"
                    variant="outlined"
                    style={{ marginBottom: 20, width: "100%" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                >
                </TextField>

                <TableContainer>
                    {
                        loading ? <LinearProgress style={{ backgroundColor: "gold" }} /> :
                            (
                                <>
                                    <Table>
                                        <TableHead
                                            style={{ backgroundColor: "#EEBC1D" }}>
                                            <TableRow>
                                                {["Rank", "Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                                    <TableCell
                                                        style={{
                                                            color: "black",
                                                            fontWeight: "700",
                                                            fontFamily: "Helvetica",
                                                        }}
                                                        key={head}
                                                        align={head === "Rank" ? "" : "left"}
                                                    >
                                                        {head}
                                                    </TableCell>
                                                ))}

                                            </TableRow>

                                        </TableHead>
                                        <TableBody>
                                            {coins.length ? (
                                                handleSearch()
                                                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                                    .map((row) => {
                                                        const profit = row.price_change_percentage_24h > 0;
                                                        return (
                                                            <TableRow
                                                                onClick={() => navigate(`/coins/${row.id}`)}
                                                                className={classes.row}
                                                                key={row.name}>
                                                                <TableCell
                                                                    style={{
                                                                        fontWeight: 500,
                                                                    }}>
                                                                    {row.market_cap_rank}
                                                                </TableCell>
                                                                <TableCell component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        display: "flex",
                                                                        gap: 15,
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={row.image}
                                                                        alt={row.name}
                                                                        height="30"
                                                                        style={{ marginBottom: 10 }}
                                                                    />
                                                                    <div
                                                                        style={{ display: "flex", flexDirection: "column" }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                textTransform: "uppercase",
                                                                                fontSize: 15,
                                                                            }}
                                                                        >
                                                                            {row.symbol}
                                                                        </span>
                                                                        <span style={{
                                                                            color: "darkgrey"
                                                                        }}>
                                                                            {row.name}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        color: profit > 0 ? "rgb(14,203,129)" : "red",
                                                                    }}
                                                                    align="left"
                                                                >
                                                                    {symbol} {" "}
                                                                    {numberWithCommas(row.current_price.toFixed(2))}

                                                                </TableCell>
                                                                <TableCell
                                                                    style={{
                                                                        color: profit > 0 ? "rgb(14,203,129)" : "red",
                                                                        fontWeight: 500,
                                                                    }}>
                                                                    {profit && "+"}
                                                                    {row.price_change_percentage_24h.toFixed(2)}%
                                                                </TableCell>
                                                                <TableCell
                                                                >
                                                                    {symbol} {" "}
                                                                    {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                            ) : null
                                            }
                                        </TableBody>
                                    </Table>
                                </>
                            )
                    }
                </TableContainer>
                <Pagination
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    classes={{ ul: classes.pagination }}
                    count={(handleSearch()?.length / 10).toFixed(0)}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scroll(0, 450);
                    }}
                />
            </Container>

        </ThemeProvider >
    );
};

export default CoinsTable;