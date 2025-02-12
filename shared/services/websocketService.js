class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.connect();
    }

    connect() {
        this.socket = new WebSocket('ws://localhost:5000');

        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.connect(), 5000);
        };
    }

    handleMessage(message) {
        const { type, data } = message;
        const callbacks = this.listeners.get(type) || [];
        callbacks.forEach(callback => callback(data));
    }

    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);
    }

    unsubscribe(type, callback) {
        const listeners = this.listeners.get(type);
        if (listeners) {
            this.listeners.set(type, listeners.filter(cb => cb !== callback));
        }
    }

    send(type, data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, data }));
        }
    }
}

export const wsService = new WebSocketService(); 