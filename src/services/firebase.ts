// /src/services/firebase.ts
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics";
// import { connectAuthEmulator } from 'firebase/auth'
// import { connectStorageEmulator } from 'firebase/storage'
// import { connectFirestoreEmulator } from 'firebase/firestore'
// import { connectFunctionsEmulator } from 'firebase/functions'
import {
	getAuth,

	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth'
import { getFirestore  } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import firebaseConfig from './firebaseConfig'
import { getStorage } from 'firebase/storage'
const app = initializeApp(firebaseConfig)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const analytics = getAnalytics(app);

const storage = getStorage()

const auth = getAuth(app)
auth.useDeviceLanguage()
// connectAuthEmulator(auth, 'http://192.168.1.6:9099')
// if (location.hostname === '192.168.1.6') {
	// Point to the Storage emulator running on localhost.
// }
	// connectStorageEmulator(storage, '192.168.1.6', 9199)


const db = getFirestore(app)
// connectFirestoreEmulator(db, '192.168.1.6', 8080)

const functions = getFunctions(app)
// connectFunctionsEmulator(functions, '192.168.1.6', 5001)
// console.log(firebaseConfig)

export {
	app,
	auth,
	db,
	functions,
	signInWithEmailAndPassword,
	signOut,
	storage,
}
