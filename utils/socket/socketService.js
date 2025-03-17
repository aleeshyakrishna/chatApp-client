import { io } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (!this.socket) {
            this.socket = io("http://localhost:5000", {
                auth: { token }, 
                transports: ["websocket"],
            });

            this.socket.on("connect", () => {
                console.log("✅ Socket connected:", this.socket.id);
            });

            this.socket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });
        }

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
