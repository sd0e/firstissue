import fetch from "./fetch";

const generateString = (numCharacters) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let res = '';

    for (let idx = 0; idx < numCharacters; idx++) {
        const characterIndex = Math.floor(Math.random() * characters.length);
        res += characters.charAt(characterIndex);
    }

    return res;
}

export default function generateIssueId() {
    return new Promise(resolve => {
        const result = generateString(8);

        fetch(`/allIssues/${result}`).then(issueResult => {
            if (issueResult) {
                generateIssueId().then(issueId => resolve(issueId));
            } else {
                resolve(result);
            }
        });
    });
}