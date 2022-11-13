import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, ToggleButton, Tooltip } from '@mui/material';
import { Check } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../Header';
import fetch from '../firebase/fetch';
import write from '../firebase/write';
import InfoContainer from '../components/ui/InfoContainer';

export default function AccountCreated({ user }) {
    const [accountState, setAccountState] = useState('Loading');
    const [externalLinks, setExternalLinks] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [organisation, setOrganisation] = useState('');

    let navigate = useNavigate();

    const generateUserFile = () => {
        let tempUserFile = {
            displayName: displayName,
            organisation: organisation,
            accounts: {}
        }

        if (displayName === '') {
            window.alert('A value must be entered for the display name');
            return 'Error';
        }

        const localExternalLinks = JSON.parse(externalLinks);
        Object.keys(localExternalLinks).forEach(localExternalLinkKey => {
            const localExternalLinkInfo = localExternalLinks[localExternalLinkKey];
            if (localExternalLinkInfo.selected) {
                if (localExternalLinkInfo.value === '') {
                    window.alert(`A value must be entered for the ${localExternalLinkInfo.name} username box`);
                    return 'Error';
                }
                tempUserFile.accounts[localExternalLinkKey] = localExternalLinkInfo.value;
            }
        });

        return tempUserFile;
    }

    const createAccount = () => {
        const userFile = generateUserFile();
        if (userFile !== "Error") {
            write(`/users/${user.uid}/public`, userFile).then(() => {
                navigate('/account');
            });
        }
    }

    useEffect(() => {
        if (user && user !== 'Loading') {
            fetch(`/users/${user.uid}/public/displayName`)
                .then(displayName => {
                    if (!displayName) {
                        // account just created
                        fetch(`/external`).then(fetchedExternalLinks => {
                            Object.keys(fetchedExternalLinks).forEach(fetchedExternalLinkKey => {
                                fetchedExternalLinks[fetchedExternalLinkKey].selected = false;
                                fetchedExternalLinks[fetchedExternalLinkKey].value = '';
                            });

                            setExternalLinks(JSON.stringify(fetchedExternalLinks));
                            setAccountState('Account Just Created');
                        });
                    } else {
                        setAccountState('Account Already Created');
                    }
                });
        } else if (user !== 'Loading') {
            setAccountState('User Not Signed In');
        }
    }, [user]);

    if (accountState === 'Loading') {
        return (
            <div>
                <Header Title="Account Creation" />
                <InfoContainer
                    Title="Loading..."
					Description="Loading page content"
                />
            </div>
        )   
    } else if (accountState === 'Account Already Created') {
        return (
            <div>
                <Header Title="Account Creation" />
                <InfoContainer
                    Title="Account Already Created"
					Description="You have already created your account"
                    className="mb-6"
                />
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Link to="/">
                        <Button variant="outlined">Home</Button>
                    </Link>
                    <Link to="/account">
                        <Button variant="outlined">Manage Account</Button>
                    </Link>
                </Stack>
            </div>
        )   
    } else if (accountState === 'User Not Signed In') {
        return (
            <div>
                <Header Title="Account Creation" />
                <InfoContainer
                    Title="Not Signed In"
					Description="This page is only available to signed-in users"
                    className="mb-6"
                />
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Link to="/">
                        <Button variant="outlined">Home</Button>
                    </Link>
                    <Link to="/account">
                        <Button variant="outlined">Sign In or Create Account</Button>
                    </Link>
                </Stack>
            </div>
        )   
    } else {
        // Account Just Created

        const localExternalLinks = JSON.parse(externalLinks);

        return (
            <div>
                <Header Title="Account Creation" />
                <InfoContainer
                    Title="Create Account"
					Description="Fill in the details below to complete your account creation"
                    className="mb-6"
                />
                <Stack
                    direction="column"
                    spacing={4}
                >
                    <TextField label="Display Name" variant="outlined" onChange={e => setDisplayName(e.target.value)} required />
                    <Tooltip title="The name of your organisation. Not required.">
                        <TextField label="Organization" variant="outlined" onChange={e => setOrganisation(e.target.value)} />
                    </Tooltip>
                    <h2 className="font-sans font-semibold block pt-4 mw-40 text-xl">Account Links</h2>
                    {Object.keys(localExternalLinks).map(externalLinkKey => {
                        const name = localExternalLinks[externalLinkKey].name;
                        const isSelected = localExternalLinks[externalLinkKey].selected;

                        return (
                            <Stack
                                direction="row"
                                spacing={4}
                                alignItems="center"
                                key={externalLinkKey}
                            >
                                <ToggleButton
                                    value="check"
                                    style={{ height: '2.5rem', width: '2.5rem' }}
                                    selected={isSelected}
                                    onChange={() => {
                                        let existingExternalLinks = localExternalLinks;
                                        existingExternalLinks[externalLinkKey].selected = !(existingExternalLinks[externalLinkKey].selected);
                                        setExternalLinks(JSON.stringify(existingExternalLinks));
                                    }}
                                >
                                    <Check />
                                </ToggleButton>
                                <span className="font-sans font-semibold" style={{ filter: isSelected ? 'opacity(1)' : 'opacity(0.6)' }}>{name}</span>
                                <Tooltip title={isSelected ? 'Enter a username' : 'You must first select this option on the left before adding a username'}>
                                    <TextField
                                        label="Username"
                                        variant="outlined"
                                        disabled={!isSelected}
                                        onChange={e => {
                                            let existingExternalLinks = localExternalLinks;
                                            existingExternalLinks[externalLinkKey].value = e.target.value;
                                            setExternalLinks(JSON.stringify(existingExternalLinks));
                                        }}
                                    />
                                </Tooltip>
                            </Stack>
                        )
                    })}
                    <Button
                        variant="outlined"
                        className="w-20"
                        onClick={createAccount}
                    >
                        Create
                    </Button>
                </Stack>
            </div>
        )   
    }
}