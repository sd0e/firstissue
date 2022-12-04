import { AccountCircleOutlined, DeleteForeverOutlined, EditAttributesOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { Button, Dialog } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { utcToRelative } from 'utctorelative';

import InfoContainer from '../components/ui/InfoContainer';
import StatusCircle from '../components/ui/StatusCircle';
import fetch from '../firebase/fetch';
import write from '../firebase/write';
import Header from '../Header';
import getColor from '../scripts/getColor';

export default function Issue(user) {
    const [issueInfo, setIssueInfo] = useState('Loading');
    const [changeStatusOpen, setChangeStatusOpen] = useState(false);

    let navigate = useNavigate();

    const splitPathname = window.location.pathname.split('/');
    const issueTopic = splitPathname[2];
    const issueId = splitPathname[3];

    useEffect(() => {
        fetch(`/issues/${issueTopic}/${issueId}`).then(fetchedIssueInfo => {
            fetchedIssueInfo === null ? setIssueInfo(null) : setIssueInfo(JSON.stringify(fetchedIssueInfo));
        });
    }, []);

    const deleteIssue = () => {
        write(`/users/${JSON.parse(issueInfo).creator}/public/issues/${issueId}`, null).then(() => {
            write(`/issues/${issueTopic}/${issueId}`, null).then(() => {
                write(`/allIssues/${issueId}`, null).then(() => {
                    navigate('/account');
                });
            });
        });
    }

    const changeStatus = newStatus => {
        setChangeStatusOpen(false);
        if (newStatus === 'available' || newStatus === 'assigned') {
            write(`/issues/${issueTopic}/${issueId}/status`, newStatus).then(() => {
                window.location.reload();
            });
        } else deleteIssue();
    }

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

        const color = getColor(parsedInfo.status);

        return (
            <div>
                <Dialog onClose={() => setChangeStatusOpen(false)} open={changeStatusOpen}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#191919' }}>
                        <Stack direction="column" spacing={2}>
                            <Button variant="outlined" color="success" onClick={() => changeStatus('available')}>Available</Button>
                            <Button variant="outlined" color="secondary" onClick={() => changeStatus('assigned')}>Assigned</Button>
                            <Button variant="outlined" color="error" onClick={() => changeStatus('closed')}>Closed</Button>
                        </Stack>
                    </div>
                </Dialog>
                <Header Title={`${parsedInfo.name}`} />
                <InfoContainer Title={parsedInfo.name} Description={utcToRelative(parsedInfo.created)} />
			    <h1 className="font-semibold font-sans text-l text-semivisible mt-2">
                    <AccountCircleOutlined fontSize="small" style={{ marginRight: '0.5rem' }} />
                    <Link to={`/profile/${parsedInfo.creator}`} style={{ textDecoration: 'underline' }}>{parsedInfo.creatorDisplayName}</Link>
                </h1>
                <div style={{ margin: '1.5rem 0rem', maxWidth: 'max-content' }}>
                    <StatusCircle status={parsedInfo.status} />
                    <span className="font-semibold font-sans text-l mt-2" style={{ textTransform: 'capitalize', color: color, filter: 'opacity(0.8)', marginLeft: '0.5rem' }}>{parsedInfo.status}</span>
                </div>
                <Stack direction="row" spacing={2}>
                    <a href={parsedInfo.link} target="_blank">
                        <Button variant="outlined" color="primary">
                            <OpenInNewOutlined fontSize="small" className="mr-2" />
                            Open Issue
                        </Button>
                    </a>
                    { user.user && user.user.uid === parsedInfo.creator && <Button variant="outlined" color="secondary" onClick={() => setChangeStatusOpen(true)}>
                        <EditAttributesOutlined fontSize="small" className="mr-2" />
                        Change Status
                    </Button> }
                    { user.user && user.user.uid === parsedInfo.creator && <Button variant="outlined" color="error" onClick={deleteIssue}>
                        <DeleteForeverOutlined fontSize="small" className="mr-2" />
                        Delete Issue
                    </Button> }
                </Stack>
                { user.user && user.user.isAdmin && <Stack direction="row" spacing={2} style={{ marginTop: '1.5rem' }}>
                    <Button variant="outlined" color="error" onClick={deleteIssue}>
                        <DeleteForeverOutlined fontSize="small" style={{ marginRight: '0.5rem' }} />
                        Delete Issue
                    </Button>
                </Stack> }
            </div>
        )
    }
}