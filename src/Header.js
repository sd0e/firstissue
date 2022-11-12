import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import config from './config.json';
import addToAnalytics from './firebase/addToAnalytics';

export default function Header({ Title, NoAuth }) {
	let lastTriggered = 0;

	const newLastTriggered = () => {
		lastTriggered = new Date().getTime();
	}

	useEffect(() => {
		// prevent spamming of the analytics tag (limit requests to every 200 ms)
		if (!lastTriggered || new Date().getTime() - lastTriggered >= 200) {
			newLastTriggered();
			// last trigger was more than 200 ms ago
			addToAnalytics(Title ? Title : 'Home', window.location.pathname);
		}
	}, []);

	return (
		<Helmet>
			<title>{Title ? `${Title} - ${config.name}` : config.name}</title>
			<meta name="title" content={Title ? `${Title} - ${config.name}` : config.name} />
			<meta name="description" content={config.short_description} />
        	<meta name="theme-color" content={config.theme_color} />
		</Helmet>
	)
}