import { getDatabase, ref, onValue } from "firebase/database";

const fetch = path => {
	return new Promise(resolve => {
		if (path === '') resolve('');
		const db = getDatabase();
		onValue(ref(db, path), snapshot => resolve(snapshot.val()));
	});
}

export default fetch;