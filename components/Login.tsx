import GUN from "gun/gun";
import "gun/sea";
import "gun/axe";
import { IGunChainReference } from "gun/types/chain";
import { FunctionComponent, useEffect, useState } from "react";
interface Props {
  gun: IGunChainReference;
  user: any;
  loggedin: boolean;
  setLoggedin: Function;
  setUsername: Function;
}

const Login: FunctionComponent<Props> = (props) => {
  const { gun, user, loggedin, setLoggedin, setUsername } = props;

  const [usernamefield, setUsernameField] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    user.create(usernamefield, password, (props: any) => {
      const { err } = props;
      if (err) {
        alert(err);
      } else {
        console.log("Usernamefield", usernamefield);
        gun
          .get("gun-chat")
          .get(`${usernamefield}`)
          .get("profile")
          .put({ name: usernamefield, subject: "IWS", professor: "DSharma" });
        login();
      }
    });
  };

  const login = () => {
    user.auth(
      usernamefield,
      password,
      (props: any) => props.err && alert(props.err)
    );
  };

  return (
    <div>
      <input
        placeholder="username"
        value={usernamefield}
        onChange={(e) => setUsernameField(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Signup</button>
    </div>
  );
};

export default Login;
