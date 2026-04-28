const KEY_ID = import.meta.env.VITE_ALPACA_KEY_ID;
const SECRET_KEY = import.meta.env.VITE_ALPACA_SECRET_KEY;
const WS_URL = 'wss://stream.data.alpaca.markets/v2/iex';

type PriceUpdateCallback = (symbol: string, price: number, change: number, changePercent: number) => void;

let socket: WebSocket | null = null;
let prevPrices: Record<string, number> = {};

export function connectAlpacaStream(symbols: string[], onUpdate: PriceUpdateCallback) {
  if (socket) socket.close();

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    // Authenticate
    socket?.send(JSON.stringify({
      action: 'auth',
      key: KEY_ID,
      secret: SECRET_KEY,
    }));
  };

  socket.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    for (const msg of messages) {
      // After auth success, subscribe to symbols
      if (msg.T === 'success' && msg.msg === 'authenticated') {
        socket?.send(JSON.stringify({
          action: 'subscribe',
          trades: symbols,
        }));
      }

      // Handle trade updates
      if (msg.T === 't') {
        const symbol = msg.S;
        const price = msg.p;
        const prev = prevPrices[symbol];
        const change = prev ? price - prev : 0;
        const changePercent = prev ? (change / prev) * 100 : 0;
        prevPrices[symbol] = price;
        onUpdate(symbol, price, change, changePercent);
      }
    }
  };

  socket.onerror = (err) => console.error('Alpaca WS error:', err);
  socket.onclose = () => console.log('Alpaca WS closed');

  return () => socket?.close();
}

export function disconnectAlpacaStream() {
  socket?.close();
  socket = null;
}
