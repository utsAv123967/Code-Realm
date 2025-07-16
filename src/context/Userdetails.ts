import uuid from "uuid";
import {createUser} from "../Backend/Database/CreateUser";
const userId = uuid();
await createUser({userId, name: "Default User", email: "hello@gmail.com"})
export { userId };