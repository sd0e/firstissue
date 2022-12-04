import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, InputAdornment, Stack, TextField } from '@mui/material';
import { AddOutlined, SearchOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../Header';
import InfoContainer from '../components/ui/InfoContainer';
import fetch from '../firebase/fetch';
import IssueList from '../components/ui/IssueList';

export default function Browse() {
	const defaultTopic = 'js';

	const [topics, setTopics] = useState('Loading');
	const [topicValue, setTopicValue] = useState(defaultTopic);
	const [topicContent, setTopicContent] = useState('Loading');

	const navigate = useNavigate();

	let lastTriggered = 0;

	const newLastTriggered = () => {
		lastTriggered = new Date().getTime();
	}

	const fetchTopicContent = (topicValue, topicList) => {
		if (!lastTriggered || new Date().getTime() - lastTriggered >= 200) {
			newLastTriggered();
			// last trigger was more than 200 ms ago
			
			setTopicContent('Loading');
			
			const topicId = getTopicId(topicValue, topicList);

			fetch(`/issues/${topicId}`).then(fetchedTopicContent => {
				setTopicContent(JSON.stringify(fetchedTopicContent));
			});	
		}
	}

	const newTopicValue = (newValue, topicList = topics) => {
		setTopicValue(newValue);
		fetchTopicContent(newValue, topicList);
	}

	useEffect(() => {
		const splitPathname = window.location.pathname.split('/');

		if (splitPathname.length === 3 && splitPathname[1] === 'browse') {
			fetch(`/topics`).then(fetchedTopics => {
				let topicsJSON = {
					"arr": [],
					"values": []
				};

				let thisTopicDisplayName = '';
		
				Object.keys(fetchedTopics).forEach(fetchedTopicKey => {
					topicsJSON['arr'].push({
						label: fetchedTopics[fetchedTopicKey].name,
						theme: fetchedTopics[fetchedTopicKey].theme,
						value: fetchedTopicKey
					});

					topicsJSON['values'].push(fetchedTopics[fetchedTopicKey].name);

					if (fetchedTopicKey === splitPathname[2]) thisTopicDisplayName = fetchedTopics[fetchedTopicKey].name;
				});
		
				setTopics(JSON.stringify(topicsJSON));

				newTopicValue(thisTopicDisplayName, JSON.stringify(topicsJSON));
			});
		} else {
			navigate(`/browse/${defaultTopic}`, { replace: true });
		}
	}, []);

	const getTopicId = (label, topicList = topics) => {
		const topicsJSON = JSON.parse(topicList);

		let topicValue;

		topicsJSON['arr'].forEach(topic => {
			if (topic.label === label) topicValue = topic.value;
		});

		return topicValue;
	}

	if (topics === 'Loading') {
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
				<Header Title="Browse" />
				<InfoContainer
					Title="Browse"
				/>
				<Stack direction="row" spacing={2} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
					<Autocomplete
						disablePortal
						options={JSON.parse(topics)['values']}
						value={topicValue}
						onChange={(event, newValue) => {
							if (newValue) newTopicValue(newValue);
						}}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Topic" />}
					/>
					<TextField
						label="Search Topic"
						sx={{ width: 400 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchOutlined fontSize="small" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
								</InputAdornment>
							)
						}}
					/>
				</Stack>
				{
					topicContent === 'Loading' ? <InfoContainer Title="Loading" Description="Loading issues for this topic" /> : !JSON.parse(topicContent) ? (
						<div>
							<InfoContainer Title="No Issues" Description="There are no issues for this topic" />
							<Link to="/new" aria-label="Create a new issue">
								<Button variant="outlined" style={{ marginTop: '1.5rem' }}>
									<AddOutlined />
									Create an Issue
								</Button>
							</Link>
						</div>
					) : (
						<IssueList list={JSON.parse(topicContent)} getTopicId={getTopicId} topicValue={topicValue} />
					)
				}
			</div>
		)
	}
}