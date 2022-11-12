import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const signInUser = () => {
	return new Promise((resolve, reject) => {
		signInWithPopup(auth, provider)
			.then((result) => {
				const user = result.user;
				resolve(user);
			}).catch((error) => {
				const errorMessage = error.message;
				reject(errorMessage);
			});
	});
}

export default signInUser;