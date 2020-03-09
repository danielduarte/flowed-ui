const yafeFlowSpec = {
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


const elkFlow = yafeToElkFlowSpec(yafeFlowSpec);

const elk = new ELK();


function getComponentNames(yafeFlowSpec) {
    const names = [];
    const comps = Object.keys(yafeFlowSpec.tasks).map(taskName => (
        names.indexOf(yafeFlowSpec.tasks[taskName].resolver.name) === -1 ? (
            names.push(yafeFlowSpec.tasks[taskName].resolver.name), {
                name: yafeFlowSpec.tasks[taskName].resolver.name,
                inputs: Object.keys(yafeFlowSpec.tasks[taskName].resolver.params),
                outputs: Object.keys(yafeFlowSpec.tasks[taskName].resolver.results),
            }
        ) : null
    ));

    return comps.filter(comp => comp !== null);
}

window.renderFlow = function () {
  elk.layout(elkFlow)
    .then(function() {

      const reteFlow = Flow.yafeToReteFlowSpec(yafeFlowSpec);

      applyPosition(reteFlow, elkFlow);
      window.flowEditor = Flow.renderFlow('rete', reteFlow, getComponentNames(yafeFlowSpec));


      window.flowEditor.on('selectnode', ({node}) => {
        // console.log(node);
      });


    })
    .catch(console.error);
};

window.zoomFlow = function () {
  window.flowEditor.view.resize();
  AreaPlugin.zoomAt(window.flowEditor);
};

window.flowEditor = null;
window.addEventListener('resize', function () {
  if (window.flowEditor !== null) {
    window.zoomFlow();
  }
});
