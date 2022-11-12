import React from 'react';
import { Button } from '@mui/material';
import { DeleteForeverOutlined, Google, LogoutOutlined } from '@mui/icons-material';

import Header from '../Header';
import InfoContainer from '../components/ui/InfoContainer';
import signInUser from '../firebase/signInUser';
import signOutUser from '../firebase/signOutUser';
import deleteUserAccount from '../firebase/deleteUserAccount';

export default function Account({ user }) {
	const tryDeleteAccount = () => {
		const stageOne = window.confirm('Are you sure you want to delete your account? This will permanently delete all progress and currently open issues.');
		if (stageOne) {
			const stageTwo = window.prompt('Please type out "delete my account" to confirm');
			if (stageTwo.toLowerCase() === 'delete my account') {
				alert('Please sign in again to confirm your identity. If it does not sign you out, please try again.');
				deleteUserAccount();
			}
		}
	}

	if (user === 'Loading') {
		return (
			<div>
				<InfoContainer
					Title="Loading..."
				/>
			</div>
		)
	} else {
		return (
			<div>
				<Header Title="Account" />
				<InfoContainer
					Title="Account"
					Description={user ? `Signed in as ${user.email}` : "Sign in to add issues and track your progress"}
					className="mb-6"
				/>
				{ user ?
					<div>
						<Button variant="outlined" color="warning" onClick={signOutUser}>
							<LogoutOutlined fontSize="small" className="mr-2" />
							Sign Out
						</Button>
						<Button variant="outlined" color="error" onClick={tryDeleteAccount} style={{ marginLeft: '1rem' }}>
							<DeleteForeverOutlined fontSize="small" className="mr-2" />
							Delete Account
						</Button>
					</div>
				:
					<Button variant="outlined" onClick={signInUser}>
						<Google fontSize="small" className="mr-2" />
						Continue with Google
					</Button>
				}
			</div>
		)
	}
}