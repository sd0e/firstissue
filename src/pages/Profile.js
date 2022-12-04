import { OpenInNewOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

import InfoContainer from '../components/ui/InfoContainer';
import UserIssues from '../components/ui/UserIssues';
import fetch from '../firebase/fetch';
import Header from '../Header';

export default function Profile() {
    const [userInfo, setUserInfo] = useState('Loading');

    useEffect(() => {
        const splitPathname = window.location.pathname.split('/');

        const username = splitPathname[2];

        if (username && username !== '') {
            fetch(`/users/${username}/public`).then(publicInfo => {
                publicInfo.uid = username;

                if (publicInfo.accounts) {
                    fetch(`/external`).then(externalLinks => {
                        publicInfo.externalLinks = externalLinks;
                        setUserInfo(publicInfo);
                    })
                } else {
                    setUserInfo(publicInfo);
                }
            });
        } else {
            setUserInfo(null);
        }
    }, []);

    if (userInfo === 'Loading') {
		return (
			<div>
			    <Header Title="User Profile" />
				<InfoContainer
					Title="Loading"
					Description="Loading profile information"
				/>
			</div>
		)
	} else if (!userInfo) {
		return (
			<div>
			    <Header Title="User Not Found" />
				<InfoContainer
					Title="User Not Found"
					Description="This user could not be found"
				/>
			</div>
		)
    }
	return (
		<div>
			<Header Title="User Profile" />
            <InfoContainer
                Title={userInfo.displayName}
                Description={userInfo.organisation || ''}
                className="mb-4"
            />
            { userInfo.accounts && <div style={{ marginBottom: '1.5rem' }}>
                {/* <h2 className="font-sans font-semibold text-semivisible mt-4 text-l">External Links</h2> */}
                { Object.keys(userInfo.accounts).map(userAccountService => {
                    const userAccountServiceUsername = userInfo.accounts[userAccountService];
                    return <a
                        target="_blank"
                        href={userInfo.externalLinks[userAccountService].baseAccountURL + userAccountServiceUsername}
                        key={userAccountService}
                        className="font-sans font-medium block text-brand py-2"
                    >
                        { userInfo.externalLinks[userAccountService].name }
                        <OpenInNewOutlined fontSize="small" className="ml-2" />
                    </a>
                }) }
            </div> }
            { userInfo.issues ? <UserIssues issues={userInfo.issues} /> : <p className="text-semivisible">This user currently has no active issues.</p> }
		</div>
	)
}