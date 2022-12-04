import { getAuth, deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import fetch from "./fetch";
import write from "./write";

const deleteUserAccount = () => {
	const auth = getAuth();
	const user = auth.currentUser;

	const deleteAccount = () => {
		return new Promise((resolve, reject) => {
			fetch(`/users/${user.uid}/public`).then(userInfo => {
				if (!userInfo) {
					deleteUser(user).then(() => {
						resolve();
					}).catch(error => {
						window.alert(`Sorry, something went wrong deleting your account. Please refresh and try again.\n\nError: ${error}`);
					});
				} else {
					write(`/users/${user.uid}`, null).then(() => {
						deleteUser(user).then(() => {
							resolve();
						}).catch(error => {
							window.alert(`Sorry, something went wrong deleting your account. Please refresh and try again.\n\nError: ${error}`);
							reject();
						});
					});
				}
			})
		});
	}

	const deleteIssue = (issueId, issueTopic) => {
		return new Promise(resolve => {
			write(`/users/${user.uid}/public/issues/${issueId}`, null).then(() => {
				write(`/issues/${issueTopic}/${issueId}`, null).then(() => {
					write(`/allIssues/${issueId}`, null).then(() => {
						resolve();
					});
				});
			});
		});
    }

	return new Promise((resolve, reject) => {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider).then(signinRes => {
			fetch(`/users/${user.uid}/banned`).then(isBanned => {
				if (!isBanned) {
					fetch(`/users/${user.uid}/public/issues`).then(publicIssues => {
						if (!publicIssues) {
							deleteAccount();
						} else {
							const keys = Object.keys(publicIssues);
		
							let resolved = new Array(keys.length);
		
							for (let idx = 0; idx < keys.length; idx++) {
								const issueId = keys[idx];
								const issueTopic = publicIssues[issueId];
		
								deleteIssue(issueId, issueTopic).then(() => {
									resolved[idx] = true;
		
									const allResolved = resolved.every(resolve => resolve === true);
									if (allResolved) {
										deleteAccount()
											.then(() => {
												resolve();
											})
											.catch(() => {
												reject()
											});
									}
								});
							}
						}
					});
				} else {
					deleteAccount().then(() => resolve());
				}
			})
			
		});
	});
}

export default deleteUserAccount;