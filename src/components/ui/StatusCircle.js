import React from 'react';

import classes from './StatusCircle.module.css';
import getColor from '../../scripts/getColor';

export default function StatusCircle({ status }) {
    return (
        <span className={classes.statusCircle} style={{ backgroundColor: getColor(status) }}></span>
    )
}