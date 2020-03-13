import React, {useState} from 'react';
import Editor from './components/Editor/Editor';
import Layout from './containers/Layout/Layout';

const initialSpec = {
  "tasks": {
    "sqr1": {
      "provides": [
        "sqr1_result"
      ],
      "resolver": {
        "name": "sqr",
        "results": {
          "result": "sqr1_result"
        }
      }
    },
    "sqr2": {
      "provides": [
        "sqr2_result"
      ],
      "resolver": {
        "name": "sqr",
        "results": {
          "result": "sqr2_result"
        }
      }
    },
    "sum": {
      "requires": [
        "sqr1_result",
        "sqr2_result"
      ],
      "provides": [
        "sum_result"
      ],
      "resolver": {
        "name": "sum",
        "params": {
          "x": "sqr1_result",
          "y": "sqr2_result"
        },
        "results": {
          "result": "sum_result"
        }
      }
    },
    "sqrt": {
      "requires": [
        "sum_result"
      ],
      "provides": [
        "result"
      ],
      "resolver": {
        "name": "sqrt",
        "params": {
          "x": "sum_result"
        }
      }
    }
  }
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
