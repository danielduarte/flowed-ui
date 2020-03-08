import React from 'react';
import Editor from './components/Editor/Editor';
import Layout from './containers/Layout/Layout';


function App() {

  const flowSpec = '{ "tasks": {} }';

  return (
    <Layout>
      <Editor code={flowSpec}/>
    </Layout>
  );
}

export default App;
