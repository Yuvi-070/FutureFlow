"""
FutureFlow — APEX Trading Terminal
Streamlit entry-point for Hugging Face Spaces (and local use).

Run locally:
    cd huggingface_app
    streamlit run src/future.py

Deep-link query-param support:
    ?page=paper      → Paper Trading
    ?page=analysis   → Technical Analysis
    ?page=screener   → Screener
    ?page=dashboard  → Dashboard
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
    page_title="FutureFlow · APEX Terminal",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── APEX dark-terminal theme ─────────────────────────────────────────────────

st.markdown(
    """
    <style>
    /* ── Base ── */
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #0a0e1a;
        color: #e2e8f0;
        font-family: 'JetBrains Mono', 'Fira Code', monospace, sans-serif;
    }
    [data-testid="stSidebar"] {
        background-color: #0f1623;
        border-right: 1px solid #1e2d45;
    }
    /* ── Headers ── */
    h1, h2, h3, h4 { color: #f1f5f9; letter-spacing: 0.02em; }
    /* ── APEX card ── */
    .apex-card {
        background: linear-gradient(135deg, #0f1623 0%, #131d2e 100%);
        border: 1px solid #1e3a5f;
        border-radius: 0.75rem;
        padding: 1.1rem 1.25rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    .apex-card-title {
        color: #64748b;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-bottom: 0.2rem;
    }
    .apex-card-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #f1f5f9;
    }
    .apex-card-delta { font-size: 0.85rem; font-weight: 600; }
    .apex-positive { color: #22c55e; }
    .apex-negative { color: #ef4444; }
    .apex-neutral  { color: #94a3b8; }
    /* ── Signal card ── */
    .signal-card {
        background: linear-gradient(135deg, #0f1f35 0%, #0a1628 100%);
        border: 1px solid #1e4080;
        border-radius: 0.75rem;
        padding: 1.25rem;
    }
    .signal-badge {
        display: inline-block;
        padding: 0.2rem 0.8rem;
        border-radius: 99px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
    }
    .signal-buy   { background: rgba(34,197,94,0.15);  color: #22c55e; border: 1px solid #22c55e55; }
    .signal-sell  { background: rgba(239,68,68,0.15);  color: #ef4444; border: 1px solid #ef444455; }
    .signal-hold  { background: rgba(234,179,8,0.15);  color: #eab308; border: 1px solid #eab30855; }
    /* ── Confluence bar ── */
    .conf-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem; }
    .conf-label { color: #94a3b8; font-size: 0.78rem; width: 100px; }
    .conf-bar-bg { flex: 1; background: #1e293b; border-radius: 99px; height: 6px; }
    .conf-bar-fill { height: 6px; border-radius: 99px; }
    .conf-value { color: #e2e8f0; font-size: 0.78rem; width: 40px; text-align: right; }
    /* ── Inputs ── */
    .stTextInput input, .stSelectbox div[data-baseweb="select"],
    .stNumberInput input {
        background-color: #131d2e !important;
        color: #e2e8f0 !important;
        border-color: #1e3a5f !important;
    }
    /* ── Metric cards ── */
    [data-testid="stMetric"] {
        background: linear-gradient(135deg, #0f1623 0%, #131d2e 100%);
        border: 1px solid #1e3a5f;
        border-radius: 0.75rem;
        padding: 0.85rem 1rem;
    }
    [data-testid="stMetricValue"] { color: #f1f5f9 !important; }
    /* ── Buttons ── */
    .stButton button {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        letter-spacing: 0.04em;
    }
    .stButton button:hover {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(220,38,38,0.3);
    }
    /* ── DataFrame ── */
    [data-testid="stDataFrame"] {
        background-color: #0f1623;
        border: 1px solid #1e3a5f;
        border-radius: 0.5rem;
    }
    /* ── Divider ── */
    hr { border-color: #1e293b; }
    /* ── Tab active ── */
    button[data-baseweb="tab"][aria-selected="true"] {
        color: #dc2626 !important;
        border-bottom-color: #dc2626 !important;
    }
    /* ── Progress bar ── */
    .stProgress > div > div > div { background-color: #dc2626; }
    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0e1a; }
    ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 99px; }
    /* ── Header banner ── */
    .apex-header {
        background: linear-gradient(90deg, #0f1623 0%, #0a1628 60%, #0d1f38 100%);
        border-bottom: 1px solid #1e3a5f;
        padding: 0.75rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.5rem;
    }
    .apex-logo { color: #dc2626; font-size: 1.4rem; font-weight: 800; letter-spacing: 0.05em; }
    .apex-tagline { color: #64748b; font-size: 0.75rem; }
    .apex-live-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: #22c55e;
        animation: pulse-green 1.5s ease-in-out infinite;
        display: inline-block;
    }
    @keyframes pulse-green {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
        50%       { opacity: 0.7; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
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

HF_SPACE_URL = "https://huggingface.co/spaces/yuvraj0705/Future_Flow"

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


def compute_ai_signal(df: pd.DataFrame) -> tuple[str, float, str]:
    """
    Derive a simple rule-based signal (BUY / SELL / HOLD) with a confidence score.
    Returns (signal, confidence_0_to_1, reason).
    """
    if len(df) < 30:
        return "HOLD", 0.5, "Insufficient data"

    close = df["Close"]
    rsi = float(add_rsi(df).iloc[-1])
    sma20 = float(add_sma(df, 20).iloc[-1])
    sma50 = float(add_sma(df, 50).iloc[-1]) if len(df) >= 50 else float(close.iloc[-1])
    macd_line, signal_line, _ = add_macd(df)
    macd_val = float(macd_line.iloc[-1])
    sig_val = float(signal_line.iloc[-1])
    price = float(close.iloc[-1])

    bullish = 0
    bearish = 0
    reasons = []

    if rsi < 35:
        bullish += 2
        reasons.append("RSI oversold")
    elif rsi > 65:
        bearish += 2
        reasons.append("RSI overbought")

    if price > sma20:
        bullish += 1
        reasons.append("Price > SMA20")
    else:
        bearish += 1

    if sma20 > sma50:
        bullish += 1
        reasons.append("SMA20 > SMA50")
    else:
        bearish += 1

    if macd_val > sig_val:
        bullish += 1
        reasons.append("MACD bullish crossover")
    else:
        bearish += 1

    total = bullish + bearish
    if total == 0:
        return "HOLD", 0.5, "No signal"

    if bullish > bearish:
        conf = bullish / total
        return "BUY", conf, " · ".join(reasons[:3])
    elif bearish > bullish:
        conf = bearish / total
        return "SELL", conf, "Bearish momentum"
    return "HOLD", 0.5, "Neutral momentum"


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
    sma_windows: list,
    ema_windows: list,
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
                fillcolor="rgba(148,163,184,0.06)",
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
                   marker_color=colors_vol, opacity=0.6),
            row=current_row, col=1,
        )
        fig.update_yaxes(title_text="Vol", row=current_row, col=1,
                         title_font_size=10, tickfont_size=9)
        current_row += 1

    # ── RSI
    if show_rsi:
        rsi = add_rsi(df)
        fig.add_trace(
            go.Scatter(x=df.index, y=rsi, name="RSI",
                       line=dict(color="#c084fc", width=1.5)),
            row=current_row, col=1,
        )
        fig.add_hline(y=70, line_dash="dash", line_color="#ef4444", line_width=1,
                      row=current_row, col=1)
        fig.add_hline(y=30, line_dash="dash", line_color="#22c55e", line_width=1,
                      row=current_row, col=1)
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
        paper_bgcolor="#0a0e1a",
        plot_bgcolor="#0a0e1a",
        font=dict(color="#e2e8f0", size=12),
        xaxis_rangeslider_visible=False,
        legend=dict(
            bgcolor="rgba(15,22,35,0.9)",
            bordercolor="#1e3a5f",
            borderwidth=1,
            font_size=11,
        ),
        margin=dict(l=10, r=10, t=30, b=10),
        height=520,
    )
    fig.update_xaxes(
        gridcolor="#131d2e",
        showgrid=True,
        zeroline=False,
        showspikes=True,
        spikecolor="#334155",
        spikethickness=1,
    )
    fig.update_yaxes(
        gridcolor="#131d2e",
        showgrid=True,
        zeroline=False,
    )

    return fig


# ─── Metric card helper ───────────────────────────────────────────────────────


def apex_metric(title: str, value: str, delta: str = "", delta_positive: bool | None = None) -> str:
    """Return HTML for an APEX-style metric card."""
    if delta:
        if delta_positive is True:
            delta_cls = "apex-positive"
        elif delta_positive is False:
            delta_cls = "apex-negative"
        else:
            delta_cls = "apex-neutral"
        delta_html = f'<div class="apex-card-delta {delta_cls}">{delta}</div>'
    else:
        delta_html = ""
    return f"""
    <div class="apex-card">
        <div class="apex-card-title">{title}</div>
        <div class="apex-card-value">{value}</div>
        {delta_html}
    </div>
    """


# ─── Sidebar ──────────────────────────────────────────────────────────────────

PAGE_KEYS = {
    "dashboard": "🏠 Dashboard",
    "analysis":  "📊 Analysis",
    "screener":  "🔍 Screener",
    "paper":     "💼 Paper Trading",
    "about":     "ℹ️ About",
}
PAGE_LIST = list(PAGE_KEYS.values())


def _resolve_default_page() -> str:
    """Return the default page label based on ?page= query param.

    Any exception (e.g. Streamlit version doesn't support query_params, or
    the param value is not a string) is intentionally swallowed so the app
    always falls back to the Dashboard rather than raising on startup.
    """
    try:
        params = st.query_params
        key = params.get("page", "").lower()
        if key in PAGE_KEYS:
            return PAGE_KEYS[key]
    except Exception:  # noqa: BLE001 — safe: always fall back to default page
        pass
    return "🏠 Dashboard"


def render_sidebar() -> str:
    default_page = _resolve_default_page()
    default_idx = PAGE_LIST.index(default_page) if default_page in PAGE_LIST else 0

    with st.sidebar:
        st.markdown(
            """
            <div style="padding:0.5rem 0 0.75rem 0">
                <div style="color:#dc2626;font-size:1.3rem;font-weight:800;
                            letter-spacing:0.05em">📈 FUTUREFLOW</div>
                <div style="color:#64748b;font-size:0.7rem;
                            letter-spacing:0.15em;text-transform:uppercase">
                    APEX Terminal
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.divider()
        page = st.radio(
            "Navigation",
            PAGE_LIST,
            index=default_idx,
            label_visibility="collapsed",
        )
        st.divider()

        # ── Risk controls panel (always visible)
        with st.expander("⚙️ Risk Controls", expanded=False):
            st.number_input(
                "Max Risk per Trade (%)",
                min_value=0.1, max_value=10.0,
                value=float(st.session_state.get("risk_pct", 2.0)),
                step=0.1, key="risk_pct",
            )
            st.number_input(
                "Max Open Positions",
                min_value=1, max_value=50,
                value=int(st.session_state.get("max_positions", 10)),
                step=1, key="max_positions",
            )
            st.number_input(
                "Max Daily Loss (%)",
                min_value=0.1, max_value=20.0,
                value=float(st.session_state.get("max_daily_loss", 5.0)),
                step=0.1, key="max_daily_loss",
            )

        st.divider()
        st.caption("Data via Yahoo Finance · Prices delayed 15 min")
        st.markdown(
            f"<a href='{HF_SPACE_URL}' target='_blank' "
            "style='color:#64748b;font-size:0.7rem;text-decoration:none'>"
            "🌐 HF Space</a>",
            unsafe_allow_html=True,
        )
    return page


# ─── Pages ────────────────────────────────────────────────────────────────────


def page_dashboard():
    st.markdown(
        """
        <div class="apex-header">
            <span class="apex-logo">📈 FUTUREFLOW</span>
            <span class="apex-tagline">Market Dashboard</span>
            <span class="apex-live-dot" title="Live"></span>
        </div>
        """,
        unsafe_allow_html=True,
    )

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
                rows.append({
                    "Ticker": sym,
                    "Price": round(latest, 2),
                    "Change %": round(pct, 2),
                    "Volume": vol,
                })

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
    """Display a DataFrame with background_gradient, falling back gracefully.

    Catches ImportError (matplotlib missing) and ValueError (unknown cmap) which
    are the only exceptions background_gradient raises in practice.
    """
    if _MATPLOTLIB_AVAILABLE:
        try:
            st.dataframe(
                df.style.background_gradient(subset=[subset], cmap=cmap),
                use_container_width=True,
                hide_index=True,
            )
            return
        except (ImportError, ValueError, TypeError):
            pass
    st.dataframe(df, use_container_width=True, hide_index=True)


def page_analysis():
    st.markdown(
        """
        <div class="apex-header">
            <span class="apex-logo">📊 TECHNICAL ANALYSIS</span>
            <span class="apex-tagline">Candlestick · Indicators · Signals</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

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
        c6, _ = st.columns(2)
        show_macd = c6.checkbox("MACD", value=False)

        sma_options = [5, 10, 20, 50, 100, 200]
        ema_options = [9, 21, 50, 200]
        sma_windows = st.multiselect("SMA windows", sma_options, default=[20, 50]) if show_sma else []
        ema_windows = st.multiselect("EMA windows", ema_options, default=[21]) if show_ema else []

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

    # ── AI Signal card + Confluence row (APEX-style)
    signal, conf, reason = compute_ai_signal(df)
    rsi_val = float(add_rsi(df).iloc[-1]) if len(df) > 14 else 50.0
    sma20_val = float(add_sma(df, 20).iloc[-1]) if len(df) >= 20 else latest_price
    sma50_val = float(add_sma(df, 50).iloc[-1]) if len(df) >= 50 else latest_price
    macd_line, sig_line, _ = add_macd(df)
    macd_diff = float(macd_line.iloc[-1]) - float(sig_line.iloc[-1]) if len(df) >= 26 else 0.0

    sig_css = {"BUY": "signal-buy", "SELL": "signal-sell", "HOLD": "signal-hold"}.get(signal, "signal-hold")

    col_sig, col_conf = st.columns([1, 2])

    with col_sig:
        st.markdown(
            f"""
            <div class="signal-card">
                <div style="color:#94a3b8;font-size:0.7rem;text-transform:uppercase;
                            letter-spacing:0.12em;margin-bottom:0.5rem">AI Signal</div>
                <span class="signal-badge {sig_css}">{signal}</span>
                <div style="color:#64748b;font-size:0.75rem;margin-top:0.6rem">{reason}</div>
                <div style="color:#94a3b8;font-size:0.7rem;margin-top:0.4rem">
                    Confidence: <strong style="color:#f1f5f9">{conf*100:.0f}%</strong>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col_conf:
        rsi_pct = int(rsi_val)
        trend_score = int(min(100, max(0, (latest_price - sma50_val) / sma50_val * 100 + 50)))
        macd_score = int(min(100, max(0, 50 + macd_diff / (atr_val + 0.001) * 10)))
        vol_score = 50  # placeholder — could compare against avg vol

        st.markdown(
            f"""
            <div class="apex-card" style="height:100%">
                <div class="apex-card-title">Confluence Indicators</div>
                <div style="margin-top:0.6rem">
                    {_conf_bar("RSI", rsi_pct)}
                    {_conf_bar("Trend", trend_score)}
                    {_conf_bar("MACD", macd_score)}
                    {_conf_bar("Momentum", vol_score)}
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # ── Chart
    fig = build_chart(
        df, ticker,
        show_sma, show_ema, show_bb, show_volume, show_rsi, show_macd,
        sma_windows, ema_windows,
    )
    st.plotly_chart(fig, use_container_width=True)

    # ── Indicator grid (quick stats)
    st.markdown("##### 📐 Indicator Grid")
    ig1, ig2, ig3, ig4 = st.columns(4)
    ig1.metric("RSI (14)", f"{rsi_val:.1f}",
               "Overbought" if rsi_val > 70 else ("Oversold" if rsi_val < 30 else "Neutral"))
    ig2.metric("SMA 20", f"{sma20_val:,.2f}")
    ig3.metric("SMA 50", f"{sma50_val:,.2f}")
    ig4.metric("MACD", f"{macd_diff:+.4f}")

    with st.expander("📋 Price Summary"):
        summary = df["Close"].describe().rename("Close")
        st.dataframe(summary.to_frame().T, use_container_width=True)

    with st.expander("🗂️ Recent OHLCV Data"):
        display_df = df.tail(20).copy()
        display_df.index = display_df.index.strftime("%Y-%m-%d")
        st.dataframe(
            display_df.style.format("{:.2f}", subset=["Open", "High", "Low", "Close"]),
            use_container_width=True,
        )


def _conf_bar(label: str, value: int) -> str:
    """HTML for a single confluence bar row (0–100)."""
    pct = max(0, min(100, value))
    if pct >= 60:
        color = "#22c55e"
    elif pct >= 40:
        color = "#eab308"
    else:
        color = "#ef4444"
    return f"""
    <div class="conf-row">
        <span class="conf-label">{label}</span>
        <div class="conf-bar-bg">
            <div class="conf-bar-fill" style="width:{pct}%;background:{color}"></div>
        </div>
        <span class="conf-value">{pct}</span>
    </div>
    """


def page_screener():
    st.markdown(
        """
        <div class="apex-header">
            <span class="apex-logo">🔍 STOCK SCREENER</span>
            <span class="apex-tagline">Filter by technical criteria</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

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
            signal, conf, _ = compute_ai_signal(df)
            results.append({
                "Ticker": sym,
                "Price": round(latest, 2),
                "Change %": round(pct, 2),
                "RSI": round(rsi_val, 1),
                "SMA 20": round(sma20, 2),
                "Above SMA20": "✅" if above_sma20 else "❌",
                "Trend": trend,
                "Signal": signal,
                "Confidence": f"{conf*100:.0f}%",
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

STARTING_CAPITAL = 100_000.0


def _init_portfolio():
    defaults = {
        "portfolio": {},          # {ticker: {"qty": int, "avg_price": float, "entry_date": str}}
        "cash": STARTING_CAPITAL,
        "trade_log": [],          # list of order dicts
        "daily_start_value": STARTING_CAPITAL,
        "risk_pct": 2.0,
        "max_positions": 10,
        "max_daily_loss": 5.0,
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val


def _check_risk(cost: float, portfolio: dict, cash: float) -> tuple[bool, str]:
    """Check risk controls before executing a BUY order."""
    # Max positions
    max_pos = int(st.session_state.get("max_positions", 10))
    if len(portfolio) >= max_pos:
        return False, f"Max open positions ({max_pos}) reached."

    # Max risk per trade (use starting capital as reference for risk %)
    risk_pct = float(st.session_state.get("risk_pct", 2.0))
    max_risk_amount = STARTING_CAPITAL * risk_pct / 100
    if cost > max_risk_amount * 10:  # soft informational warning only; not blocking
        pass

    # Max daily loss — compare current cash + known avg-price value of holdings vs daily start
    holdings_book_value = sum(
        info["qty"] * info["avg_price"] for info in portfolio.values()
    )
    current_value = cash + holdings_book_value
    max_daily_loss_pct = float(st.session_state.get("max_daily_loss", 5.0))
    daily_start = float(st.session_state.get("daily_start_value", STARTING_CAPITAL))
    daily_loss_pct = (daily_start - current_value) / daily_start * 100
    if daily_loss_pct >= max_daily_loss_pct:
        return False, (
            f"Max daily loss limit ({max_daily_loss_pct:.1f}%) reached. "
            f"Daily P&L: {-daily_loss_pct:.2f}%"
        )

    return True, ""


def page_paper_trading():
    st.markdown(
        """
        <div class="apex-header">
            <span class="apex-logo">💼 PAPER TRADING</span>
            <span class="apex-tagline">Virtual ₹1,00,000 · Zero Risk</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    _init_portfolio()

    portfolio: dict = st.session_state["portfolio"]
    cash: float = st.session_state["cash"]
    trade_log: list = st.session_state["trade_log"]

    # ── Portfolio summary metrics
    total_invested = 0.0
    total_current = 0.0
    holdings_rows = []

    for sym, info in portfolio.items():
        df_h = fetch_data(sym, "5d", "1d")
        current_price = float(df_h["Close"].iloc[-1]) if not df_h.empty else info["avg_price"]
        invested = info["qty"] * info["avg_price"]
        current = info["qty"] * current_price
        pnl = current - invested
        pnl_pct = pnl / invested * 100 if invested else 0
        total_invested += invested
        total_current += current
        holdings_rows.append({
            "Symbol": sym,
            "Qty": info["qty"],
            "Avg Price": round(info["avg_price"], 2),
            "CMP": round(current_price, 2),
            "P&L ₹": round(pnl, 2),
            "P&L %": round(pnl_pct, 2),
            "Entry Date": info.get("entry_date", "—"),
        })

    total_pnl = total_current - total_invested
    portfolio_value = cash + total_current
    pnl_pct_total = total_pnl / STARTING_CAPITAL * 100

    mc1, mc2, mc3, mc4, mc5 = st.columns(5)
    mc1.metric("Cash", f"₹{cash:,.2f}")
    mc2.metric("Invested", f"₹{total_current:,.2f}")
    mc3.metric("Total P&L", f"₹{total_pnl:,.2f}", f"{pnl_pct_total:+.2f}%")
    mc4.metric("Portfolio Value", f"₹{portfolio_value:,.2f}")
    mc5.metric("Open Positions", str(len(portfolio)))

    # ── Risk status bar
    risk_pct_used = len(portfolio) / max(1, int(st.session_state.get("max_positions", 10))) * 100
    daily_loss_pct = float(st.session_state.get("max_daily_loss", 5.0))
    daily_start = float(st.session_state.get("daily_start_value", STARTING_CAPITAL))
    daily_pnl_pct = (portfolio_value - daily_start) / daily_start * 100
    st.markdown(
        f"""
        <div class="apex-card" style="margin-bottom:1rem">
            <div class="apex-card-title">Risk Dashboard</div>
            <div style="display:flex;gap:2rem;margin-top:0.5rem;flex-wrap:wrap">
                <div>
                    <span style="color:#64748b;font-size:0.75rem">Positions Used</span>
                    <div style="color:#f1f5f9;font-weight:700">{len(portfolio)} / {int(st.session_state.get('max_positions',10))}</div>
                </div>
                <div>
                    <span style="color:#64748b;font-size:0.75rem">Daily P&L</span>
                    <div style="color:{'#22c55e' if daily_pnl_pct>=0 else '#ef4444'};font-weight:700">
                        {daily_pnl_pct:+.2f}%
                    </div>
                </div>
                <div>
                    <span style="color:#64748b;font-size:0.75rem">Daily Loss Limit</span>
                    <div style="color:#f1f5f9;font-weight:700">{daily_loss_pct:.1f}%</div>
                </div>
                <div>
                    <span style="color:#64748b;font-size:0.75rem">Max Risk/Trade</span>
                    <div style="color:#f1f5f9;font-weight:700">
                        {float(st.session_state.get('risk_pct',2.0)):.1f}%
                    </div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── Tabs
    tab_trade, tab_positions, tab_orders, tab_history = st.tabs(
        ["📝 Place Order", "📂 Positions", "📋 Orders", "📒 Trade History"]
    )

    # ── Tab: Place Order
    with tab_trade:
        with st.form("trade_form"):
            col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
            sym = col1.text_input("Symbol", value="RELIANCE.NS").upper().strip()
            qty = col2.number_input("Quantity", min_value=1, value=10, step=1)
            action = col3.selectbox("Action", ["BUY", "SELL"])
            col4.write("")
            col4.write("")
            submitted = col4.form_submit_button("⚡ Execute", use_container_width=True)

        if submitted and sym:
            df_t = fetch_data(sym, "5d", "1d")
            if df_t.empty:
                st.error(f"Could not fetch price for **{sym}**.")
            else:
                price = float(df_t["Close"].iloc[-1])
                total = price * qty

                if action == "BUY":
                    if total > cash:
                        st.error(f"Insufficient cash! Need ₹{total:,.2f}, have ₹{cash:,.2f}.")
                    else:
                        ok, reason = _check_risk(total, portfolio, cash)
                        if not ok:
                            st.error(f"⛔ Risk control blocked trade: {reason}")
                        else:
                            if sym in portfolio:
                                old_qty = portfolio[sym]["qty"]
                                old_avg = portfolio[sym]["avg_price"]
                                new_qty = old_qty + qty
                                portfolio[sym] = {
                                    "qty": new_qty,
                                    "avg_price": (old_avg * old_qty + price * qty) / new_qty,
                                    "entry_date": portfolio[sym].get("entry_date", str(datetime.date.today())),
                                }
                            else:
                                portfolio[sym] = {
                                    "qty": qty,
                                    "avg_price": price,
                                    "entry_date": str(datetime.date.today()),
                                }
                            st.session_state["cash"] -= total
                            trade_log.append({
                                "Date": str(datetime.date.today()),
                                "Time": datetime.datetime.now().strftime("%H:%M:%S"),
                                "Action": "BUY",
                                "Symbol": sym,
                                "Qty": qty,
                                "Price": round(price, 2),
                                "Total": round(total, 2),
                                "Status": "FILLED",
                            })
                            st.success(f"✅ Bought {qty} × {sym} @ ₹{price:.2f}")
                            st.rerun()

                else:  # SELL
                    if sym not in portfolio or portfolio[sym]["qty"] < qty:
                        st.error(f"Not enough shares of **{sym}** to sell.")
                    else:
                        avg_cost = portfolio[sym]["avg_price"]
                        pnl_trade = (price - avg_cost) * qty
                        portfolio[sym]["qty"] -= qty
                        if portfolio[sym]["qty"] == 0:
                            del portfolio[sym]
                        st.session_state["cash"] += total
                        trade_log.append({
                            "Date": str(datetime.date.today()),
                            "Time": datetime.datetime.now().strftime("%H:%M:%S"),
                            "Action": "SELL",
                            "Symbol": sym,
                            "Qty": qty,
                            "Price": round(price, 2),
                            "Total": round(total, 2),
                            "P&L": round(pnl_trade, 2),
                            "Status": "FILLED",
                        })
                        st.success(f"✅ Sold {qty} × {sym} @ ₹{price:.2f} | P&L: ₹{pnl_trade:+,.2f}")
                        st.rerun()

        # Quick-buy helper: show signal for entered symbol
        if "sym" in dir() and sym:
            df_preview = fetch_data(sym, "3mo", "1d")
            if not df_preview.empty:
                sig, conf, rsn = compute_ai_signal(df_preview)
                sig_css = {"BUY": "signal-buy", "SELL": "signal-sell", "HOLD": "signal-hold"}.get(sig, "signal-hold")
                st.markdown(
                    f"""
                    <div style="margin-top:0.5rem">
                        <span style="color:#64748b;font-size:0.75rem">AI Signal for {sym}: </span>
                        <span class="signal-badge {sig_css}">{sig}</span>
                        <span style="color:#64748b;font-size:0.72rem;margin-left:0.5rem">
                            {conf*100:.0f}% · {rsn}
                        </span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # ── Tab: Positions
    with tab_positions:
        if holdings_rows:
            df_hold = pd.DataFrame(holdings_rows)
            st.dataframe(df_hold, use_container_width=True, hide_index=True)
        else:
            st.info("No open positions. Place a trade to get started.")

    # ── Tab: Orders
    with tab_orders:
        orders = [t for t in trade_log if t.get("Status") == "FILLED"]
        if orders:
            st.dataframe(
                pd.DataFrame(orders).sort_values(["Date", "Time"], ascending=False),
                use_container_width=True,
                hide_index=True,
            )
        else:
            st.info("No orders yet.")

    # ── Tab: Trade History / Journal
    with tab_history:
        sells = [t for t in trade_log if t.get("Action") == "SELL"]
        if sells:
            df_hist = pd.DataFrame(sells)
            total_realised = df_hist.get("P&L", pd.Series(dtype=float)).sum() if "P&L" in df_hist.columns else 0.0
            st.metric("Realised P&L", f"₹{total_realised:,.2f}")
            st.dataframe(df_hist.sort_values(["Date", "Time"], ascending=False),
                         use_container_width=True, hide_index=True)
        else:
            st.info("No completed trades yet.")

    st.divider()
    if st.button("🔄 Reset Portfolio", type="secondary"):
        for key in ("portfolio", "cash", "trade_log", "daily_start_value"):
            st.session_state.pop(key, None)
        st.rerun()


def page_about():
    st.markdown(
        """
        <div class="apex-header">
            <span class="apex-logo">ℹ️ ABOUT</span>
            <span class="apex-tagline">FutureFlow APEX Terminal</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(
        f"""
        <div style="background:linear-gradient(135deg,#0f1623,#131d2e);
                    border-radius:1rem;padding:2rem;border:1px solid #1e3a5f">
            <h2 style="color:#dc2626">📈 FutureFlow — APEX Trading Terminal</h2>
            <p style="color:#94a3b8;font-size:1.05rem">
                FutureFlow is an intelligent stock market analysis platform built for traders
                and investors who want data-driven insights at their fingertips.
            </p>
            <a href="{HF_SPACE_URL}" target="_blank"
               style="display:inline-block;margin-top:0.75rem;padding:0.5rem 1.25rem;
                      background:#dc2626;color:white;border-radius:0.5rem;
                      text-decoration:none;font-weight:600">
               🚀 Open on Hugging Face
            </a>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("---")
    cols = st.columns(3)
    features = [
        ("📊", "Technical Analysis", "Candlestick charts with SMA, EMA, Bollinger Bands, RSI & MACD."),
        ("🔍", "Stock Screener", "Filter stocks by RSI, price change % and trend direction."),
        ("💼", "Paper Trading", "Simulate trades with virtual ₹1,00,000 — zero real money at risk."),
        ("🏠", "Dashboard", "Live snapshot of major indices and today's top gainers/losers."),
        ("🤖", "AI Signals", "Rule-based signals with confluence scoring across multiple indicators."),
        ("⚙️", "Risk Controls", "Configurable max risk per trade, position limits & daily loss cap."),
    ]
    for i, (icon, title, desc) in enumerate(features):
        with cols[i % 3]:
            st.markdown(
                f"""
                <div class="apex-card">
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
        | Colour maps | matplotlib |
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
