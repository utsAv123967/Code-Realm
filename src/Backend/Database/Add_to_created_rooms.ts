import { doc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import uuid from "uuid"; // Fix: use v4 specifically

export async function Add_to_createdID({ UserId }: { UserId: string } , {roomId}: {roomId: string}) {
  

  const userRef = doc(db, "Users", UserId); // reference to the user document

  await updateDoc(userRef, {
    createdRoomids: arrayUnion(roomId), // add room ID to the array
  });

  return roomId;
}
