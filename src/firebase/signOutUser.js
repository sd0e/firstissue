import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const signOutUser = () => {
	signOut(auth);
}

export default signOutUser;