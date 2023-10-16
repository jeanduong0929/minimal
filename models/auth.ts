import { Session } from "next-auth";

export default interface Auth extends Session {
  _id: string;
  jwt: string;
}
