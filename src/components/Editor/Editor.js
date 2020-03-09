import React from 'react';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import classes from './Editor.module.css';
import SplitPane from '../../components/ui/SplitPane/SplitPane';

const editor = props => {

  const leftPaneWidth = props.viewType === 'code' ? '100%' : props.viewType === 'diagram' ? '0%' : '25%';

  return (
    <SplitPane
      className={classes.Editor}
      defaultSize={leftPaneWidth}
      size={leftPaneWidth}
      onDragFinished={window.zoomFlow} >

      <AceEditor
        className={classes.left}
        value={JSON.stringify(props.code, null, '  ')}
        mode="javascript"
        theme="github"
        showPrintMargin={false}
        setOptions={{tabSize: 2}}
        width={'100%'}
        height={'100%'} />

      <div
        id="rete"
        className={classes.right} />
    </SplitPane>
  );
};

export default editor;
