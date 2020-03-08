import React from 'react';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import classes from './Editor.module.css';
import SplitPane from '../../components/ui/SplitPane/SplitPane';

const editor = props => (
  <SplitPane className={classes.Editor} defaultSize="50%">
    <AceEditor
      className={classes.left}
      value={props.code}
      mode="javascript"
      theme="github"
      showPrintMargin={false}
      setOptions={{ tabSize: 2 }}
      width={'100%'}
      height={'100%'} />

    <div
      className={classes.right}
      style={{'backgroundColor': 'blue'}}>
      RIGHT
    </div>
  </SplitPane>
);

export default editor;
