import GUN from "gun";
import "gun/sea";
import "gun/axe";

export const db = GUN();
export const user = db.user().recall({ sessionStorage: true });

const setuser = (setUsername: Function) => {
  user.get("alias").on((v) => setUsername(v));
};

const signIn = (setUsername: Function) => {
  db.on(async (e) => {
    const alias = await user.get("alias");
    setUsername(alias);
    console.log("signed in as", alias);
  });
};
