import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { utcToRelative } from 'utctorelative';
import InfoContainer from '../components/ui/InfoContainer';
import fetch from '../firebase/fetch';

import Header from '../Header';

export default function Issue() {
    const [issueInfo, setIssueInfo] = useState('Loading');

    const splitPathname = window.location.pathname.split('/');
    const issueTopic = splitPathname[2];
    const issueId = splitPathname[3];

    useEffect(() => {
        fetch(`/issues/${issueTopic}/${issueId}`).then(fetchedIssueInfo => {
            setIssueInfo(JSON.stringify(fetchedIssueInfo));
        });
    }, []);

    if (issueInfo === 'Loading') {
        return (
            <div>
                <Header Title="Loading - Issue" />
                <InfoContainer Title="Loading" Description="Loading page content" />
            </div>
        )
    } else if (!issueInfo) {
        return (
            <div>
                <Header Title="Issue Not Found" />
                <InfoContainer Title="Issue Not Found" Description="This issue has not been found!" className="mb-8" />
                <Link to="/">
                    <Button variant="outlined">
                        Home
                    </Button>
                </Link>
            </div>
        )
    } else {
        const parsedInfo = JSON.parse(issueInfo);

        return (
            <div>
                <Header Title={`${parsedInfo.name}`} />
                <InfoContainer Title={parsedInfo.name} Description={utcToRelative(parsedInfo.created)} />
            </div>
        )
    }
}