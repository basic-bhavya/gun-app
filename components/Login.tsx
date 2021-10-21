import { IGunStaticSEA } from "gun/types/static/sea";
import { useState } from "react";
// import { user } from "../backend/user";
// import { getSetUsername } from "../backend/user";

const Login = (props: { setUsername: Function, user:any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    props.user
      .auth(username, password, ({ err }) => err && alert(err))
      .on(async (v) => {
        const alias = await props.user.get("alias");
        console.log(alias);
        props.setUsername(alias);
      });
  };

  const signup = () => {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        login();
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Signup</button>
    </div>
  );
};

export default Login;
