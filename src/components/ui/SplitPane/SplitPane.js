import React from 'react';
import SplitPane from 'react-split-pane';
import classes from './SplitPane.module.css';

const splitPane = props => {

  // Join delegated classes with SplitPane internal class
  const classNames = [classes.SplitPane];
  if (props.className) {
    classNames.push(props.className);
  }

  return (
    <SplitPane {...props} className={classNames.join(' ')}>
      {props.children}
    </SplitPane>
  );
};

export default splitPane;
