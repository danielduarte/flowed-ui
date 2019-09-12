const yafeFlowSpec = {

        "tasks": {
            "getPersonIdFromPath": {
                "requires": [
                    "path_params"
                ],
                "provides": [
                    "id_param"
                ],
                "resolver": {
                    "name": "merge-result",
                    "params": {
                        "obj1": {
                            "value": {}
                        },
                        "obj2": "path_params",
                        "template": {
                            "value": {
                                "id": "{{o2.personId}}"
                            }
                        }
                    },
                    "results": {
                        "merged_object": "id_param"
                    }
                }
            },
            "getPersonInfo": {
                "requires": [
                    "id_param"
                ],
                "provides": [
                    "person_info_response"
                ],
                "resolver": {
                    "name": "resolve-openapi-call",
                    "params": {
                        "serviceId": {
                            "value": "microservice-users"
                        },
                        "operationId": {
                            "value": "PersonController_findById"
                        },
                        "params": "id_param"
                    },
                    "results": {
                        "body": "person_info_response"
                    }
                }
            },
            "getCredentialInfo": {
                "requires": [
                    "id_param"
                ],
                "provides": [
                    "credential_info_response"
                ],
                "resolver": {
                    "name": "resolve-openapi-call",
                    "params": {
                        "serviceId": {
                            "value": "microservice-auth"
                        },
                        "operationId": {
                            "value": "UserController_findById"
                        },
                        "params": "id_param"
                    },
                    "results": {
                        "body": "credential_info_response"
                    }
                }
            },
            "mergeCredentialAndPersonInfoResponses": {
                "requires": [
                    "credential_info_response",
                    "person_info_response"
                ],
                "provides": [
                    "person_profile_response"
                ],
                "resolver": {
                    "name": "merge-result",
                    "params": {
                        "obj1": "credential_info_response",
                        "obj2": "person_info_response"
                    },
                    "results": {
                        "merged_object": "person_profile_response"
                    }
                }
            },
            "prepareResponse": {
                "requires": [
                    "person_profile_response"
                ],
                "provides": [
                    "response"
                ],
                "resolver": {
                    "name": "prepare-response",
                    "params": {
                        "headers": {
                            "value": {
                                "content-type": "application/json"
                            }
                        },
                        "body": "person_profile_response",
                        "status": {
                            "value": "200"
                        }
                    },
                    "results": {
                        "response": "response"
                    }
                }
            }
        }

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
window.addEventListener('resize', () => { render(yafeFlowSpec); });

const code = document.getElementById('code');
code.addEventListener('keydown', (event) => {
    console.log(event.target.value);
});
