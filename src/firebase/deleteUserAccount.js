import { getAuth, deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const deleteUserAccount = () => {
	const auth = getAuth();
	const user = auth.currentUser;

	return new Promise(resolve => {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider).then(signinRes => {
			deleteUser(user).then(() => {
				resolve();
			}).catch(error => {
				console.error(error);
			});
		});
	});
}

export default deleteUserAccount;