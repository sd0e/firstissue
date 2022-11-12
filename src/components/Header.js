import React from 'react';
import { IconButton } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';

export default function Header() {
	return (
		<div className="w-full px-6 font-sans font-semibold flex h-12 items-center justify-between">
			<span className="text-brand">First Issue</span>
			<div>
				<IconButton className="bg-white-500">
					<AddOutlined className="text-brand" fontSize="small" />
				</IconButton>
			</div>
		</div>
	)
}