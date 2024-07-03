import { useEffect, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";

const socket = io("http://localhost:8083"); // TODO: <--- variable de entorno

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageFromFront, setMessageFromFront] = useState("");
  const [messagesHistory, setMessagesHistory] = useState([]);

  const handleConnection = () => {
    setIsConnected(true);
  };

  const handleNewMessage = (event) => {
    setMessageFromFront(event.target.value);
  };

  useEffect(() => {
    socket.on("connect", handleConnection);
    // socket.emit("join-room", { room: "GENERAL" });
    socket.on("newMessage", (payload) => {
      console.log("En el front recibo:");
      console.log("payload:", payload);
      console.log("messagesHistory:", messagesHistory);
      setMessagesHistory((messagesHistory) => [...messagesHistory, payload]);
    });

    return () => {
      socket.off("connect");
      socket.off("newMessage");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message-sent", {
      client: socket.id,
      room: "GENERAL",
      message: messageFromFront,
    });
  };

  return (
    <>
      <h2>Hola mundo: Chat en tiempo real(socket.io)</h2>
      <p>
        <strong>Frontend:</strong> React/Vite(Javascript + SWC)
        <br />
        <strong>Backend:</strong> Node.js/Nest.JS(TypeScript)
        <br />
      </p>
      <h3>{isConnected ? "Conectado" : "Desconectado"}</h3>
      <div id="chat">
        <input type="text" id="message" onChange={handleNewMessage}></input>
        <button onClick={sendMessage}>Enviar</button>
        <h3>Historial de mensajes:</h3>
        <ul id="chatsUL">
          {messagesHistory.map((payload, index) => (
            <li key={index}>
              {payload.client == socket.id ? 'Yo' : 'Otro'}:{payload.message}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
