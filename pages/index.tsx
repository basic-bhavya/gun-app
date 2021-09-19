import type { NextPage } from "next";
import Gun from "gun";
import { useEffect, useState } from "react";

const countRef = Gun(['localhost:3000', 'https://gun-app.vercel.app/']).get("gun-chat");

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    countRef.on(
      (countVal) => {
        setCounter(countVal.val);
      },
      true
    );
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          countRef.put({
            val: counter - 1,
          });
        }}
      >
        -1
      </button>
      {counter}
      <button
        onClick={() => {
          countRef.put({
            val: counter + 1,
          });
          // setCounter(counter + 1);
        }}
      >
        +1
      </button>
    </div>
  );
};

export default Home;
