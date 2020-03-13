window.Flow = {
  convertTask: function (taskSpec, taskId) {
    const resolver = taskSpec.resolver;

    const inputs = {};
    Object.keys(resolver.params || {}).map(paramName => {
      inputs[paramName] = {connections: []};
    });

    const outputs = {};
    Object.keys(resolver.results || {}).map(resultName => {
      outputs[resultName] = {connections: []};
    });

    return {
      id: taskId,
      data: {},
      inputs: inputs,
      outputs: outputs,
      position: [0, 0],
      name: resolver.name,
    };
  },

  addEdges: function (resultSpec, inputEdges, outputEdges) {
    for (let i = 0; i < inputEdges.length; i++) {
      const edgeInSide = inputEdges[i];

      for (let j = 0; j < outputEdges.length; j++) {
        const edgeOutSide = outputEdges[j];

        resultSpec.nodes[edgeInSide.task].inputs[edgeInSide.param].connections.push({
          node: edgeOutSide.task,
          output: edgeOutSide.result,
          data: {}
        });
        resultSpec.nodes[edgeOutSide.task].outputs[edgeOutSide.result].connections.push({
          node: edgeInSide.task,
          input: edgeInSide.param,
          data: {}
        });
      }
    }
  },

  convertEdges: function (resultSpec, edgesByReq) {
    Object.keys(edgesByReq).map(reqName => {
      const edges = edgesByReq[reqName];

      if (edges.hasOwnProperty('inputs') && edges.hasOwnProperty('outputs')) {
        Flow.addEdges(resultSpec, edges.inputs, edges.outputs);
      }
    });
  },

  calculateEdgesByReq: function (yafeFlowSpec) {
    const edgesByReq = {};

    Object.keys(yafeFlowSpec.tasks).map(taskCode => {

      const taskSpec = yafeFlowSpec.tasks[taskCode];

      for (const paramName in taskSpec.resolver.params) if (taskSpec.resolver.params.hasOwnProperty(paramName)) {
        const reqName = taskSpec.resolver.params[paramName];
        if (!edgesByReq.hasOwnProperty(reqName)) {
          edgesByReq[reqName] = {};
        }
        if (!edgesByReq[reqName].hasOwnProperty('inputs')) {
          edgesByReq[reqName].inputs = [];
        }

        edgesByReq[reqName].inputs.push({
          task: taskCode,
          param: paramName
        });
      }

      for (const resultName in taskSpec.resolver.results) if (taskSpec.resolver.results.hasOwnProperty(resultName)) {
        const reqName = taskSpec.resolver.results[resultName];
        if (!edgesByReq.hasOwnProperty(reqName)) {
          edgesByReq[reqName] = {};
        }
        if (!edgesByReq[reqName].hasOwnProperty('outputs')) {
          edgesByReq[reqName].outputs = [];
        }

        edgesByReq[reqName].outputs.push({
          task: taskCode,
          result: resultName
        });
      }
    });

    return edgesByReq;
  },

  yafeToReteFlowSpec: function (yafeFlowSpec) {
    const nodes = {};
    let taskId = 0;

    for (const [taskCode, taskSpec] of Object.entries(yafeFlowSpec.tasks)) {
      nodes[taskCode] = Flow.convertTask(taskSpec, taskId++);
    }

    const edgesByReq = Flow.calculateEdgesByReq(yafeFlowSpec);

    const resultSpec = {
      id: "retejs@0.1.0",
      nodes: nodes,
    };

    Flow.convertEdges(resultSpec, edgesByReq);

    return resultSpec;
  },

  createComponent: function (componentName, inputs, outputs, socket) {
    return new (class extends Rete.Component {
      constructor() {
        super(componentName);
      }

      builder(node) {
        inputs.map(function (inputName) {
          node.addInput(new Rete.Input(inputName, inputName, socket));
        });

        outputs.map(function (inputName) {
          node.addOutput(new Rete.Output(inputName, inputName, socket));
        });

        return node;
      }
    })();
  },

  renderFlowEditor: function (elementId, reteFlowSpec, componentDefs) {

    // Rete active plugins
    const plugins = [ConnectionPlugin, VueRenderPlugin, ContextMenuPlugin];

    // Rete components (created dynamically)
    const components = [];
    const socket = new Rete.Socket('');
    componentDefs.map(function (componentDef) {
      components.push(Flow.createComponent(
        componentDef.name,
        componentDef.inputs,
        componentDef.outputs,
        socket,
      ));
    });

    // Create and setup Rete editor
    const container = document.getElementById(elementId);
    const editor = new Rete.NodeEditor('retejs@0.1.0', container);
    plugins.map(plugin => editor.use(plugin.default));
    components.map(c => editor.register(c));

    // Load flow data and render
    editor.fromJSON(reteFlowSpec).then(() => {
      editor.view.resize();
      AreaPlugin.zoomAt(editor);
    });

    return editor;
  },

  addEdgesElk: function (resultSpec, inputEdges, outputEdges, edgeNum) {
    for (let i = 0; i < inputEdges.length; i++) {
      const edgeInSide = inputEdges[i];
      for (let j = 0; j < outputEdges.length; j++) {
        const edgeOutSide = outputEdges[j];

        resultSpec.edges.push({
          id: "e" + edgeNum,
          sources: [edgeOutSide.task],
          targets: [edgeInSide.task]
        });
      }
    }
  },

  applyPosition: function (reteFlow, elkFlow) {
    for (let i = 0; i < elkFlow.children.length; i++) {
      const elkNode = elkFlow.children[i];

      reteFlow.nodes[elkNode.id].position[0] = elkNode.x * 8;
      reteFlow.nodes[elkNode.id].position[1] = elkNode.y * 8;
    }
  },

  getComponentNames: function (yafeFlowSpec) {
    const names = [];
    const comps = Object.keys(yafeFlowSpec.tasks).map(taskName => (
      names.indexOf(yafeFlowSpec.tasks[taskName].resolver.name) === -1 ? (
        names.push(yafeFlowSpec.tasks[taskName].resolver.name), {
          name: yafeFlowSpec.tasks[taskName].resolver.name,
          inputs: Object.keys(yafeFlowSpec.tasks[taskName].resolver.params || {}),
          outputs: Object.keys(yafeFlowSpec.tasks[taskName].resolver.results || {}),
        }
      ) : null
    ));

    return comps.filter(comp => comp !== null);
  },

  yafeToElkFlowSpec: function (yafeFlowSpec) {
    const resultSpec = {
      id: "root",
      layoutOptions: {'elk.algorithm': 'layered'},
      children: [],
      edges: []
    };

    for (const taskCode in yafeFlowSpec.tasks) if (yafeFlowSpec.tasks.hasOwnProperty(taskCode)) {
      resultSpec.children.push({id: taskCode, width: 30, height: 30});
    }

    let edgeNum = 0;
    const edgesByReq = Flow.calculateEdgesByReq(yafeFlowSpec);
    for (const reqName in edgesByReq) if (edgesByReq.hasOwnProperty(reqName)) {
      const edges = edgesByReq[reqName];

      if (edges.hasOwnProperty('inputs') && edges.hasOwnProperty('outputs')) {
        Flow.addEdgesElk(resultSpec, edges.inputs, edges.outputs, edgeNum++);
      }
    }

    return resultSpec;
  },

  init: function (spec) {
    window.document.getElementById('rete').innerHTML = '';

    Flow.elkFlow = Flow.yafeToElkFlowSpec(spec);
    Flow.elk = new window.ELK();

    Flow.renderFlow = function () {
      Flow.elk.layout(Flow.elkFlow)
        .then(function () {
          const reteFlow = Flow.yafeToReteFlowSpec(spec);

          Flow.applyPosition(reteFlow, Flow.elkFlow);
          Flow.flowEditor = Flow.renderFlowEditor('rete', reteFlow, Flow.getComponentNames(spec));
          Flow.flowEditor.on('selectnode', ({node}) => {
            // console.log(node);
          });
        })
        .catch(console.error);
    };

    Flow.zoomFlow = function () {
      Flow.flowEditor.view.resize();
      window.AreaPlugin.zoomAt(Flow.flowEditor);
    };

    Flow.flowEditor = null;
    window.addEventListener('resize', function () {
      if (Flow.flowEditor !== null) {
        Flow.zoomFlow();
      }
    });
  }
};
