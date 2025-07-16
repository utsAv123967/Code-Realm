import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createUser({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) {
  const userRef = doc(db, "Users", userId);

  await setDoc(userRef, {
    userId,
    Name: name,
    Email: email,
    isOnline: true,
    createdAt: serverTimestamp(),
    lastOnline: serverTimestamp(),
    joinedRoomIds: [],
    createdRoomIds: [],
  });

  console.log("User created successfully:", userId);
}
