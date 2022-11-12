import React from 'react';
import { AccountCircleOutlined, AddOutlined, TaskAltOutlined } from '@mui/icons-material';

import config from '../../config.json';
import HeaderButton from '../ui/HeaderButton';

export default function Header() {
	return (
		<div className="w-full px-6 font-sans font-semibold flex h-12 items-center justify-between">
			<div className="flex items-center">
				<TaskAltOutlined fontSize="small" className="mr-2 text-brand" />
				<span>{config.name}</span>
			</div>
			<div>
				<HeaderButton Icon={AccountCircleOutlined} to="/account" />
				<HeaderButton Icon={AddOutlined} to="/new" />
			</div>
		</div>
	)
}