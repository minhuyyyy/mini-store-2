import { uid } from "uid";
import { db } from "./dbConfig";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import env from "react-dotenv";
let day = new Date();
export async function addUser(img, role, password, email) {
  let base = 0;
  if (role === "Manager") {
    base = 40000;
  } else if (role === "Guard") {
    base = 35000;
  } else {
    base = 30000;
  }
  const day = new Date(); // Define and assign a value to 'day'
  const docRef = await addDoc(collection(db, `${env.REACT_APP_USER_DB_URL}`), {
    img: img,
    email: email,
    password: password,
    role: role,
    workHours: 0,
    coefficient: 0,
    OT: 0,
    isActive: true,
    base: base,
    createAt: day.toLocaleDateString(),
    ID: uid(8),
  });
}

export async function viewUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  snapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}
