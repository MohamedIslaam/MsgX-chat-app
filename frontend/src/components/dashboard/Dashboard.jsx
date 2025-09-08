import React, { useContext, useEffect, useState, useRef } from "react";
import { MyCont } from "../../MyProvi";
import io from "socket.io-client";
import "./Dashboard.css";

let socket;

function Dashboard() {
  let { curUser, setCurUser, api, chatList, setChatList, navi, search, setSearch } =
    useContext(MyCont);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [show, setShow] = useState(true);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const usr = localStorage.getItem("curuser");
    if (usr) {
      setCurUser(JSON.parse(usr));
    }
  }, [setCurUser]);

  useEffect(() => {
    async function fetcher() {
      if (!curUser || !curUser.phone) return;
      try {
        let res = await api.get("/getUsers");
        let filtered = res.data.filter((itm) => itm.phone !== curUser.phone);
        setChatList(filtered);
      } catch (error) {
        console.log(error);
      }
    }
    fetcher();
  }, [curUser, api, setChatList]);

  useEffect(() => {
    if (!curUser?.phone) return;

    socket = io("http://localhost:5000");
    socket.emit("join", curUser.phone);

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.from === curUser.phone && msg.to === selectedUser?.phone) ||
        (msg.to === curUser.phone && msg.from === selectedUser?.phone)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [curUser, selectedUser]);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedUser) return;
      try {
        let res = await api.post("/getMessages", {
          from: curUser.phone,
          to: selectedUser.phone,
        });
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMessages();
  }, [selectedUser, curUser, api]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim() || !selectedUser) return;
    try {
      await api.post("/sendMessage", {
        from: curUser.phone,
        to: selectedUser.phone,
        msg: newMsg,
      });
      setNewMsg("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="dashcont">
      <div className="wel">
        <p>{curUser?.uname}</p>
        <button
          onClick={() => {
            localStorage.removeItem("curuser");
            navi("/login");
          }}
        >
          Logout
        </button>
        <div className="navbtn" onClick={() => setShow((prev) => !prev)}>
          {show ? (
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/ios/50/chat-message.png"
              alt="chat-message"
            />
          ) : (
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/forma-thin-sharp/48/contact-card.png"
              alt="contact-card"
            />
          )}
        </div>
      </div>

      <div className="dashincont">
        <div className={`userNames ${show}`}>
          <input
            type="text"
            placeholder="search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {chatList
            .filter((itm) =>
              itm.uname.toLowerCase().includes(search.toLowerCase())
            )
            .map((itm) => (
              <div
                className={`chatitems ${
                  selectedUser?.phone === itm.phone ? "active" : ""
                }`}
                key={itm._id}
                onClick={() => {
                  setSelectedUser(itm);
                  setShow((prev) => !prev);
                }}
              >
                <p>
                  <b>{itm.uname}</b>
                </p>
                <p>{itm.phone}</p>
              </div>
            ))}
        </div>

        <div className={`userMsg not${show}`}>
          {selectedUser ? (
            <div className="showSelectedUser">{selectedUser.uname}</div>
          ) : null}
          <div className="chatspace">
            {selectedUser ? (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`msg ${
                    m.from === curUser.phone ? "sent" : "received"
                  }`}
                >
                  <p>{m.msg}</p>
                  <span>{new Date(m.time).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <p className="nomsg">Select a user to start chatting</p>
            )}
            <div ref={chatEndRef} />
          </div>
          {selectedUser && (
            <div>
              <form onSubmit={sendMessage} className="chatinp">
                <p>type here...</p>
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message"
                />
                <button>
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/windows/32/sent.png"
                    alt="sent"
                  />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
