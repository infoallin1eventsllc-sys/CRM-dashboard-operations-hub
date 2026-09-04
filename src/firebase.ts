import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";
import { IS_DEMO } from "./demo";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

// Test Firestore Connection as required by the Firebase Integration Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firestore connection test completed.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration. The client is offline.");
    } else {
      console.log("Firestore connection initialized.");
    }
  }
}
// The hosted demonstration never touches Firestore, so it skips the probe
// rather than logging a permission error for every visitor.
if (!IS_DEMO) testConnection();

export { app, db, auth };
