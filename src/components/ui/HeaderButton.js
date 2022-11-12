import React from 'react';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HeaderButton({ Icon, to, ariaLabel }) {
	return (
		<Link to={to} aria-label={ariaLabel}>
			<IconButton>
				<Icon className="text-semivisible" fontSize="small" />
			</IconButton>
		</Link>
	)
}