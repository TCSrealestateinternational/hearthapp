import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  brokerageId: string,
  path: string,
  file: File
): Promise<{ url: string; fullPath: string }> {
  const storageRef = ref(
    storage,
    `brokerages/${brokerageId}/${path}/${file.name}`
  );
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, fullPath: storageRef.fullPath };
}

export async function getFileUrl(fullPath: string): Promise<string> {
  const storageRef = ref(storage, fullPath);
  return getDownloadURL(storageRef);
}

export async function deleteFile(fullPath: string): Promise<void> {
  const storageRef = ref(storage, fullPath);
  await deleteObject(storageRef);
}
