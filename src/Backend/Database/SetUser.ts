import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export default async function setUser() {
    const userRef = doc(db, "Users", "12345");
    await setDoc(userRef, {
      userId: "12345", // your userId field
      Name: "Utsav_testing", // your Name field
      Email: "a@bmail.com", // your Email field
      isOnline: true, // mark user online
      createdAt: serverTimestamp(), // server time
      lastOnline: serverTimestamp(), // initialize last online time
      joinedRoomIds: [], // start with empty room list
    });
    console.log("User set successfully");
  }