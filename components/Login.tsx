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

  useEffect(() => {
    user.get("alias").on((v:string) => setUsername(v));
    return () => {
      user.get("alias").off();
    };
  }, []);

  const signup = () => {
    user.create(usernamefield, password, (props:any) => {
      const { err } = props;
      if (err) {
        alert(err);
      } else {
        login();
      }
    });
  };

  const login = () => {
    user.auth(usernamefield, password, async (res: any) => {
      if (res.err) {
        alert(res.err);
      } else {
        setLoggedin(true);
        const alias = await user.get("alias");
        setUsername(alias);
      }
    });
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
