import { ContentCopyOutlined, FileCopyOutlined, Gavel, OpenInNewOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InfoContainer from '../components/ui/InfoContainer';
import UserIssues from '../components/ui/UserIssues';
import deleteUserInfo from '../firebase/deleteUserInfo';
import fetch from '../firebase/fetch';
import Header from '../Header';

export default function Profile({ user }) {
    const [userInfo, setUserInfo] = useState('Loading');

    let navigate = useNavigate();

    useEffect(() => {
        const splitPathname = window.location.pathname.split('/');

        const username = splitPathname[2];

        if (username && username !== '') {
            fetch(`/users/${username}/public`).then(publicInfo => {
                if (publicInfo) {
                    publicInfo.uid = username;

                    if (publicInfo.accounts) {
                        fetch(`/external`).then(externalLinks => {
                            publicInfo.externalLinks = externalLinks;
                            setUserInfo(publicInfo);
                        })
                    } else {
                        setUserInfo(publicInfo);
                    }
                } else {
                    setUserInfo(null);
                }
            });
        } else {
            setUserInfo(null);
        }
    }, []);

    const copyUID = () => {
        navigator.clipboard.writeText(userInfo.uid).then(() => {
			window.alert('Text successfully copied', 1);
		}, err => {
			window.alert(`Error copying text.\n\nError: ${err}`, 2);
		});
    }

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
					Description="This user could not be found."
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
            { user && user.isAdmin && <Stack direction="row" spacing={2} style={{ marginTop: '1.5rem' }}>
                <Button variant="outlined" color="primary" onClick={copyUID}>
                    <ContentCopyOutlined fontSize="small" style={{ marginRight: '0.5rem' }} />
                    Copy UID
                </Button>
                <Button variant="outlined" color="error" onClick={() => deleteUserInfo(userInfo.uid, user).then(() => navigate(-1))}>
                    <Gavel fontSize="small" style={{ marginRight: '0.5rem' }} />
                    Ban User
                </Button>
            </Stack> }
		</div>
	)
}