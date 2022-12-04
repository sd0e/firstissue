import React from 'react';
import { utcToRelative } from 'utctorelative';
import { Link } from 'react-router-dom';

export default function IssueList({ list, showAssigned = false, getTopicId, topicValue, type = 'topic' }) {
    if (type === 'topic') {
        return (
            <div style={{ border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem' }}>
                { Object.keys(list).map((issueId, index) => {
                    const issueInfo = list[issueId];
                    if (issueInfo.status === 'assigned' && !showAssigned) {
                        return;
                    } else {
                        return <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }} key={issueId}>
                            <Link to={`/issue/${getTopicId(topicValue)}/${issueId}`} className="text-brand font-sans font-bold">{issueInfo.name}</Link>
                            <span className="text-semivisible font-sans text-s">{ utcToRelative(issueInfo.created) }</span>
                        </div>;
                    }
                }) }
            </div>
        )
    } else {
        return (
            <div style={{ border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem' }}>
                { Object.keys(list).map((issueIdx, index) => {
                    const issueInfo = list[issueIdx];
                    if (issueInfo.status === 'assigned' && !showAssigned) {
                        return;
                    } else {
                        return <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }} key={issueIdx}>
                            <Link to={`/issue/${issueInfo.topic}/${issueInfo.id}`} className="text-brand font-sans font-bold">{issueInfo.name}</Link>
                            <span className="text-semivisible font-sans text-s">{ utcToRelative(issueInfo.created) }</span>
                        </div>;
                    }
                }) }
            </div>
        )
    }
}