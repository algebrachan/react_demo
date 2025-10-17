export default {
  "nodes": [
    {
      "id": "开始",
      "type": "bpmn:startEvent",
      "x": 100,
      "y": 0,
      "properties": {
        "width": 36,
        "height": 36
      },
      "text": {
        "x": 100,
        "y": 0,
        "value": "开始"
      }
    },
    {
      "id": "编制审核方案",
      "type": "bpmn:serviceTask",
      "x": 100,
      "y": 100,
      "properties": {
        "width": 100,
        "height": 60
      },
      "text": {
        "x": 100,
        "y": 100,
        "value": "编制审核方案"
      }
    },
    {
      "id": "编制审核实施计划",
      "type": "bpmn:serviceTask",
      "x": 100,
      "y": 200,
      "properties": {
        "width": 100,
        "height": 60
      },
      "text": {
        "x": 100,
        "y": 200,
        "value": "编制审核实施计划"
      }
    },
    {
      "id": "管理者代表审核",
      "type": "bpmn:exclusiveGateway",
      "x": 100,
      "y": 310,
      "properties": {
        "width": 50,
        "height": 50
      },
      "text": {
        "x": 100,
        "y": 350,
        "value": "管理者代表审核"
      }
    },
    {
      "id": "总经理核准",
      "type": "bpmn:exclusiveGateway",
      "x": 100,
      "y": 416,
      "properties": {
        "width": 50,
        "height": 50
      },
      "text": {
        "x": 100,
        "y": 456,
        "value": "总经理核准"
      }
    },
    {
      "id": "审核计划公示",
      "type": "bpmn:serviceTask",
      "x": 100,
      "y": 531,
      "properties": {
        "width": 100,
        "height": 60
      },
      "text": {
        "x": 100,
        "y": 531,
        "value": "审核计划公示"
      }
    }
  ],
  "edges": [
    {
      "id": "Flow_86d0f8e",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "开始",
      "targetNodeId": "变更申请",
      "sourceAnchorId": "开始_2",
      "targetAnchorId": "变更申请_0",
      "startPoint": {
        "x": 100,
        "y": 18
      },
      "endPoint": {
        "x": 100,
        "y": 70
      },
      "pointsList": [
        {
          "x": 100,
          "y": 18
        },
        {
          "x": 100,
          "y": 48
        },
        {
          "x": 100,
          "y": 48
        },
        {
          "x": 100,
          "y": 40
        },
        {
          "x": 100,
          "y": 40
        },
        {
          "x": 100,
          "y": 70
        }
      ]
    },
    {
      "id": "Flow_3e419c7",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "变更申请",
      "targetNodeId": "变更受理",
      "sourceAnchorId": "变更申请_2",
      "targetAnchorId": "变更受理_0",
      "startPoint": {
        "x": 100,
        "y": 130
      },
      "endPoint": {
        "x": 100,
        "y": 170
      },
      "pointsList": [
        {
          "x": 100,
          "y": 130
        },
        {
          "x": 100,
          "y": 160
        },
        {
          "x": 100,
          "y": 160
        },
        {
          "x": 100,
          "y": 140
        },
        {
          "x": 100,
          "y": 140
        },
        {
          "x": 100,
          "y": 170
        }
      ]
    },
    {
      "id": "Flow_71cbda1",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "变更受理",
      "targetNodeId": "研发技术部审批1",
      "sourceAnchorId": "变更受理_2",
      "targetAnchorId": "研发技术部审批1_0",
      "startPoint": {
        "x": 100,
        "y": 230
      },
      "endPoint": {
        "x": 100,
        "y": 285
      },
      "pointsList": [
        {
          "x": 100,
          "y": 230
        },
        {
          "x": 100,
          "y": 260
        },
        {
          "x": 100,
          "y": 260
        },
        {
          "x": 100,
          "y": 255
        },
        {
          "x": 100,
          "y": 255
        },
        {
          "x": 100,
          "y": 285
        }
      ]
    },
    {
      "id": "Flow_cb9c3c0",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "研发技术部审批1",
      "targetNodeId": "总经理审批1",
      "sourceAnchorId": "研发技术部审批1_2",
      "targetAnchorId": "总经理审批1_0",
      "startPoint": {
        "x": 100,
        "y": 335
      },
      "endPoint": {
        "x": 100,
        "y": 391
      },
      "pointsList": [
        {
          "x": 100,
          "y": 335
        },
        {
          "x": 100,
          "y": 365
        },
        {
          "x": 100,
          "y": 365
        },
        {
          "x": 100,
          "y": 361
        },
        {
          "x": 100,
          "y": 361
        },
        {
          "x": 100,
          "y": 391
        }
      ]
    },
    {
      "id": "Flow_e56a102",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "总经理审批1",
      "targetNodeId": "测试需求单",
      "sourceAnchorId": "总经理审批1_2",
      "targetAnchorId": "测试需求单_0",
      "startPoint": {
        "x": 100,
        "y": 441
      },
      "endPoint": {
        "x": 100,
        "y": 496
      },
      "pointsList": [
        {
          "x": 100,
          "y": 441
        },
        {
          "x": 100,
          "y": 471
        },
        {
          "x": 100,
          "y": 471
        },
        {
          "x": 100,
          "y": 466
        },
        {
          "x": 100,
          "y": 466
        },
        {
          "x": 100,
          "y": 496
        }
      ]
    },
    {
      "id": "Flow_9cc6e0c",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "总经理审批1",
      "targetNodeId": "变更受理",
      "sourceAnchorId": "总经理审批1_1",
      "targetAnchorId": "变更受理_1",
      "startPoint": {
        "x": 125,
        "y": 416
      },
      "endPoint": {
        "x": 150,
        "y": 200
      },
      "text": {
        "x": 158.5,
        "y": 416,
        "value": "驳回"
      },
      "pointsList": [
        {
          "x": 125,
          "y": 416
        },
        {
          "x": 192,
          "y": 416
        },
        {
          "x": 192,
          "y": 200
        },
        {
          "x": 150,
          "y": 200
        }
      ]
    },
    {
      "id": "Flow_d36fe9e",
      "type": "bpmn:sequenceFlow",
      "properties": {},
      "sourceNodeId": "研发技术部审批1",
      "targetNodeId": "变更受理",
      "sourceAnchorId": "研发技术部审批1_3",
      "targetAnchorId": "变更受理_3",
      "startPoint": {
        "x": 75,
        "y": 310
      },
      "endPoint": {
        "x": 50,
        "y": 200
      },
      "text": {
        "x": 37,
        "y": 310,
        "value": "驳回"
      },
      "pointsList": [
        {
          "x": 75,
          "y": 310
        },
        {
          "x": -1,
          "y": 310
        },
        {
          "x": -1,
          "y": 200
        },
        {
          "x": 50,
          "y": 200
        }
      ]
    }
  ]
}
