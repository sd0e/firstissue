import fetch from "./fetch";
import write from "./write";

const deleteUserInfo = (uid, currentUser) => {
    const deleteAccount = () => {
        return new Promise((resolve, reject) => {
			fetch(`/users/${uid}/public`).then(userInfo => {
				if (!userInfo) {
					resolve();
				} else {
					write(`/users/${uid}`, {
						banned: true
					}).then(() => {
						resolve();
					});
				}
			})
		});
    }

	const deleteIssue = (issueId, issueTopic) => {
		return new Promise(resolve => {
			write(`/users/${uid}/public/issues/${issueId}`, null).then(() => {
				write(`/issues/${issueTopic}/${issueId}`, null).then(() => {
					write(`/allIssues/${issueId}`, null).then(() => {
						resolve();
					});
				});
			});
		});
    }

	return new Promise((resolve, reject) => {
        if (currentUser.isAdmin) {
			const certain = window.confirm('Are you sure you want to delete this user\'s account?');
			if (certain) {
				fetch(`/users/${uid}/public/issues`).then(publicIssues => {
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
			}
        }
	});
}

export default deleteUserInfo;