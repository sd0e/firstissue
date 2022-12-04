import React, { useState, useEffect } from 'react'
import fetch from '../../firebase/fetch';
import InfoContainer from './InfoContainer';
import IssueList from './IssueList';

export default function UserIssues({ issues }) {
    const [issueList, setIssueList] = useState('');

	let lastTriggered = 0;

	const newLastTriggered = () => {
		lastTriggered = new Date().getTime();
	}

    useEffect(() => {
		if (!lastTriggered || new Date().getTime() - lastTriggered >= 200) {
			newLastTriggered();

            const issueKeys = Object.keys(issues);
            const numIssuesToFetch = issueKeys.length;

            let temporaryIssueList = [];

            for (let idx = 0; idx < numIssuesToFetch; idx++) {
                const issueId = issueKeys[idx];
                const issueTopic = issues[issueId];

                fetch(`/issues/${issueTopic}/${issueId}`).then(issueInfo => {
                    issueInfo.topic = issueTopic;
                    issueInfo.id = issueId;
                    temporaryIssueList.push(issueInfo);
                    
                    if (temporaryIssueList.length === numIssuesToFetch) {
                        setIssueList(JSON.stringify(temporaryIssueList));
                    }
                });
            }
        }
    }, []);

    if (issueList === '') {
        return (
            <InfoContainer
                Title="Loading List of Issues"
            />
        )
    } else {
        return (
            <IssueList
                list={JSON.parse(issueList)}
                showAssigned={true}
                type="user"
            />
        )
    }
}