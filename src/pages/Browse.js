import React, { useEffect, useState } from 'react';
import { Autocomplete, InputAdornment, Stack, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Header from '../Header';
import InfoContainer from '../components/ui/InfoContainer';
import fetch from '../firebase/fetch';

export default function Browse() {
	const [topics, setTopics] = useState('Loading');
	const [topicValue, setTopicValue] = useState('JavaScript');

	const navigate = useNavigate();

	useEffect(() => {
		const splitPathname = window.location.pathname.split('/');

		if (splitPathname.length === 3 && splitPathname[1] === 'browse') {
			window['browseTopic'] = splitPathname[2];
			navigate('/browse', { replace: true });
		} else {
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

				if (window['browseTopic']) {
					setTopicValue(fetchedTopics[window['browseTopic']].name);
					window['browseTopic'] = undefined;
				}
		
				setTopics(JSON.stringify(topicsJSON));
			});
		}
	}, []);

	const getTopicId = label => {
		const topicsJSON = JSON.parse(topics);

		topicsJSON['arr'].forEach(topic => {
			if (topic.label === label) return topic.value;
		});
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
				<Stack direction="row" spacing={2} style={{ marginTop: '1.5rem' }}>
					<Autocomplete
						disablePortal
						options={JSON.parse(topics)['values']}
						inputValue={topicValue}
						onInputChange={(event, newValue) => {
							setTopicValue(newValue);
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
			</div>
		)
	}
}