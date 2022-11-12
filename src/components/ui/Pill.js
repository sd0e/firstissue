import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Pill({ color, page, children, name }) {
	return (
		<Link to={page} aria-label={`View the page for ${name}`}>
			<Button style={{ backgroundColor: color, color: '#ffffff', fontWeight: 600, height: "2rem", marginRight: "0.5rem", marginBottom: "0.5rem" }}>
				{children}
			</Button>
		</Link>
	)
}