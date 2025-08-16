import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export async function Add_to_createdID({ UserId }: { UserId: string } , {roomId}: {roomId: string}) {
  

  const userRef = doc(db, "Users", UserId); 

  await updateDoc(userRef, {
    createdRoomids: arrayUnion(roomId),
  });

  return roomId;
}
