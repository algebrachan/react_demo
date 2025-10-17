const graphData = {
    nodes: [
      {
        id: "开始",
        type: "bpmn:startEvent",
        x: 325,
        y: 50,
        properties: {
          width: 36,
          height: 36,
        },
        text: {
          x: 325,
          y: 50,
          value: "开始",
        },
      },
      {
        id: "不合格品标识",
        type: "bpmn:serviceTask",
        x: 325,
        y: 150,
        properties: {
          width: 120,
          height: 80,
        },
        text: {
          x: 325,
          y: 150,
          value: "不合格品标识\n检验记录",
        },
      },
      {
        id: "不合格品隔离",
        type: "bpmn:serviceTask",
        x: 325,
        y: 250,
        properties: {
          width: 120,
          height: 60,
        },
        text: {
          x: 325,
          y: 250,
          value: "不合格品隔离",
        },
      },
      {
        id: "不合格评审",
        type: "bpmn:serviceTask",
        x: 325,
        y: 350,
        properties: {
          width: 120,
          height: 60,
        },
        text: {
          x: 325,
          y: 350,
          value: "不合格评审",
        },
      },
      {
        id: "遏制返修",
        type: "bpmn:serviceTask",
        x: 100,
        y: 500,
        properties: {
          width: 100,
          height: 60,
        },
        text: {
          x: 100,
          y: 500,
          value: "遏制返修",
        },
      },
      {
        id: "让步接收",
        type: "bpmn:serviceTask",
        x: 250,
        y: 500,
        properties: {
          width: 100,
          height: 60,
        },
        text: {
          x: 250,
          y: 500,
          value: "让步接收",
        },
      },
      {
        id: "报废",
        type: "bpmn:serviceTask",
        x: 400,
        y: 500,
        properties: {
          width: 100,
          height: 60,
        },
        text: {
          x: 400,
          y: 500,
          value: "报废",
        },
      },
      {
        id: "其他",
        type: "bpmn:serviceTask",
        x: 550,
        y: 500,
        properties: {
          width: 100,
          height: 60,
        },
        text: {
          x: 550,
          y: 500,
          value: "其他",
        },
      },
      {
        id: "质量部长审批",
        type: "bpmn:exclusiveGateway",
        x: 200,
        y: 650,
        properties: {
          width: 50,
          height: 50,
        },
        text: {
          x: 200,
          y: 700,
          value: "质量部长审批",
        },
      },
      {
        id: "总经理审批",
        type: "bpmn:exclusiveGateway",
        x: 400,
        y: 650,
        properties: {
          width: 50,
          height: 50,
        },
        text: {
          x: 400,
          y: 700,
          value: "总经理审批",
        },
      },
      {
        id: "不合格处置跟踪",
        type: "bpmn:serviceTask",
        x: 300,
        y: 800,
        properties: {
          width: 120,
          height: 60,
        },
        text: {
          x: 300,
          y: 800,
          value: "不合格处置跟踪",
        },
      },
      {
        id: "结束",
        type: "bpmn:endEvent",
        x: 300,
        y: 900,
        properties: {
          width: 36,
          height: 36,
        },
        text: {
          x: 300,
          y: 900,
          value: "结束",
        },
      },
    ],
    edges: [
      {
        id: "Flow_dc2633e",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格处置跟踪",
        targetNodeId: "结束",
        sourceAnchorId: "不合格处置跟踪_2",
        targetAnchorId: "结束_0",
        startPoint: {
          x: 300,
          y: 830,
        },
        endPoint: {
          x: 300,
          y: 882,
        },
        pointsList: [
          {
            x: 300,
            y: 830,
          },
          {
            x: 300,
            y: 860,
          },
          {
            x: 300,
            y: 860,
          },
          {
            x: 300,
            y: 852,
          },
          {
            x: 300,
            y: 852,
          },
          {
            x: 300,
            y: 882,
          },
        ],
      },
      {
        id: "Flow_19d5964",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格品隔离",
        targetNodeId: "不合格评审",
        sourceAnchorId: "不合格品隔离_2",
        targetAnchorId: "不合格评审_0",
        startPoint: {
          x: 325,
          y: 280,
        },
        endPoint: {
          x: 325,
          y: 320,
        },
        pointsList: [
          {
            x: 325,
            y: 280,
          },
          {
            x: 325,
            y: 310,
          },
          {
            x: 325,
            y: 310,
          },
          {
            x: 325,
            y: 290,
          },
          {
            x: 325,
            y: 290,
          },
          {
            x: 325,
            y: 320,
          },
        ],
      },
      {
        id: "Flow_40375fe",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格评审",
        targetNodeId: "遏制返修",
        sourceAnchorId: "不合格评审_2",
        targetAnchorId: "遏制返修_0",
        startPoint: {
          x: 325,
          y: 380,
        },
        endPoint: {
          x: 100,
          y: 470,
        },
        pointsList: [
          {
            x: 325,
            y: 380,
          },
          {
            x: 325,
            y: 411,
          },
          {
            x: 100,
            y: 411,
          },
          {
            x: 100,
            y: 470,
          },
        ],
      },
      {
        id: "Flow_6f7dff5",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "遏制返修",
        targetNodeId: "质量部长审批",
        sourceAnchorId: "遏制返修_2",
        targetAnchorId: "质量部长审批_0",
        startPoint: {
          x: 100,
          y: 530,
        },
        endPoint: {
          x: 200,
          y: 625,
        },
        pointsList: [
          {
            x: 100,
            y: 530,
          },
          {
            x: 100,
            y: 595,
          },
          {
            x: 200,
            y: 595,
          },
          {
            x: 200,
            y: 625,
          },
        ],
      },
      {
        id: "Flow_f36a813",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "质量部长审批",
        targetNodeId: "总经理审批",
        sourceAnchorId: "质量部长审批_1",
        targetAnchorId: "总经理审批_3",
        startPoint: {
          x: 225,
          y: 650,
        },
        endPoint: {
          x: 375,
          y: 650,
        },
        pointsList: [
          {
            x: 225,
            y: 650,
          },
          {
            x: 375,
            y: 650,
          },
        ],
      },
      {
        id: "Flow_46da834",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "质量部长审批",
        targetNodeId: "不合格处置跟踪",
        sourceAnchorId: "质量部长审批_2",
        targetAnchorId: "不合格处置跟踪_0",
        startPoint: {
          x: 200,
          y: 675,
        },
        endPoint: {
          x: 300,
          y: 770,
        },
        text: {
          x: 223.11111068725586,
          y: 740,
          value: "同意",
        },
        pointsList: [
          {
            x: 200,
            y: 675,
          },
          {
            x: 200,
            y: 740,
          },
          {
            x: 300,
            y: 740,
          },
          {
            x: 300,
            y: 770,
          },
        ],
      },
      {
        id: "Flow_8c19670",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "总经理审批",
        targetNodeId: "不合格处置跟踪",
        sourceAnchorId: "总经理审批_2",
        targetAnchorId: "不合格处置跟踪_0",
        startPoint: {
          x: 400,
          y: 675,
        },
        endPoint: {
          x: 300,
          y: 770,
        },
        text: {
          x: 350,
          y: 740,
          value: "同意",
        },
        pointsList: [
          {
            x: 400,
            y: 675,
          },
          {
            x: 400,
            y: 740,
          },
          {
            x: 300,
            y: 740,
          },
          {
            x: 300,
            y: 770,
          },
        ],
      },
      {
        id: "Flow_6e7c3e1",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格评审",
        targetNodeId: "报废",
        sourceAnchorId: "不合格评审_2",
        targetAnchorId: "报废_0",
        startPoint: {
          x: 325,
          y: 380,
        },
        endPoint: {
          x: 400,
          y: 470,
        },
        pointsList: [
          {
            x: 325,
            y: 380,
          },
          {
            x: 325,
            y: 425,
          },
          {
            x: 400,
            y: 425,
          },
          {
            x: 400,
            y: 470,
          },
        ],
      },
      {
        id: "Flow_413af4d",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格评审",
        targetNodeId: "其他",
        sourceAnchorId: "不合格评审_2",
        targetAnchorId: "其他_0",
        startPoint: {
          x: 325,
          y: 380,
        },
        endPoint: {
          x: 550,
          y: 470,
        },
        pointsList: [
          {
            x: 325,
            y: 380,
          },
          {
            x: 325,
            y: 411,
          },
          {
            x: 550,
            y: 411,
          },
          {
            x: 550,
            y: 470,
          },
        ],
      },
      {
        id: "Flow_f0e5ba1",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格评审",
        targetNodeId: "让步接收",
        sourceAnchorId: "不合格评审_2",
        targetAnchorId: "让步接收_0",
        startPoint: {
          x: 325,
          y: 380,
        },
        endPoint: {
          x: 250,
          y: 470,
        },
        pointsList: [
          {
            x: 325,
            y: 380,
          },
          {
            x: 325,
            y: 425,
          },
          {
            x: 250,
            y: 425,
          },
          {
            x: 250,
            y: 470,
          },
        ],
      },
      {
        id: "Flow_d21f749",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "让步接收",
        targetNodeId: "质量部长审批",
        sourceAnchorId: "让步接收_2",
        targetAnchorId: "质量部长审批_0",
        startPoint: {
          x: 250,
          y: 530,
        },
        endPoint: {
          x: 200,
          y: 625,
        },
        pointsList: [
          {
            x: 250,
            y: 530,
          },
          {
            x: 250,
            y: 577.5,
          },
          {
            x: 200,
            y: 577.5,
          },
          {
            x: 200,
            y: 625,
          },
        ],
      },
      {
        id: "Flow_150c5a8",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "报废",
        targetNodeId: "质量部长审批",
        sourceAnchorId: "报废_2",
        targetAnchorId: "质量部长审批_0",
        startPoint: {
          x: 400,
          y: 530,
        },
        endPoint: {
          x: 200,
          y: 625,
        },
        pointsList: [
          {
            x: 400,
            y: 530,
          },
          {
            x: 400,
            y: 595,
          },
          {
            x: 200,
            y: 595,
          },
          {
            x: 200,
            y: 625,
          },
        ],
      },
      {
        id: "Flow_e620fc4",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "其他",
        targetNodeId: "质量部长审批",
        sourceAnchorId: "其他_2",
        targetAnchorId: "质量部长审批_0",
        startPoint: {
          x: 550,
          y: 530,
        },
        endPoint: {
          x: 200,
          y: 625,
        },
        pointsList: [
          {
            x: 550,
            y: 530,
          },
          {
            x: 550,
            y: 595,
          },
          {
            x: 200,
            y: 595,
          },
          {
            x: 200,
            y: 625,
          },
        ],
      },
      {
        id: "Flow_2dc28fe",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "开始",
        targetNodeId: "不合格品标识",
        sourceAnchorId: "开始_2",
        targetAnchorId: "不合格品标识_0",
        startPoint: {
          x: 325,
          y: 68,
        },
        endPoint: {
          x: 325,
          y: 110,
        },
        pointsList: [
          {
            x: 325,
            y: 68,
          },
          {
            x: 325,
            y: 98,
          },
          {
            x: 325,
            y: 98,
          },
          {
            x: 325,
            y: 80,
          },
          {
            x: 325,
            y: 80,
          },
          {
            x: 325,
            y: 110,
          },
        ],
      },
      {
        id: "Flow_da6c600",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "不合格品标识",
        targetNodeId: "不合格品隔离",
        sourceAnchorId: "不合格品标识_2",
        targetAnchorId: "不合格品隔离_0",
        startPoint: {
          x: 325,
          y: 190,
        },
        endPoint: {
          x: 325,
          y: 220,
        },
        pointsList: [
          {
            x: 325,
            y: 190,
          },
          {
            x: 325,
            y: 220,
          },
          {
            x: 325,
            y: 220,
          },
          {
            x: 325,
            y: 190,
          },
          {
            x: 325,
            y: 190,
          },
          {
            x: 325,
            y: 220,
          },
        ],
      },
      {
        id: "Flow_4297ade",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "总经理审批",
        targetNodeId: "不合格评审",
        sourceAnchorId: "总经理审批_1",
        targetAnchorId: "不合格评审_1",
        startPoint: {
          x: 425,
          y: 650,
        },
        endPoint: {
          x: 385,
          y: 350,
        },
        text: {
          x: 497.11111068725586,
          y: 650,
          value: "总经理驳回",
        },
        pointsList: [
          {
            x: 425,
            y: 650,
          },
          {
            x: 619,
            y: 650,
          },
          {
            x: 619,
            y: 350,
          },
          {
            x: 385,
            y: 350,
          },
        ],
      },
      {
        id: "Flow_a952693",
        type: "bpmn:sequenceFlow",
        properties: {},
        sourceNodeId: "质量部长审批",
        targetNodeId: "不合格评审",
        sourceAnchorId: "质量部长审批_3",
        targetAnchorId: "不合格评审_3",
        startPoint: {
          x: 175,
          y: 650,
        },
        endPoint: {
          x: 265,
          y: 350,
        },
        text: {
          x: 85.11111068725586,
          y: 650,
          value: "质量部长驳回",
        },
        pointsList: [
          {
            x: 175,
            y: 650,
          },
          {
            x: 37,
            y: 650,
          },
          {
            x: 37,
            y: 350,
          },
          {
            x: 265,
            y: 350,
          },
        ],
      },
    ],
  };
