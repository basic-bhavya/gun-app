import type { NextPage } from "next";
import Gun from "gun";
import { useEffect, useState } from "react";

const countRef = Gun().get("gun-counter-app");

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    countRef.on(
      (countVal) => {
        setCounter(countVal.val);
        console.log(countVal.val);
      },
      true
      // <h2>{countVal}</h2>
    );
  }, []);

  return (
    <div>
      {/* {count.get("val")} */}
      <button
        onClick={() => {
          countRef.put({
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
