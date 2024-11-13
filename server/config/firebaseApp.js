import admin from "firebase-admin"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const serviceAccountPath = new URL(
  "../config/Frame Up Service Account.json",
  import.meta.url,
)

let firebaseApp
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} catch (error) {
  console.error("Error initializing Firebase Admin:", error)
  process.exit(1) // Exit with error code
}

export default firebaseApp
