import React from 'react';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HeaderButton({ Icon, to }) {
	return (
		<Link to={to}>
			<IconButton>
				<Icon className="text-semivisible" fontSize="small" />
			</IconButton>
		</Link>
	)
}