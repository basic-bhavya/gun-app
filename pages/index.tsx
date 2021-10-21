import type { NextPage } from "next";
import Gun from "gun";
require("gun/lib/unset");
import { useEffect, useState } from "react";
import { IGunChainReference } from "gun/types/chain";
import Login from "../components/Login";

const gun = Gun(["localhost:3000/gun", "gun-app.vercel.app/gun"]);

type TGunMessage = {
  id: string;
  sender: string;
  message: string;
};

const chatRef = gun.get("gun-chat");

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);
  const [chatMesssage, setChatMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Partial<TGunMessage>[]>([]);
  const [sender, setSender] = useState("");
  const [username, setUsername] = useState("");
  // const [currentTodo, setCurrentTodo] = useState("");
  // const [allTodos, setAllTodos] = useState<string[]>([]);
  const user = gun.user().recall({ sessionStorage: true });

  const getSetUsername = async (setUsername: Function) => {
    const alias = await user.get("alias");  
    console.log("logged in as", alias);
  };

  useEffect(() => {
    console.log("All messages", allMessages);
  }, [allMessages]);

  let messageArray: Partial<TGunMessage>[] = [];
  let idSet: Set<string> = new Set();

  useEffect(() => {
    // chatRef.get("chats").put(null);
    user.get("alias").on((v) => setUsername(v));

    chatRef.get("counter").on((countVal) => {
      setCounter(countVal.val);
    });

    chatRef.get("chat").on((chat: IGunChainReference) => {
      // console.log(chat.sender);
      // Object.keys(chat).forEach((key) => {
      //   console.log(chatRef.get("chat").get(key));
      // });
      // const { id, sender, message } = chat;
      // if (!idSet.has(chat["_"]["#"] as string)) {
      //   messageArray = [
      //     ...messageArray,
      //     { id: chat["_"]["#"], sender, message } as TGunMessage,
      //   ];
      //   idSet.add(chat["_"]["#"]);
      //   setAllMessages(messageArray);
      //   console.log("messageArray", messageArray);
      // }
    });
  }, []);

  const signout = () => {
    user.leave();
    setUsername("");
  };

  return (
    <div>
      {/* {count.get("val")} */}
      <Login setUsername={setUsername} user={user}/>
      <button
        onClick={() => {
          chatRef.get("counter").put({
            val: counter - 1,
          });
          // setCounter(counter + 1);
        }}
      >
        -1
      </button>
      {counter}
      <button
        onClick={() => {
          chatRef.get("counter").put({
            val: counter + 1,
          });
          // setCounter(counter + 1);
        }}
      >
        +1
      </button>
      <div>
        <input
          type="text"
          placeholder="sender"
          onChange={(e) => setSender(e.target.value)}
        />
        <input
          type="text"
          placeholder="chat message"
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button
          onClick={() => {
            chatRef.get("chat").set({ sender: sender, message: chatMesssage });
            setChatMessage("");
          }}
        >
          Send
        </button>
        <button
          onClick={() => chatRef.get("chat").map((chat) => console.log(chat))}
        >
          Show chats
        </button>
        {/* <input
          type="text"
          placeholder="Enter todo"
          value={currentTodo}
          onChange={(e) => {
            setCurrentTodo(e.target.value);
          }}
        />
        <button
          onClick={() => {
            const todos = chatRef.get("todos");
            todos.set({
              val: currentTodo,
            });

            console.group("todos Add");
            chatRef.get("todos").map((todo) => {
              console.log(todo.val);
            });
            console.groupEnd();
          }}
        >
          Add
        </button>
        <button
          onClick={() => {
            // console.log("clicked");
            console.group("todos");
            chatRef.get("todos").map((todo) => {
              console.log(todo.val);
            });
            console.groupEnd();
          }}
        >
          Get Todos
        </button>
        <button
          onClick={() => {
            // delete all todos
            chatRef.get("todos").put({});
            // print all todos
            console.group("todos");
            chatRef.get("todos").map((todo) => {
              console.log(todo.val);
            });
            // todoRef.get("todos").map().unset();
          }}
        >
          Remove all
        </button> */}
      </div>
      <ul>
        {allMessages.map((message) => {
          return message.sender === sender ? (
            <li
              key={message.id}
              style={{
                backgroundColor: "lightgreen",
                padding: "10px",
                margin: "10px",
              }}
            >
              {message.sender}: {message.message}
            </li>
          ) : (
            <li
              key={message.id}
              style={{
                backgroundColor: "lightblue",
              }}
            >
              {message.sender}: {message.message}
            </li>
          );
        })}
      </ul>
      <span>username: {username}</span>
      <button onClick={signout}>Signout</button>
    </div>
  );
};

export default Home;
