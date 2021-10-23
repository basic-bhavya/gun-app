import type { NextPage } from "next";
import Gun, { SEA } from "gun";
import { useEffect, useState } from "react";
import Login from "../components/Login";

// const gun = Gun(["localhost:3000/gun", "gun-app.vercel.app/gun"]);
const gun = Gun();

type TGunMessage = {
  who: string;
  what: string;
  when: number;
};

const appRef = gun.get("gun-chat");

const Home: NextPage = () => {
  const user = gun.user().recall({ sessionStorage: true });
  let userkey = "";

  const [newMessage, setNewMessage] = useState<string>();
  const [chatWho, setChatWho] = useState<string>();
  const [loggedin, setLoggedin] = useState(false);
  const [allMessages, setAllMessages] = useState<TGunMessage[]>([]);
  const [username, setUsername] = useState("");

  const sendMessage = async () => {
    const secret = await SEA.encrypt(newMessage, "#encryptionkey");
    const message = user.get("all").set({ what: secret });
    const index = Date.now();
    appRef.get("IWS").get(index).put(message);
    console.log("sent", message);
  };

  useEffect(() => {
    let timestamps: string[] = [];

    gun.on("auth", async (event) => {
      const alias = await user.get("alias");
      setLoggedin(true);
      setUsername(alias);
      gun.get(`~@${alias}`).once((data, key) => {
        // userkey = Object.keys(data)[1];
        // console.log(data);
      });
      
      appRef.get(`${alias}`).get("profile").once(console.log);
      // console.log(`signed in as ${alias}`);
    });

    // console.log(parseFloat("hello"));
    appRef
      .get("chats")
      .get("IWS")
      .on((chat) => {
        console.log("my chat", chat);
        // timestamps.push(...Object.keys(chat).filter((key) => !!parseInt(key)));
      });

    // console.log(timestamps[0]);

    // console.log(
    appRef
      .get("chat")
      .get("IWS")
      .once(async (data, id) => {
        if (data) {
          const key = "#encryptionkey";
          // console.log("my data is", data);
          let message = {
            who: data.who,
            what: (await SEA.decrypt(data.what, key)) + "",
            when: data.when,
          };

          if (message.what) {
            setAllMessages((allMessages) =>
              [...allMessages.slice(-100), message].sort(
                (a, b) => a.when - b.when
              )
            );
          }

          console.log(allMessages);
        }
      });
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
            onChange={(e) => setNewMessage(e.target.value)}
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
