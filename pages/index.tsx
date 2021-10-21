import type { NextPage } from "next";
import Gun from "gun";
require("gun/lib/unset");
import { useEffect, useState } from "react";
import Login from "../components/Login";

const gun = Gun(["localhost:3000/gun", "gun-app.vercel.app/gun"]);

type TGunMessage = {
  who: string;
  what: string;
  when: number;
};

const appRef = gun.get("gun-chat");

const Home: NextPage = () => {
  const user = gun.user().recall({ sessionStorage: true });

  const [chatWhat, setChatWhat] = useState<string>();
  const [chatWho, setChatWho] = useState<string>();
  const [loggedin, setLoggedin] = useState(false);
  const [allMessages, setAllMessages] = useState<TGunMessage[]>([]);
  const [username, setUsername] = useState("");

  const sendMessage = () => {
    const message = user.get("all").set({ what: chatWhat });
    const index = Date.now();
    gun.get("gun-chat").get(index).put(message);
  };

  useEffect(() => {
    let timestamps: string[] = [];
    // console.log(parseFloat("hello"));
    appRef
      .get("chat")
      .get("IWS")
      .on((chat) => {
        timestamps.push(...Object.keys(chat).filter((key) => !!parseInt(key)));
      });

    // console.log(timestamps[0]);

    // console.log(
    appRef
      .get("chat")
      .get("IWS")
      .get("1634794336307")
      .once((data) => console.log(data));
    // );

    // timestamps.forEach((timestamp) => {
    //   chatRef
    //     .get("chat")
    //     .get("IWS")
    //     .get(timestamp)
    //     .once((data) => console.log(data));
    // });
  }, []);

  return (
    <div>
      {!loggedin && (
        <Login
          user={user}
          gun={gun}
          loggedin={loggedin}
          setLoggedin={setLoggedin}
          setUsername={setUsername}
        />
      )}
      {loggedin && (
        <>
          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setChatWhat(e.target.value)}
          />
          <button
            onClick={
              () => sendMessage
              // appRef
              //   .get("chat-temp")
              //   .get("IWS")
              //   .set({ who: chatWho, what: chatWhat, when: Date.now() })
            }
          >
            Send
          </button>
        </>
      )}
      <br />
      {/* {loggedin && console.log(user.get("alias"))} */}
      {loggedin && (
        <div>
          <span>Logged in as {username} </span>
          <button
            onClick={() => {
              user.leave();
              setUsername("");
              setLoggedin(false);
            }}
          >
            Signout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
