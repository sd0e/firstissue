import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../Header';
import InfoContainer from '../components/ui/InfoContainer';
import fetch from '../firebase/fetch';
import write from '../firebase/write';
import generateIssueId from '../firebase/generateIssueId';

export default function New({ user }) {
	const defaultTopic = 'JavaScript';
	const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;

	const [issueName, setIssueName] = useState('');
	const [linkToIssue, setLinkToIssue] = useState('');
	const [topics, setTopics] = useState('Loading');
	const [topicValue, setTopicValue] = useState(defaultTopic);
	const [isAwaitingCreation, setIsAwaitingCreation] = useState(false);

	const navigate = useNavigate();
	
	useEffect(() => {
		fetch(`/topics`).then(fetchedTopics => {
			let topicsJSON = {
				"arr": [],
				"values": []
			};
	
			Object.keys(fetchedTopics).forEach(fetchedTopicKey => {
				topicsJSON['arr'].push({
					label: fetchedTopics[fetchedTopicKey].name,
					theme: fetchedTopics[fetchedTopicKey].theme,
					value: fetchedTopicKey
				});

				topicsJSON['values'].push(fetchedTopics[fetchedTopicKey].name);
			});
	
			setTopics(JSON.stringify(topicsJSON));
		});
	}, []);

	const getTopicId = (label, topicList = topics) => {
		const topicsJSON = JSON.parse(topicList);

		let topicValue = null;

		topicsJSON['arr'].forEach(topic => {
			if (topic.label === label) topicValue = topic.value;
		});

		return topicValue;
	}

	const createIssue = () => {
		if (issueName === '') {
			window.alert('The issue must have a name');
			return;
		}
		if (!linkToIssue.match(urlRegex)) {
			window.alert('The issue must have a valid URL');
			return;
		}
		if (!getTopicId(topicValue)) {
			window.alert('The topic you have chosen does not exist');
			return;
		}

		setIsAwaitingCreation(true);

		generateIssueId().then(issueId => {
			const topicId = getTopicId(topicValue);

			write(`/issues/${topicId}/${issueId}`, {
				created: new Date().getTime(),
				creator: user.uid,
				creatorDisplayName: user.accountName,
				link: linkToIssue,
				name: issueName,
				status: 'available'
			}).then(() => {
				write(`/allIssues/${issueId}`, {
					creator: user.uid,
					topic: topicId
				}).then(() => {
					write(`/users/${user.uid}/public/issues/${issueId}`, topicId).then(() => {
						setIsAwaitingCreation(false);
						navigate(`/issue/${topicId}/${issueId}`);
					});
				})
			});
		});
	}
	
	if (!user) {
		return (
			<div>
                <Header Title="New" />
                <InfoContainer
                    Title="Not Signed In"
					Description="This page is only available to signed-in users"
                    className="mb-6"
                />
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Link to="/">
                        <Button variant="outlined">Home</Button>
                    </Link>
                    <Link to="/account">
                        <Button variant="outlined">Sign In or Create Account</Button>
                    </Link>
                </Stack>
            </div>
		)
	} else if (topics === 'Loading') {
		return (
			<div>
				<Header Title="Browse" />
				<InfoContainer
					Title="Loading"
					Description="Loading page content"
				/>
			</div>
		)
	} else {
		return (
			<div>
				<Header Title="New" />
				<InfoContainer Title="New" Description="Create a new issue" />
				<Stack direction="column" spacing={2} style={{ marginTop: '1.5rem' }} sx={{ width: 400 }}>
					<TextField label="Issue Name" variant="outlined" onChange={e => setIssueName(e.target.value)} required />
					<Autocomplete
						disablePortal
						options={JSON.parse(topics)['values']}
						value={topicValue}
						onChange={(event, newValue) => {
							if (newValue) setTopicValue(newValue);
						}}
						renderInput={(params) => <TextField {...params} label="Topic" />}
					/>
					<TextField label="Link to Issue" variant="outlined" onChange={e => setLinkToIssue(e.target.value)} required />
					<Button variant="outlined" color="primary" onClick={createIssue}>
						{ isAwaitingCreation ? <CircularProgress style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} /> : <AddOutlined /> }
						{ isAwaitingCreation ? 'Loading' : 'Create Issue' }
					</Button>
				</Stack>
			</div>
		)
	}
}