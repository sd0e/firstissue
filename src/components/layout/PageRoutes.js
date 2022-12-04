import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { Button } from '@mui/material';
import { DeleteForeverOutlined } from '@mui/icons-material';

import Layout from './Layout';
import Home from '../../pages/Home';
import PageNotFound from '../../pages/PageNotFound';
import Account from '../../pages/Account';
import New from '../../pages/New';
import AccountManager from '../../pages/AccountManager';
import Browse from '../../pages/Browse';
import Issue from '../../pages/Issue';
import Profile from '../../pages/Profile';
import fetch from '../../firebase/fetch';
import InfoContainer from '../ui/InfoContainer';
import deleteUserAccount from '../../firebase/deleteUserAccount';

export default function PageRoutes() {
	const location = useLocation();
	let navigate = useNavigate();
    
    const [user, setUser] = useState('Loading');
	const [userBanned, setUserBanned] = useState(false);

	let lastTriggered = 0;

	const newLastTriggered = () => {
		lastTriggered = new Date().getTime();
	}

    useEffect(() => {
        // triggers every time the user's status changes
        getAuth().onAuthStateChanged(userFetched => {
            // limit requests to every 20 ms
            if (!lastTriggered || new Date().getTime() - lastTriggered >= 20) {
                newLastTriggered();
                // last trigger was more than 20 ms ago

				if (userFetched && userFetched !== 'Loading') {
					fetch(`/users/${userFetched.uid}`)
						.then(userInfo => {
							if (!userInfo) {
								// account just created
								setUser(userFetched);
								navigate('/accountmanager');
							} else if (userInfo.banned) {
								setUserBanned(true);
							} else {
								userFetched.accountName = userInfo.public.displayName;
								userFetched.isAdmin = userInfo.admin;
								setUser(userFetched);
							}
						});
				} else {
					setUser(userFetched);
				}
            }
        });
    }, []);

	const tryDeleteAccount = () => {
		const stageOne = window.confirm('Are you sure you want to delete your account? This will permanently delete all progress and currently open issues.');
		if (stageOne) {
			const stageTwo = window.prompt('Please type out "delete my account" to confirm');
			if (stageTwo && stageTwo.toLowerCase() === 'delete my account') {
				alert('Please sign in again to confirm your identity. If it does not sign you out, please try again.');
				deleteUserAccount()
					.then(() => {
						window.location.reload();
					});
			}
		}
	}

	if (userBanned) {
		return (
			<Layout user={user}>
				<InfoContainer Title="You have been banned" Description="You have been permanently banned by an admin. You cannot access any sections of the site, or make any changes apart from deleting your account." className="mb-4" />
				<Button variant="outlined" color="error" onClick={tryDeleteAccount}>
					<DeleteForeverOutlined fontSize="small" style={{ marginRight: '0.5rem' }} />
					Delete Account
				</Button>
			</Layout>
		);
	} else {
		return (
			<Layout user={user}>
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<Home />} />
					<Route path="/browse/*" element={<Browse />} />
					<Route path="/issue/*" element={<Issue user={user} />} />
					<Route path="/account" element={<Account user={user} />} />
					<Route path="/accountmanager" element={<AccountManager user={user} />} />
					<Route path="/new" element={<New user={user} />} />
					<Route path="/profile/*" element={<Profile user={user} />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Layout>
		)
	}
}