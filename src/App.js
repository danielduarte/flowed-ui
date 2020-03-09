import React, {useState} from 'react';
import Editor from './components/Editor/Editor';
import Layout from './containers/Layout/Layout';

const initialSpec = {
  tasks: {
    sqr1: {
      requires: ['c1'],
      provides: ['c1^2'],
      resolver: {
        name: 'sqr',
        params: { x: 'c1' },
        results: { result: 'c1^2' },
      },
    },
    sqr2: {
      requires: ['c2'],
      provides: ['c2^2'],
      resolver: {
        name: 'sqr',
        params: { x: 'c2' },
        results: { result: 'c2^2' },
      },
    },
    sum: {
      requires: ['c1^2', 'c2^2'],
      provides: ['sum'],
      resolver: {
        name: 'sum',
        params: { x: 'c1^2', y: 'c2^2' },
        results: { result: 'sum' },
      },
    },
    sqrt: {
      requires: ['sum'],
      provides: ['result'],
      resolver: {
        name: 'sqrt',
        params: { x: 'sum' },
        results: { result: 'result' },
      },
    },
  },
};

function App() {
  let [viewType, changeViewType] = useState('split');
  let [spec, changeSpec] = useState(initialSpec);

  return (
    <Layout
      selectedViewType={viewType}
      onViewTypeChange={changeViewType} >

      <Editor
        spec={spec}
        viewType={viewType}
        onChangeSpec={changeSpec} />
    </Layout>
  );
}

export default App;
