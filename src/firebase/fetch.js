import { getDatabase, ref, onValue } from "firebase/database";

const fetch = path => {
	console.log('called');
	return new Promise((resolve, reject) => {
		if (path === '') resolve('');
		const db = getDatabase();
		onValue(ref(db, path), snapshot => resolve(snapshot.val()), error => reject(error));
	});
}

export default fetch;