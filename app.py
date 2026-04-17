"""
FutureFlow — Stock Market Analyzer
Streamlit entry-point for Hugging Face Spaces (and local use).

Run locally:
    streamlit run app.py
"""

import datetime
import warnings

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
import yfinance as yf
from plotly.subplots import make_subplots

try:
    import matplotlib  # noqa: F401
    _MATPLOTLIB_AVAILABLE = True
except ImportError:
    _MATPLOTLIB_AVAILABLE = False

warnings.filterwarnings("ignore")

# ─── Page configuration ───────────────────────────────────────────────────────

st.set_page_config(
    page_title="FutureFlow · Stock Analyzer",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Global dark-terminal theme ───────────────────────────────────────────────

st.markdown(
    """
    <style>
    /* ── Base ── */
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #0f172a;
        color: #e2e8f0;
    }
    [data-testid="stSidebar"] {
        background-color: #1e293b;
    }
    /* ── Headers ── */
    h1, h2, h3, h4 { color: #f1f5f9; }
    /* ── Inputs ── */
    .stTextInput input, .stSelectbox div[data-baseweb="select"],
    .stNumberInput input {
        background-color: #1e293b;
        color: #e2e8f0;
        border-color: #334155;
    }
    /* ── Metric cards ── */
    [data-testid="stMetric"] {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
    }
    /* ── Buttons ── */
    .stButton button {
        background-color: #dc3545;
        color: white;
        border-radius: 0.5rem;
        border: none;
    }
    .stButton button:hover { background-color: #b91c2a; }
    /* ── DataFrame ── */
    [data-testid="stDataFrame"] { background-color: #1e293b; }
    /* ── Divider ── */
    hr { border-color: #334155; }
    /* ── Tab active ── */
    button[data-baseweb="tab"][aria-selected="true"] {
        color: #dc3545 !important;
        border-bottom-color: #dc3545 !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ─── Constants ────────────────────────────────────────────────────────────────

POPULAR_TICKERS = [
    "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
    "WIPRO.NS", "BAJFINANCE.NS", "SBIN.NS", "LT.NS", "ADANIENT.NS",
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX",
    "BTC-USD", "ETH-USD",
]

SCREENER_TICKERS = [
    "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
    "WIPRO.NS", "BAJFINANCE.NS", "SBIN.NS", "AAPL", "MSFT", "GOOGL",
    "AMZN", "TSLA", "NVDA",
]

# ─── Helpers / Indicators ─────────────────────────────────────────────────────


@st.cache_data(ttl=300, show_spinner=False)
def fetch_data(ticker: str, period: str, interval: str) -> pd.DataFrame:
    """Download OHLCV data from Yahoo Finance with caching."""
    try:
        df = yf.download(ticker, period=period, interval=interval, progress=False, auto_adjust=True)
        if df.empty:
            return pd.DataFrame()
        df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
        df.dropna(inplace=True)
        return df
    except Exception as exc:  # noqa: BLE001
        st.error(f"Error fetching data for **{ticker}**: {exc}")
        return pd.DataFrame()


def add_sma(df: pd.DataFrame, window: int) -> pd.Series:
    return df["Close"].rolling(window=window).mean()


def add_ema(df: pd.DataFrame, window: int) -> pd.Series:
    return df["Close"].ewm(span=window, adjust=False).mean()


def add_rsi(df: pd.DataFrame, window: int = 14) -> pd.Series:
    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(window).mean()
    loss = (-delta.clip(upper=0)).rolling(window).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def add_macd(df: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = df["Close"].ewm(span=fast, adjust=False).mean()
    ema_slow = df["Close"].ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram


def add_bollinger(df: pd.DataFrame, window: int = 20, num_std: float = 2.0):
    mid = df["Close"].rolling(window).mean()
    std = df["Close"].rolling(window).std()
    return mid + num_std * std, mid, mid - num_std * std


def add_atr(df: pd.DataFrame, window: int = 14) -> pd.Series:
    high_low = df["High"] - df["Low"]
    high_close = (df["High"] - df["Close"].shift()).abs()
    low_close = (df["Low"] - df["Close"].shift()).abs()
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    return tr.rolling(window).mean()


# ─── Chart builder ────────────────────────────────────────────────────────────


def build_chart(
    df: pd.DataFrame,
    ticker: str,
    show_sma: bool,
    show_ema: bool,
    show_bb: bool,
    show_volume: bool,
    show_rsi: bool,
    show_macd: bool,
    sma_windows: list[int],
    ema_windows: list[int],
) -> go.Figure:
    """Build a multi-panel candlestick chart with optional indicators."""
    row_count = 1
    row_heights = [0.55]
    if show_volume:
        row_count += 1
        row_heights.append(0.15)
    if show_rsi:
        row_count += 1
        row_heights.append(0.15)
    if show_macd:
        row_count += 1
        row_heights.append(0.15)

    fig = make_subplots(
        rows=row_count,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.03,
        row_heights=row_heights,
    )

    # ── Candlestick
    fig.add_trace(
        go.Candlestick(
            x=df.index,
            open=df["Open"],
            high=df["High"],
            low=df["Low"],
            close=df["Close"],
            name=ticker,
            increasing_line_color="#22c55e",
            decreasing_line_color="#ef4444",
        ),
        row=1, col=1,
    )

    # ── SMA
    if show_sma:
        colors = ["#facc15", "#fb923c", "#a78bfa"]
        for i, w in enumerate(sma_windows):
            sma = add_sma(df, w)
            fig.add_trace(
                go.Scatter(x=df.index, y=sma, name=f"SMA {w}",
                           line=dict(color=colors[i % len(colors)], width=1.5)),
                row=1, col=1,
            )

    # ── EMA
    if show_ema:
        colors = ["#38bdf8", "#34d399", "#f472b6"]
        for i, w in enumerate(ema_windows):
            ema = add_ema(df, w)
            fig.add_trace(
                go.Scatter(x=df.index, y=ema, name=f"EMA {w}",
                           line=dict(color=colors[i % len(colors)], width=1.5, dash="dot")),
                row=1, col=1,
            )

    # ── Bollinger Bands
    if show_bb:
        upper, mid, lower = add_bollinger(df)
        for series, name, dash in [
            (upper, "BB Upper", "dash"),
            (mid, "BB Mid", "solid"),
            (lower, "BB Lower", "dash"),
        ]:
            fig.add_trace(
                go.Scatter(x=df.index, y=series, name=name,
                           line=dict(color="#94a3b8", width=1, dash=dash)),
                row=1, col=1,
            )
        fig.add_trace(
            go.Scatter(
                x=pd.concat([df.index.to_series(), df.index.to_series()[::-1]]),
                y=pd.concat([upper, lower[::-1]]),
                fill="toself",
                fillcolor="rgba(148,163,184,0.07)",
                line=dict(color="rgba(0,0,0,0)"),
                name="BB Band",
                showlegend=False,
            ),
            row=1, col=1,
        )

    current_row = 2

    # ── Volume
    if show_volume:
        colors_vol = [
            "#22c55e" if c >= o else "#ef4444"
            for c, o in zip(df["Close"], df["Open"])
        ]
        fig.add_trace(
            go.Bar(x=df.index, y=df["Volume"], name="Volume",
                   marker_color=colors_vol, opacity=0.7),
            row=current_row, col=1,
        )
        fig.update_yaxes(title_text="Vol", row=current_row, col=1,
                         title_font_size=10, tickfont_size=9)
        current_row += 1

    # ── RSI
    if show_rsi:
        rsi = add_rsi(df)
        fig.add_trace(
            go.Scatter(x=df.index, y=rsi, name="RSI", line=dict(color="#c084fc", width=1.5)),
            row=current_row, col=1,
        )
        fig.add_hline(y=70, line_dash="dash", line_color="#ef4444", line_width=1, row=current_row, col=1)
        fig.add_hline(y=30, line_dash="dash", line_color="#22c55e", line_width=1, row=current_row, col=1)
        fig.update_yaxes(title_text="RSI", range=[0, 100], row=current_row, col=1,
                         title_font_size=10, tickfont_size=9)
        current_row += 1

    # ── MACD
    if show_macd:
        macd_line, signal_line, histogram = add_macd(df)
        hist_colors = ["#22c55e" if v >= 0 else "#ef4444" for v in histogram]
        fig.add_trace(
            go.Bar(x=df.index, y=histogram, name="MACD Hist",
                   marker_color=hist_colors, opacity=0.6),
            row=current_row, col=1,
        )
        fig.add_trace(
            go.Scatter(x=df.index, y=macd_line, name="MACD",
                       line=dict(color="#38bdf8", width=1.5)),
            row=current_row, col=1,
        )
        fig.add_trace(
            go.Scatter(x=df.index, y=signal_line, name="Signal",
                       line=dict(color="#f59e0b", width=1.5)),
            row=current_row, col=1,
        )
        fig.update_yaxes(title_text="MACD", row=current_row, col=1,
                         title_font_size=10, tickfont_size=9)

    # ── Layout
    fig.update_layout(
        paper_bgcolor="#0f172a",
        plot_bgcolor="#0f172a",
        font=dict(color="#e2e8f0", size=12),
        xaxis_rangeslider_visible=False,
        legend=dict(
            bgcolor="rgba(30,41,59,0.8)",
            bordercolor="#334155",
            borderwidth=1,
            font_size=11,
        ),
        margin=dict(l=10, r=10, t=30, b=10),
        height=680,
    )
    fig.update_xaxes(
        gridcolor="#1e293b",
        showgrid=True,
        zeroline=False,
        showspikes=True,
        spikecolor="#64748b",
        spikethickness=1,
    )
    fig.update_yaxes(
        gridcolor="#1e293b",
        showgrid=True,
        zeroline=False,
    )

    return fig


# ─── Sidebar ──────────────────────────────────────────────────────────────────


def render_sidebar():
    with st.sidebar:
        st.markdown(
            "<h2 style='color:#dc3545;margin-bottom:0'>📈 FutureFlow</h2>"
            "<p style='color:#94a3b8;font-size:0.8rem'>Stock Market Analyzer</p>",
            unsafe_allow_html=True,
        )
        st.divider()
        page = st.radio(
            "Navigation",
            ["🏠 Dashboard", "📊 Analysis", "🔍 Screener", "💼 Paper Trading", "ℹ️ About"],
            label_visibility="collapsed",
        )
        st.divider()
        st.caption("Data via Yahoo Finance · Prices delayed 15 min")
    return page


# ─── Pages ────────────────────────────────────────────────────────────────────


def page_dashboard():
    st.title("🏠 Dashboard")
    st.markdown("Real-time snapshot of key market indices and movers.")

    watchlist = ["^NSEI", "^BSESN", "^GSPC", "^DJI", "^IXIC", "BTC-USD"]
    labels = ["Nifty 50", "Sensex", "S&P 500", "Dow Jones", "NASDAQ", "Bitcoin"]

    cols = st.columns(len(watchlist))
    for col, sym, lbl in zip(cols, watchlist, labels):
        with col:
            with st.spinner(""):
                df = fetch_data(sym, "5d", "1d")
            if not df.empty and len(df) >= 2:
                latest = float(df["Close"].iloc[-1])
                prev = float(df["Close"].iloc[-2])
                pct = (latest - prev) / prev * 100
                col.metric(lbl, f"{latest:,.2f}", f"{pct:+.2f}%")
            else:
                col.metric(lbl, "N/A", "—")

    st.divider()

    st.subheader("Top Gainers & Losers (Today)")
    quick_tickers = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "WIPRO.NS",
        "AAPL", "MSFT", "TSLA", "NVDA", "AMZN",
    ]
    rows = []
    with st.spinner("Loading market data…"):
        for sym in quick_tickers:
            df = fetch_data(sym, "5d", "1d")
            if not df.empty and len(df) >= 2:
                latest = float(df["Close"].iloc[-1])
                prev = float(df["Close"].iloc[-2])
                vol = int(df["Volume"].iloc[-1]) if "Volume" in df.columns else 0
                pct = (latest - prev) / prev * 100
                rows.append({"Ticker": sym, "Price": round(latest, 2), "Change %": round(pct, 2), "Volume": vol})

    if rows:
        df_summary = pd.DataFrame(rows).sort_values("Change %", ascending=False)

        gainers = df_summary.head(5)
        losers = df_summary.tail(5)

        col1, col2 = st.columns(2)
        with col1:
            st.markdown("#### 🟢 Gainers")
            _safe_display_with_gradient(gainers, "Change %", "Greens")
        with col2:
            st.markdown("#### 🔴 Losers")
            _safe_display_with_gradient(losers, "Change %", "Reds_r")


def _safe_display_with_gradient(df: pd.DataFrame, subset: str, cmap: str) -> None:
    """Display a DataFrame with background_gradient, falling back gracefully if matplotlib is absent."""
    if _MATPLOTLIB_AVAILABLE:
        try:
            st.dataframe(
                df.style.background_gradient(subset=[subset], cmap=cmap),
                use_container_width=True,
                hide_index=True,
            )
            return
        except Exception:  # noqa: BLE001
            pass
    st.dataframe(df, use_container_width=True, hide_index=True)


def page_analysis():
    st.title("📊 Technical Analysis")

    # ── Controls
    col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
    with col1:
        ticker = st.text_input(
            "Ticker Symbol",
            value="RELIANCE.NS",
            placeholder="e.g. AAPL, RELIANCE.NS, BTC-USD",
        ).upper().strip()
    with col2:
        period = st.selectbox("Period", ["1mo", "3mo", "6mo", "1y", "2y", "5y"], index=2)
    with col3:
        interval = st.selectbox("Interval", ["1d", "1wk", "1mo", "1h"], index=0)
    with col4:
        st.write("")
        st.write("")
        fetch_btn = st.button("🔄 Fetch", use_container_width=True)

    # ── Indicator toggles
    with st.expander("⚙️ Indicators", expanded=True):
        c1, c2, c3, c4, c5 = st.columns(5)
        show_sma = c1.checkbox("SMA", value=True)
        show_ema = c2.checkbox("EMA", value=False)
        show_bb = c3.checkbox("Bollinger Bands", value=False)
        show_volume = c4.checkbox("Volume", value=True)
        show_rsi = c5.checkbox("RSI", value=True)
        c6, c7 = st.columns(2)
        show_macd = c6.checkbox("MACD", value=False)

        sma_options = [5, 10, 20, 50, 100, 200]
        ema_options = [9, 21, 50, 200]
        sma_windows = st.multiselect("SMA windows", sma_options, default=[20, 50]) if show_sma else []
        ema_windows = st.multiselect("EMA windows", ema_options, default=[21]) if show_ema else []

    # ── Data fetch
    if not ticker:
        st.info("Enter a ticker symbol to begin.")
        return

    with st.spinner(f"Fetching {ticker}…"):
        df = fetch_data(ticker, period, interval)

    if df.empty:
        st.warning(f"No data returned for **{ticker}**. Check the symbol and try again.")
        return

    # ── Key metrics
    latest_price = float(df["Close"].iloc[-1])
    prev_price = float(df["Close"].iloc[-2]) if len(df) > 1 else latest_price
    change = latest_price - prev_price
    pct_change = change / prev_price * 100
    high_52w = float(df["High"].max())
    low_52w = float(df["Low"].min())
    avg_vol = int(df["Volume"].mean()) if "Volume" in df.columns else 0
    atr_val = float(add_atr(df).iloc[-1]) if len(df) > 14 else 0.0

    mc1, mc2, mc3, mc4, mc5 = st.columns(5)
    mc1.metric("Price", f"{latest_price:,.2f}", f"{pct_change:+.2f}%")
    mc2.metric("52W High", f"{high_52w:,.2f}")
    mc3.metric("52W Low", f"{low_52w:,.2f}")
    mc4.metric("Avg Volume", f"{avg_vol:,}")
    mc5.metric("ATR (14)", f"{atr_val:.2f}")

    # ── Chart
    fig = build_chart(
        df, ticker,
        show_sma, show_ema, show_bb, show_volume, show_rsi, show_macd,
        sma_windows, ema_windows,
    )
    st.plotly_chart(fig, use_container_width=True)

    # ── Summary stats
    with st.expander("📋 Price Summary"):
        summary = df["Close"].describe().rename("Close")
        st.dataframe(summary.to_frame().T, use_container_width=True)

    # ── Recent data table
    with st.expander("🗂️ Recent OHLCV Data"):
        display_df = df.tail(20).copy()
        display_df.index = display_df.index.strftime("%Y-%m-%d")
        st.dataframe(display_df.style.format("{:.2f}", subset=["Open", "High", "Low", "Close"]),
                     use_container_width=True)


def page_screener():
    st.title("🔍 Stock Screener")
    st.markdown("Filter stocks by technical criteria.")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        min_rsi = st.slider("Min RSI", 0, 100, 0)
    with col2:
        max_rsi = st.slider("Max RSI", 0, 100, 100)
    with col3:
        min_chg = st.slider("Min Change %", -20.0, 0.0, -5.0, step=0.5)
    with col4:
        max_chg = st.slider("Max Change %", 0.0, 20.0, 5.0, step=0.5)

    tickers_input = st.text_area(
        "Tickers to screen (comma-separated)",
        value=", ".join(SCREENER_TICKERS),
    )
    tickers = [t.strip().upper() for t in tickers_input.split(",") if t.strip()]

    if st.button("🔍 Run Screener", use_container_width=True):
        results = []
        progress = st.progress(0, text="Screening…")
        for i, sym in enumerate(tickers):
            progress.progress((i + 1) / len(tickers), text=f"Analyzing {sym}…")
            df = fetch_data(sym, "3mo", "1d")
            if df.empty or len(df) < 15:
                continue
            latest = float(df["Close"].iloc[-1])
            prev = float(df["Close"].iloc[-2])
            pct = (latest - prev) / prev * 100
            rsi_val = float(add_rsi(df).iloc[-1])
            sma20 = float(add_sma(df, 20).iloc[-1])
            sma50 = float(add_sma(df, 50).iloc[-1]) if len(df) >= 50 else float("nan")
            above_sma20 = latest > sma20
            trend = "Bullish" if (not np.isnan(sma50) and sma20 > sma50) else "Bearish"
            results.append({
                "Ticker": sym,
                "Price": round(latest, 2),
                "Change %": round(pct, 2),
                "RSI": round(rsi_val, 1),
                "SMA 20": round(sma20, 2),
                "Above SMA20": "✅" if above_sma20 else "❌",
                "Trend": trend,
            })
        progress.empty()

        if not results:
            st.warning("No results matched the criteria or data was unavailable.")
            return

        df_res = pd.DataFrame(results)
        filtered = df_res[
            (df_res["RSI"] >= min_rsi)
            & (df_res["RSI"] <= max_rsi)
            & (df_res["Change %"] >= min_chg)
            & (df_res["Change %"] <= max_chg)
        ]
        st.success(f"Found **{len(filtered)}** of **{len(df_res)}** stocks matching filters.")
        st.dataframe(filtered, use_container_width=True, hide_index=True)


# ─── Paper Trading ────────────────────────────────────────────────────────────


def _init_portfolio():
    if "portfolio" not in st.session_state:
        st.session_state["portfolio"] = {}  # {ticker: {"qty": int, "avg_price": float}}
    if "cash" not in st.session_state:
        st.session_state["cash"] = 100_000.0
    if "trade_log" not in st.session_state:
        st.session_state["trade_log"] = []


def page_paper_trading():
    st.title("💼 Paper Trading Simulator")
    st.markdown("Practice trading with virtual ₹1,00,000 starting capital — no real money at risk.")

    _init_portfolio()

    portfolio: dict = st.session_state["portfolio"]
    cash: float = st.session_state["cash"]
    trade_log: list = st.session_state["trade_log"]

    # ── Trade Form
    with st.form("trade_form"):
        col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
        sym = col1.text_input("Symbol", value="RELIANCE.NS").upper().strip()
        qty = col2.number_input("Quantity", min_value=1, value=10, step=1)
        action = col3.selectbox("Action", ["BUY", "SELL"])
        col4.write("")
        col4.write("")
        submitted = col4.form_submit_button("Execute", use_container_width=True)

    if submitted and sym:
        df = fetch_data(sym, "5d", "1d")
        if df.empty:
            st.error(f"Could not fetch price for **{sym}**.")
        else:
            price = float(df["Close"].iloc[-1])
            total = price * qty

            if action == "BUY":
                if total > cash:
                    st.error(f"Insufficient cash! Need ₹{total:,.2f}, have ₹{cash:,.2f}.")
                else:
                    if sym in portfolio:
                        old_qty = portfolio[sym]["qty"]
                        old_avg = portfolio[sym]["avg_price"]
                        new_qty = old_qty + qty
                        portfolio[sym] = {
                            "qty": new_qty,
                            "avg_price": (old_avg * old_qty + price * qty) / new_qty,
                        }
                    else:
                        portfolio[sym] = {"qty": qty, "avg_price": price}
                    st.session_state["cash"] -= total
                    trade_log.append({
                        "Time": datetime.datetime.now().strftime("%H:%M:%S"),
                        "Action": "BUY",
                        "Symbol": sym,
                        "Qty": qty,
                        "Price": round(price, 2),
                        "Total": round(total, 2),
                    })
                    st.success(f"✅ Bought {qty} × {sym} @ ₹{price:.2f}")

            else:  # SELL
                if sym not in portfolio or portfolio[sym]["qty"] < qty:
                    st.error(f"Not enough shares of **{sym}** to sell.")
                else:
                    portfolio[sym]["qty"] -= qty
                    if portfolio[sym]["qty"] == 0:
                        del portfolio[sym]
                    st.session_state["cash"] += total
                    trade_log.append({
                        "Time": datetime.datetime.now().strftime("%H:%M:%S"),
                        "Action": "SELL",
                        "Symbol": sym,
                        "Qty": qty,
                        "Price": round(price, 2),
                        "Total": round(total, 2),
                    })
                    st.success(f"✅ Sold {qty} × {sym} @ ₹{price:.2f}")

        st.rerun()

    # ── Portfolio Summary
    st.divider()
    st.subheader("📂 Holdings")

    cash = st.session_state["cash"]
    portfolio = st.session_state["portfolio"]

    total_invested = 0.0
    total_current = 0.0
    rows = []
    for sym, info in portfolio.items():
        df = fetch_data(sym, "5d", "1d")
        current_price = float(df["Close"].iloc[-1]) if not df.empty else info["avg_price"]
        invested = info["qty"] * info["avg_price"]
        current = info["qty"] * current_price
        pnl = current - invested
        pnl_pct = pnl / invested * 100 if invested else 0
        total_invested += invested
        total_current += current
        rows.append({
            "Symbol": sym,
            "Qty": info["qty"],
            "Avg Price": round(info["avg_price"], 2),
            "Current Price": round(current_price, 2),
            "P&L": round(pnl, 2),
            "P&L %": round(pnl_pct, 2),
        })

    total_pnl = total_current - total_invested
    portfolio_value = cash + total_current

    mc1, mc2, mc3, mc4 = st.columns(4)
    mc1.metric("Cash", f"₹{cash:,.2f}")
    mc2.metric("Invested", f"₹{total_current:,.2f}")
    pnl_pct_total = total_pnl / 100_000 * 100  # vs starting capital
    mc3.metric("Total P&L", f"₹{total_pnl:,.2f}", f"{pnl_pct_total:+.2f}%")
    mc4.metric("Portfolio Value", f"₹{portfolio_value:,.2f}")

    if rows:
        df_port = pd.DataFrame(rows)
        st.dataframe(df_port, use_container_width=True, hide_index=True)
    else:
        st.info("No open positions. Use the form above to place a trade.")

    # ── Trade Log
    if trade_log:
        with st.expander("📋 Trade Log"):
            st.dataframe(pd.DataFrame(trade_log), use_container_width=True, hide_index=True)

    if st.button("🔄 Reset Portfolio", type="secondary"):
        for key in ("portfolio", "cash", "trade_log"):
            st.session_state.pop(key, None)
        st.rerun()


def page_about():
    st.title("ℹ️ About FutureFlow")

    st.markdown(
        """
        <div style="background:#1e293b;border-radius:1rem;padding:2rem;border:1px solid #334155">
        <h2 style="color:#dc3545">📈 FutureFlow — Stock Market Analyzer</h2>
        <p style="color:#94a3b8;font-size:1.05rem">
            FutureFlow is an intelligent stock market analysis platform built for traders and investors
            who want data-driven insights at their fingertips.
        </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("---")
    cols = st.columns(3)
    features = [
        ("📊", "Technical Analysis", "Candlestick charts with SMA, EMA, Bollinger Bands, RSI & MACD indicators."),
        ("🔍", "Stock Screener", "Filter stocks by RSI, price change % and trend direction instantly."),
        ("💼", "Paper Trading", "Simulate trades with virtual capital — perfect for practising strategies."),
        ("🏠", "Dashboard", "Live snapshot of major indices and today's top gainers/losers."),
        ("🌐", "Multi-market", "Supports NSE/BSE (India), US markets, and crypto tickers."),
        ("🌙", "Dark Mode UI", "Terminal-style dark aesthetic designed for long trading sessions."),
    ]
    for i, (icon, title, desc) in enumerate(features):
        with cols[i % 3]:
            st.markdown(
                f"""
                <div style="background:#1e293b;border-radius:0.75rem;padding:1.25rem;
                            border:1px solid #334155;margin-bottom:1rem">
                    <h3 style="margin:0;color:#e2e8f0">{icon} {title}</h3>
                    <p style="color:#94a3b8;font-size:0.9rem;margin-top:0.5rem">{desc}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.markdown("---")
    st.markdown(
        """
        **Tech Stack**
        | Layer | Library |
        |-------|---------|
        | UI | Streamlit |
        | Charts | Plotly |
        | Market Data | yfinance (Yahoo Finance) |
        | Numerics | pandas, NumPy |
        | Hosting | Hugging Face Spaces |

        ---
        Made with ❤️ by **Yuvraj** · [GitHub](https://github.com/Yuvi-070) · [HF Space](https://huggingface.co/spaces/yuvraj0705/Future_Flow)
        """,
    )


# ─── Main ─────────────────────────────────────────────────────────────────────


def main():
    page = render_sidebar()

    if page == "🏠 Dashboard":
        page_dashboard()
    elif page == "📊 Analysis":
        page_analysis()
    elif page == "🔍 Screener":
        page_screener()
    elif page == "💼 Paper Trading":
        page_paper_trading()
    elif page == "ℹ️ About":
        page_about()


if __name__ == "__main__":
    main()
