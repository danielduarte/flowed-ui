import React from 'react';

import { TextArea } from '@blueprintjs/core';

import classes from './Editor.module.css';

import SplitPane from '../../components/ui/SplitPane/SplitPane';

const editor = props => (
  <SplitPane className={classes.Editor} defaultSize="50%">
    <TextArea className={classes.left} value={props.code} />
    <div className={classes.right}>RIGHT</div>
  </SplitPane>
);

export default editor;
