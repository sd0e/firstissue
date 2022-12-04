import React, { useState } from 'react';
import { Button, CircularProgress, Stack } from '@mui/material';
import { DeleteForeverOutlined, FaceOutlined, Google, LogoutOutlined, ManageAccountsOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import Header from '../Header';
import InfoContainer from '../components/ui/InfoContainer';
import signInUser from '../firebase/signInUser';
import signOutUser from '../firebase/signOutUser';
import deleteUserAccount from '../firebase/deleteUserAccount';

export default function Account({ user }) {
    const [deletingAccount, setDeletingAccount] = useState(false);

	const tryDeleteAccount = () => {
		const stageOne = window.confirm('Are you sure you want to delete your account? This will permanently delete all progress and currently open issues.');
		if (stageOne) {
			const stageTwo = window.prompt('Please type out "delete my account" to confirm');
			if (stageTwo && stageTwo.toLowerCase() === 'delete my account') {
				alert('Please sign in again to confirm your identity. If it does not sign you out, please try again.');
				deleteUserAccount()
					.then(() => {
						setDeletingAccount(false);
					})
					.catch(() => {
						setDeletingAccount(false);
					});
			} else {
				setDeletingAccount(false);
			}
		} else {
			setDeletingAccount(false);
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
					Title={user ? `Welcome back, ${user.accountName}!` : 'Account'}
					Description={user ? `Signed in as ${user.email}` : "Sign in to add issues and track your progress"}
					className="mb-6"
				/>
				{ user ?
					<Stack direction="row" spacing={2}>
						<Link to={`/profile/${user.uid}`}>
							<Button variant="outlined" color="primary">
								<FaceOutlined fontSize="small" className="mr-2" />
								View Profile and Issues
							</Button>
						</Link>
						<Link to="/accountmanager">
							<Button variant="outlined" color="secondary">
								<ManageAccountsOutlined fontSize="small" className="mr-2" />
								Manage Account
							</Button>
						</Link>
						<Button variant="outlined" color="warning" onClick={signOutUser}>
							<LogoutOutlined fontSize="small" className="mr-2" />
							Sign Out
						</Button>
						<Button variant="outlined" color="error" onClick={() => {
							setDeletingAccount(true);
							tryDeleteAccount();
						}}>
							{ deletingAccount ? <CircularProgress style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} /> : <DeleteForeverOutlined fontSize="small" className="mr-2" /> }
							{ deletingAccount ? 'Deleting...' : 'Delete Account' }
						</Button>
					</Stack>
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