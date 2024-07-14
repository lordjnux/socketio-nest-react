import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [clients, setClients] = useState([]);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});

  const usernameInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleConnect = () => {
    if (username) {
      usernameInputRef.current.disabled = true;
      console.log(username);
      socket = io("https://c9knnnk6-3035.use2.devtunnels.ms/", {
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

  const sendMessage = () => {
    const content = messageInputRef.current.value;
    socket.emit("message", { room, content });
    messageInputRef.current.value = "";
  };

  useEffect(() => {
    if (isConnected) {
      socket.on("clients", (clients) => {
        setClients(clients.filter((client) => client !== username));
      });

      socket.on("roomJoined", (newRoom) => {
        setRoom(newRoom);
        setMessages(roomMessages[newRoom] || []);
      });

      socket.on("message", (message) => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, message];
          setRoomMessages((prevRoomMessages) => ({
            ...prevRoomMessages,
            [room]: newMessages,
          }));
          return newMessages;
        });
      });

      return () => {
        socket.off("clients");
        socket.off("roomJoined");
        socket.off("message");
      };
    }
  }, [isConnected, username, room, roomMessages]);

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
                <li key={index}>
                  {client} <button onClick={() => createRoom(client)}>Chatear</button>
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
            {/* <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(e.target.value);
              }}
            /> */}
            <input type="text" ref={messageInputRef}></input>
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
