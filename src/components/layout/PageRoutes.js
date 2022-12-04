import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import Layout from './Layout';
import Home from '../../pages/Home';
import PageNotFound from '../../pages/PageNotFound';
import Account from '../../pages/Account';
import New from '../../pages/New';
import AccountManager from '../../pages/AccountManager';
import Browse from '../../pages/Browse';
import Issue from '../../pages/Issue';
import fetch from '../../firebase/fetch';

export default function PageRoutes() {
	const location = useLocation();
	let navigate = useNavigate();
    
    const [user, setUser] = useState('Loading');

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
					fetch(`/users/${userFetched.uid}/public/displayName`)
						.then(displayName => {
							if (!displayName) {
								// account just created
								setUser(userFetched);
								navigate('/accountmanager');
							} else {
								userFetched.accountName = displayName;
								setUser(userFetched);
							}
						});
				} else {
					setUser(userFetched);
				}
            }
        });
    }, []);

	return (
		<Layout user={user}>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/browse/*" element={<Browse />} />
				<Route path="/issue/*" element={<Issue user={user} />} />
				<Route path="/account" element={<Account user={user} />} />
				<Route path="/accountmanager" element={<AccountManager user={user} />} />
				<Route path="/new" element={<New user={user} />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</Layout>
	)
}