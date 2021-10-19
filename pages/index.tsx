import type { NextPage } from "next";
import Gun from "gun";
// import "gun/lib/unset";
import { useEffect, useState } from "react";

const gun = Gun([
  "localhost:3000/gun",
  "gun-app.vercel.app/gun",
  "http://gun-manhattan.herokuapp.com/gun",
]);

const todoRef = gun.get("gun-chat");

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);
  const [currentTodo, setCurrentTodo] = useState("");
  const [allTodos, setAllTodos] = useState<string[]>([]);
  useEffect(() => {
    todoRef.get("counter").on((countVal) => {
      setCounter(countVal.val);
    });

    // todoRef.get("todos").on(() => {
    let newTodos: string[] = [];
    console.group("Todos");
    todoRef
      .get("todos")
      .map()
      .map((todo) => {
        newTodos.push(todo);
      });
    console.groupEnd();
    setAllTodos(newTodos);
    // });

    todoRef.get("todos").on((todos) => {
      console.log(todos);
    });

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
          todoRef.get("counter").put({
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
          todoRef.get("counter").put({
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
          placeholder="Enter todo"
          value={currentTodo}
          onChange={(e) => {
            setCurrentTodo(e.target.value);
          }}
        />
        <button
          onClick={() => {
            const todos = todoRef.get("todos");
            todos.set({
              val: currentTodo,
            });

            console.group("todos Add");
            todoRef.get("todos").map((todo) => {
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
            todoRef.get("todos").map((todo) => {
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
            todoRef.get("todos").put({});
            // print all todos
            console.group("todos");
            todoRef.get("todos").map((todo) => {
              console.log(todo.val);
            });
            // todoRef.get("todos").map().unset();
          }}
        >
          Remove all
        </button>
      </div>
      <ul>
        {allTodos.map((todo, index) => (
          <div key={index} style={{ display: "flex" }}>
            <li style={{ width: "5%" }}>{todo}</li>
            <button
              onClick={
                // delete todo
                () => {
                  todoRef.get("todos").map((gun_todo) => {
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
        ))}
      </ul>
    </div>
  );
};

export default Home;
