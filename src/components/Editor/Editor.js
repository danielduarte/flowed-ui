import React from 'react';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import classes from './Editor.module.css';
import SplitPane from '../../components/ui/SplitPane/SplitPane';
import Flowed from '../Flowed/Flowed';


const editor = props => {
  const leftPaneWidth = props.viewType === 'code' ? '100%' : props.viewType === 'diagram' ? '0%' : '25%';

  const handleOnValidate = (annotations) => {

  };

  const handleCodeChange = (code) => {
    try {
      const newSpec = JSON.parse(code);
      props.onChangeSpec(newSpec);
    } catch (error) {
      if (error.constructor.name === 'SyntaxError') {
        // Do not propagate the change, since the JSON has syntax errors
      } else {
        throw error;
      }
    }
  };

  if (window.Flow.renderFlow) {
    window.Flow.init(props.spec);
    window.Flow.renderFlow();
  }

  return (
    <SplitPane
      className={classes.Editor}
      defaultSize={leftPaneWidth}
      size={leftPaneWidth}
      onChange={() => window.Flow.zoomFlow()} >

      <AceEditor
        className={classes.left}
        value={JSON.stringify(props.spec, null, '  ')}
        mode="javascript"
        theme="github"
        showPrintMargin={false}
        setOptions={{tabSize: 2}}
        width={'100%'}
        height={'100%'}
        onChange={handleCodeChange}
        onValidate={handleOnValidate}/>

      <Flowed
        className={classes.right}
        spec={props.spec}/>
    </SplitPane>
  );
};

export default editor;
