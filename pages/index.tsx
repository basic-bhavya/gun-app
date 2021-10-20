import type { NextPage } from "next";
import Gun from "gun";
require("gun/lib/unset");
import { useEffect, useState } from "react";
import { IGunChainReference } from "gun/types/chain";

const gun = Gun([
  "localhost:3000/gun",
  "gun-app.vercel.app/gun",
  // "http://gun-manhattan.herokuapp.com/gun",
]);

type TGunMessage = {
  id: string;
  sender: string;
  message: string;
};

const chatRef = gun.get("gun-chat");

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);
  const [chatMesssage, setChatMessage] = useState("");
  const [allMessages, setAllMessages] = useState<TGunMessage | []>([]);
  const sender = "PMalik";
  // const [currentTodo, setCurrentTodo] = useState("");
  // const [allTodos, setAllTodos] = useState<string[]>([]);

  useEffect(() => {
    // chatRef.get("chats").put(null);

    chatRef.get("counter").on((countVal) => {
      setCounter(countVal.val);
    });

    chatRef.get("chat").map((chat: IGunChainReference) => {
      console.log(chat);
      // chatRef.get("chats").unset(chat);
      // console.log(chat, typeof chat);
      // console.log(chat.message, chat["_"]);
      // const message: TGunMessage = {
      //   id: chat["_"],
      //   sender: chat.sender,
      //   message: chat.message,
      // };
      // setAllMessages((allMessages) => [...allMessages]);
      // console.log(chat.sender, ": ", chat.message);
    });

    // todoRef.get("todos").on(() => {
    // let newTodos: string[] = [];
    // console.group("Todos");
    // chatRef
    //   .get("todos")
    //   .map()
    //   .map((todo) => {
    //     newTodos.push(todo);
    //   });
    // console.groupEnd();
    // setAllTodos(newTodos);

    // chatRef.get("todos").on((todos) => {
    //   console.log(todos);
    // });

    // todoRef.get("todos").on((todos) => {
    //   console.log("On todo", todos);
    //   let newTodos: string[] = [];
    //   todos.map((val:string) => newTodos.push(val));
    //   setAllTodos(newTodos);
    // });
  }, []);

  return (
    <div>
      {/* {count.get("val")} */}
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
        {/* {allTodos.map((todo, index) => (
          <div key={index} style={{ display: "flex" }}>
            <li style={{ width: "5%" }}>{todo}</li>
            <button
              onClick={
                // delete todo
                () => {
                  chatRef.get("todos").map((gun_todo) => {
                    // console.log(todo.val);
                    if (gun_todo.val === todo) {
                      // console.log("deleting",gun_todo);
                      console.log(Object.getOwnPropertyNames(gun_todo));
                      // gun_todo.put(null);
                    }
                  });
                }
              }
            >
              {" X "}
            </button>
          </div>
        ))} */}
      </ul>
    </div>
  );
};

export default Home;
