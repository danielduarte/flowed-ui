function addEdgesElk(resultSpec, inputEdges, outputEdges, edgeNum) {
    for (let i = 0; i < inputEdges.length; i++) {
        const edgeInSide = inputEdges[i];
        for (let j = 0; j < outputEdges.length; j++) {
            const edgeOutSide = outputEdges[j];

            resultSpec.edges.push({
                id: "e" + edgeNum,
                sources: [ edgeOutSide.task ],
                targets: [ edgeInSide.task ]
            });
        }
    }
}

function yafeToElkFlowSpec(yafeFlowSpec) {
    const resultSpec = {
        id: "root",
        layoutOptions: { 'elk.algorithm': 'layered' },
        children: [],
        edges: []
    };

    for (const taskCode in yafeFlowSpec.tasks) if (yafeFlowSpec.tasks.hasOwnProperty(taskCode)) {
        resultSpec.children.push({ id: taskCode, width: 30, height: 30 });
    }

    let edgeNum = 0;
    const edgesByReq = Flow.calculateEdgesByReq(yafeFlowSpec);
    for (const reqName in edgesByReq) if (edgesByReq.hasOwnProperty(reqName)) {
        const edges = edgesByReq[reqName];

        if (edges.hasOwnProperty('inputs') && edges.hasOwnProperty('outputs')) {
            addEdgesElk(resultSpec, edges.inputs, edges.outputs, edgeNum++);
        }
    }

    return resultSpec;
}

function applyPosition(reteFlow, elkFlow) {
    for (let i = 0; i < elkFlow.children.length; i++) {
        const elkNode = elkFlow.children[i];

        reteFlow.nodes[elkNode.id].position[0] = elkNode.x * 8;
        reteFlow.nodes[elkNode.id].position[1] = elkNode.y * 8;
    }
}
