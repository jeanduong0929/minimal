import { Session } from "next-auth";

export default interface Auth extends Session {
  id: string;
  jwt: string;
}
