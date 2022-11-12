const yafeFlowSpec = {


            "tasks": {
                "prepareParams": {
                    "requires": [
                        "path_params",
                        "query_params"
                    ],
                    "provides": [
                        "merged_params"
                    ],
                    "resolver": {
                        "name": "merge-result",
                        "params": {
                            "obj1": "path_params",
                            "obj2": "query_params"
                        },
                        "results": {
                            "merged_object": "merged_params"
                        }
                    }
                },
                "callApi": {
                    "requires": [
                        "merged_params"
                    ],
                    "provides": [
                        "headers",
                        "body",
                        "status"
                    ],
                    "resolver": {
                        "name": "resolve-openapi-call",
                        "params": {
                            "serviceId": {
                                "value": "microservice-catalog"
                            },
                            "operationId": {
                                "value": "ProductController_findByAsset"
                            },
                            "params": "merged_params"
                        },
                        "results": {
                            "headers": "headers",
                            "body": "body",
                            "status": "status"
                        }
                    }
                },
                "postProcessBody": {
                    "requires": ["body"],
                    "provides": ["processedBody"],
                    "resolver": {
                        "name": "merge-result",
                        "params": {
                            "obj1": "body",
                            "template": {
                                "value": {
                                    "{{#each o1}}": {
                                        "id": "{{id}}",
                                        "entityType": "product"
                                    }
                                }
                            }
                        },
                        "results": {
                            "merged_object": "processedBody"
                        }
                    }
                },
                "prepareResponse": {
                    "requires": [
                        "headers",
                        "processedBody",
                        "status"
                    ],
                    "provides": [
                        "response"
                    ],
                    "resolver": {
                        "name": "prepare-response",
                        "params": {
                            "headers": "headers",
                            "body": "processedBody",
                            "status": "status"
                        },
                        "results": {
                            "response": "response"
                        }
                    }
                }
            }
        }

;


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

const render = (yafeFlowSpec) => {
    document.getElementById('rete').innerHTML = '';
    elk.layout(elkFlow)
        .then(function () {
            const reteFlow = Flow.yafeToReteFlowSpec(yafeFlowSpec);
            applyPosition(reteFlow, elkFlow);
            Flow.renderFlow('rete', reteFlow, getComponentNames(yafeFlowSpec));
        })
        .catch(console.error);
};

render(yafeFlowSpec);

document.getElementById('code').value = JSON.stringify(yafeFlowSpec, null, 2) + '\n';

const code = document.getElementById('code');

let currentTimeout = null;
code.addEventListener('keydown', (event) => {
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => {
        const spec = JSON.parse(event.target.value);
        render(spec);
    }, 1000);
});
