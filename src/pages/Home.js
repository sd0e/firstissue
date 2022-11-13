import React, { useEffect, useState } from 'react';
import Header from '../Header';

import ListBox from '../components/ui/ListBox';
import config from '../config.json';
import InfoContainer from '../components/ui/InfoContainer';
import fetch from '../firebase/fetch';

export default function Home() {
	const [topics, setTopics] = useState(null);

	const topicBaseURL = '/browse/';

	let lastTriggered = 0;

	const newLastTriggered = () => {
		lastTriggered = new Date().getTime();
	}

	useEffect(() => {
		// prevent spamming of the analytics tag (limit requests to every 200 ms)
		if (!lastTriggered || new Date().getTime() - lastTriggered >= 200) {
			newLastTriggered();
			// last trigger was more than 200 ms ago
			
			fetch(`/topics`).then(topics => {
				setTopics(topics);
			})
		}
	}, []);

	if (topics) {
		return (
			<div>
				<Header />
				<h1 className="font-semibold font-sans text-xl mb-6">{config.short_description}</h1>

				<h2 className="font-semibold font-sans text-l">Browse</h2>
				<ListBox Title="Languages" TopicFilter="language" Topics={topics} baseURL={topicBaseURL} />
				<ListBox Title="Frameworks" TopicFilter="framework" Topics={topics} baseURL={topicBaseURL} />

				<h1 className="font-semibold font-sans text-l mt-6 mb-2">About</h1>
				<p className="font-sans text-soft">
					<span className="font-semibold text-brand">First Issue</span> is a site dedicated to helping new programmers discover Git and open-source contributions through real projects. People can submit links to issues on platforms such as GitHub, whereby new programmers can discover these and work out how to solve them themselves. Not only does this help newcomers, but it also helps other project contributors, as they can focus their time on solving more difficult problems.
				</p>
			</div>
		)
	} else {
		return (
			<div>
				<InfoContainer
					Title="Loading..."
					Description="Loading page content"
				/>
			</div>
		)
	}
}