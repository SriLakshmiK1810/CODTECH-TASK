import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        room: room,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]); // show sender message
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  if (!joined) {
    return (
      <div className="joinChat">
        <h2>Join Chat</h2>
        <input
          placeholder="Your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Room ID"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div className="chatWindow">
      <h3>Room: {room}</h3>

      <div className="chatBody">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.author === username ? "myMsg" : "otherMsg"}
          >
            <b>{msg.author}</b>: {msg.message}
            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="chatFooter">
        <input
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
