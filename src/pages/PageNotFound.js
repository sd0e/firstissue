import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import InfoContainer from '../components/ui/InfoContainer';
import Header from '../Header';

export default function PageNotFound() {
	return (
		<div>
			<Header Title="Page Not Found" />
			<InfoContainer
				Title="404 Error"
				Description="Page not found"
				className="mb-6"
			/>
			<Link to="/">
				<Button variant="outlined">Return Home</Button>
			</Link>
		</div>
	)
}