import { useEffect, useRef } from "react";

export const useWebSocket = (onMessage, onAck) => {
  const socket = useRef(null);
  const queue = useRef([]);
  const pending = useRef({}); // 🔥 store unacknowledged messages

  const connect = () => {
    socket.current = new WebSocket("ws://YOUR_IP:3000");

    socket.current.onopen = () => {
      console.log("✅ Connected");

      // Send queued messages
      queue.current.forEach(msg => send(msg));
      queue.current = [];
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 🔥 Handle ACK
      if (data.type === "ACK") {
        delete pending.current[data.id];
        onAck && onAck(data.id);
        return;
      }

      onMessage(data);
    };

    socket.current.onclose = () => {
      console.log("❌ Disconnected");
      setTimeout(connect, 2000);
    };

    socket.current.onerror = (err) => {
      console.log("Socket error", err.message);
    };
  };

  useEffect(() => {
    connect();
    return () => socket.current?.close();
  }, []);

  // 🔥 SEND WITH RETRY SUPPORT
  const send = (data) => {
    const message = {
      ...data,
      id: data.id || Date.now().toString(),
      timestamp: Date.now(), 
    };

    if (socket.current?.readyState === 1) {
      socket.current.send(JSON.stringify(message));

      // store as pending
      pending.current[message.id] = {
        message,
        retries: 0,
      };

      retry(message.id);
    } else {
      queue.current.push(message);
    }
  };

  // 🔥 RETRY FUNCTION
  const retry = (id) => {
    setTimeout(() => {
      const item = pending.current[id];
      if (!item) return; // ACK received

      if (item.retries >= 3) {
        console.log("❌ Failed after retries:", id);
        delete pending.current[id];
        return;
      }

      console.log("🔁 Retrying:", id);

      socket.current.send(JSON.stringify(item.message));
      item.retries += 1;

      retry(id);
    }, 2000);
  };

  return { send };
};