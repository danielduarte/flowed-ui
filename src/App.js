import React, {useState} from 'react';
import Editor from './components/Editor/Editor';
import Layout from './containers/Layout/Layout';


function App() {
  let [viewType, changeViewType] = useState('split');

  const flowSpec = '{ "tasks": {} }';

  return (
    <Layout selectedViewType={viewType} onViewTypeChange={changeViewType}>
      <Editor code={flowSpec} viewType={viewType}/>
    </Layout>
  );
}

export default App;
