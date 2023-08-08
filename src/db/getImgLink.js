import { storage } from "../db/dbConfig";
import { getDownloadURL, uploadBytes, ref } from "@firebase/storage";
export async function getImageLink(image) {
  const file = image;
  const storageRef = ref(storage, `users/images/${file.name}`);

  // Upload the file to Firebase Storage
  const snapshot = await uploadBytes(storageRef, file);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}

