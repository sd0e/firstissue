import React from 'react';
import { AccountCircleOutlined, AddOutlined, LoginOutlined, TaskAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import config from '../../config.json';
import HeaderButton from '../ui/HeaderButton';

export default function Header({ user }) {
	return (
		<div className="w-full px-6 font-sans font-semibold flex h-12 items-center justify-between">
			<Link to="/" aria-label="Return to the homepage">
				<div className="flex items-center">
					<TaskAltOutlined fontSize="small" className="mr-2 text-brand" />
					<span>{config.name}</span>
				</div>
			</Link>
			<div>
				<HeaderButton Icon={user === 'Loading' || !user ? LoginOutlined : AccountCircleOutlined} to="/account" ariaLabel="Go to the Account page" />
				<HeaderButton Icon={AddOutlined} to="/new" ariaLabel="Create a new issue" />
			</div>
		</div>
	)
}