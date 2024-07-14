import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [clients, setClients] = useState([]);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);

  const usernameInputRef = useRef(null);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleConnect = () => {
    if (username) {
      usernameInputRef.current.disabled = true;
      console.log(username);
      socket = io("http://localhost:3035/", {
        query: { username, hobbie: "programming" },
      });
      socket.on("connect", () => {
        setIsConnected(true);
      });
    } else {
      alert("You must enter a username value");
    }
  };

  const handleDisconnect = () => {
    setUsername("");
    usernameInputRef.current.disabled = false;

    if (socket) {
      socket.disconnect();
      setIsConnected(false);
    }
  };

  const createRoom = (client) => {
    console.log("Create Room...");
    const targetUsername = client;
    console.log("targetUsername:", targetUsername);
    socket.emit("createRoom", targetUsername);
  };

  const sendMessage = (content) => {
    socket.emit("message", { room, content });
  };

  useEffect(() => {
    if (isConnected) {
      socket.on("clients", (clients) => {
        setClients(clients.filter((client) => client !== username));
      });

      socket.on("roomJoined", (room) => {
        setRoom(room);
      });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("clients");
        socket.off("roomJoined");
        socket.off("message");
      };
    }
  }, [isConnected, username]);

  return (
    <div>
      <div>
        <h3>Ingreso</h3>
        <input
          type="text"
          ref={usernameInputRef}
          onChange={handleUsername}
          value={username || ""}
        ></input>

        {isConnected ? (
          <button onClick={handleDisconnect}>Desconectar</button>
        ) : (
          <button onClick={handleConnect}>Conectar</button>
        )}
      </div>
      {isConnected && (
        <div>
          <div>
            <h3>Clientes Conectados</h3>
            <ul>
              {clients.map((client, index) => (
                <li key={index} onClick={() => createRoom(client)}>
                  {client}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Chat</h2>
            <div>
              {messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.from}:</strong> {message.content}
                </div>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(e.target.value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
