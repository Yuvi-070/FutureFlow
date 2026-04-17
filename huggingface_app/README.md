# FutureFlow — APEX Trading Terminal (Hugging Face App)

> Live on Hugging Face Spaces: <https://huggingface.co/spaces/yuvraj0705/Future_Flow>

This folder contains the **Streamlit trading terminal** that powers the Hugging Face Space.
The marketing website (React / Vite) lives in the repository root.

---

## 📁 Folder Structure

```
huggingface_app/
├── Dockerfile          ← HF Spaces Docker image definition
├── requirements.txt    ← Python dependencies (separate from root)
├── README.md           ← This file
└── src/
    └── future.py       ← Streamlit entry-point
```

---

## 🚀 Run Locally

```bash
# 1. Navigate to this folder
cd huggingface_app

# 2. Create & activate a virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Launch the app
streamlit run src/future.py
```

The app will open at **<http://localhost:8501>**.

### Deep-link query params

Append `?page=<key>` to jump directly to a section:

| Key         | Page              |
|-------------|-------------------|
| `dashboard` | 🏠 Dashboard       |
| `analysis`  | 📊 Analysis        |
| `screener`  | 🔍 Screener        |
| `paper`     | 💼 Paper Trading   |

Example: `http://localhost:8501/?page=paper`

---

## 🐳 Build & Run with Docker

```bash
cd huggingface_app

docker build -t futureflow-apex .
docker run -p 8501:8501 futureflow-apex
```

Then visit **<http://localhost:8501>**.

---

## ☁️ Hugging Face Spaces Deployment

1. Push this entire `huggingface_app/` folder to the HF Space repository **root**.
   (The HF Space repo is separate from this GitHub repo.)
2. HF Spaces auto-detects the `Dockerfile` and builds the image.
3. The entry command in the Dockerfile is:
   ```
   streamlit run src/future.py --server.port=8501 --server.address=0.0.0.0
   ```

> **Note:** When syncing to HF Spaces, copy only the contents of `huggingface_app/`
> (i.e. `Dockerfile`, `requirements.txt`, `src/`) — not the whole GitHub repo.

---

## 🔧 Key Dependencies

| Package       | Purpose                                       |
|---------------|-----------------------------------------------|
| `streamlit`   | Web UI framework                              |
| `yfinance`    | Yahoo Finance market data                     |
| `plotly`      | Interactive candlestick & indicator charts    |
| `pandas`      | Data manipulation                             |
| `numpy`       | Numerical computations                        |
| `matplotlib`  | Required by `pandas.Styler.background_gradient` (fixes HF crash) |

---

## ✨ Features

- **APEX-style dark terminal UI** — gradient cards, signal badges, confluence bars
- **AI Signals** — rule-based BUY / SELL / HOLD with confidence score
- **Technical Analysis** — SMA, EMA, Bollinger Bands, RSI, MACD, ATR
- **Stock Screener** — filter by RSI, price change, trend + AI signal column
- **Paper Trading** — virtual ₹1,00,000, tabbed UI (Place Order / Positions / Orders / History)
- **Risk Controls** — max risk per trade %, max open positions, max daily loss %
- **Deep linking** — `?page=paper` etc.
