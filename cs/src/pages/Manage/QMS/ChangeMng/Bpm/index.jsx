import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "../../../../../components/CommonCard";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import CommonFlow from "@/components/CommonFlow";
import { allChangeInfo } from "../../../../../apis/nc_review_router";
import ShenQing from "./shenqing";
import Shouli from "./shouli";
import KeXingXing from "./kexingxing";
import { Huiqian, Huiqian1, Huiqian2, Huiqian3 } from "./huiqian";
import { ApprovalTech, VpReview } from "./comp";
import CeShi from "./ceshi";
import BaoGao from "./baogao";
import TongZhi from "./tongzhi";
import GenZong from "./genzong";

const graphData = {
  nodes: [
    {
      id: "开始",
      type: "bpmn:startEvent",
      x: 100,
      y: 0,
      properties: {
        width: 36,
        height: 36,
      },
      text: {
        x: 100,
        y: 0,
        value: "开始",
      },
    },
    {
      id: "变更申请",
      type: "bpmn:serviceTask",
      x: 100,
      y: 100,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 100,
        value: "变更申请",
      },
    },
    {
      id: "变更受理",
      type: "bpmn:serviceTask",
      x: 100,
      y: 200,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 200,
        value: "变更受理",
      },
    },
    {
      id: "可行性方案",
      type: "bpmn:serviceTask",
      x: 100,
      y: 300,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 300,
        value: "可行性方案",
      },
    },
    {
      id: "会签评估",
      type: "bpmn:userTask",
      x: 100,
      y: 400,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 100,
        y: 400,
        value: "会签\n（评估）",
      },
    },
    {
      id: "研发技术部审批1",
      type: "bpmn:exclusiveGateway",
      x: 100,
      y: 500,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100,
        y: 540,
        value: "研发技术部审批",
      },
    },
    {
      id: "总经理审批1",
      type: "bpmn:exclusiveGateway",
      x: 300,
      y: 500,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 300,
        y: 540,
        value: "总经理审批",
      },
    },
    {
      id: "测试需求单",
      type: "bpmn:serviceTask",
      x: 100,
      y: 650,
      properties: {
        width: 100,
        height: 70,
      },
      text: {
        x: 100,
        y: 650,
        value: "测试需求单",
      },
    },
    {
      id: "部门会签测试",
      type: "bpmn:userTask",
      x: 300,
      y: 650,
      properties: {
        width: 100,
        height: 70,
      },
      text: {
        x: 300,
        y: 650,
        value: "部门会签\n（测试）",
      },
    },
    {
      id: "研发技术部审批2",
      type: "bpmn:exclusiveGateway",
      x: 100,
      y: 750,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100,
        y: 800,
        value: "研发技术部审批",
      },
    },
    {
      id: "总经理审批2",
      type: "bpmn:exclusiveGateway",
      x: 300,
      y: 750,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 300,
        y: 800,
        value: "总经理审批",
      },
    },
    {
      id: "结案报告",
      type: "bpmn:serviceTask",
      x: 100,
      y: 900,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 900,
        value: "结案报告",
      },
    },
    {
      id: "部门会签结案",
      type: "bpmn:userTask",
      x: 100,
      y: 1050,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 100,
        y: 1050,
        value: "部门会签\n（结案）",
      },
    },
    {
      id: "变更通知",
      type: "bpmn:serviceTask",
      x: 100,
      y: 1200,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 1200,
        value: "变更通知",
      },
    },
    {
      id: "质量部长审核1",
      type: "bpmn:exclusiveGateway",
      x: 100,
      y: 1300,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100,
        y: 1340,
        value: "质量部长审核",
      },
    },
    {
      id: "技术部长批准1",
      type: "bpmn:exclusiveGateway",
      x: 100,
      y: 1400,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100,
        y: 1440,
        value: "技术部长批准",
      },
    },
    {
      id: "变更跟踪",
      type: "bpmn:serviceTask",
      x: 100,
      y: 1500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 100,
        y: 1500,
        value: "变更跟踪",
      },
    },
    {
      id: "部门会签跟踪",
      type: "bpmn:userTask",
      x: 100,
      y: 1600,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 100,
        y: 1600,
        value: "部门会签\n（跟踪）",
      },
    },
    {
      id: "质量部长审核2",
      type: "bpmn:exclusiveGateway",
      x: 100,
      y: 1700,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100,
        y: 1740,
        value: "质量部长审核",
      },
    },
    {
      id: "结束",
      type: "bpmn:endEvent",
      x: 100,
      y: 1800,
      properties: {
        width: 36,
        height: 36,
      },
      text: {
        x: 100,
        y: 1840,
        value: "结束",
      },
    },
  ],
  edges: [
    {
      id: "Flow_e0618d0",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "开始",
      targetNodeId: "变更申请",
      sourceAnchorId: "开始_2",
      targetAnchorId: "变更申请_0",
      startPoint: {
        x: 100,
        y: 18,
      },
      endPoint: {
        x: 100,
        y: 70,
      },
      pointsList: [
        {
          x: 100,
          y: 18,
        },
        {
          x: 100,
          y: 48,
        },
        {
          x: 100,
          y: 48,
        },
        {
          x: 100,
          y: 40,
        },
        {
          x: 100,
          y: 40,
        },
        {
          x: 100,
          y: 70,
        },
      ],
    },
    {
      id: "Flow_272da54",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "变更申请",
      targetNodeId: "变更受理",
      sourceAnchorId: "变更申请_2",
      targetAnchorId: "变更受理_0",
      startPoint: {
        x: 100,
        y: 130,
      },
      endPoint: {
        x: 100,
        y: 170,
      },
      pointsList: [
        {
          x: 100,
          y: 130,
        },
        {
          x: 100,
          y: 160,
        },
        {
          x: 100,
          y: 160,
        },
        {
          x: 100,
          y: 140,
        },
        {
          x: 100,
          y: 140,
        },
        {
          x: 100,
          y: 170,
        },
      ],
    },
    {
      id: "Flow_aff414f",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "变更受理",
      targetNodeId: "可行性方案",
      sourceAnchorId: "变更受理_2",
      targetAnchorId: "可行性方案_0",
      startPoint: {
        x: 100,
        y: 230,
      },
      endPoint: {
        x: 100,
        y: 270,
      },
      pointsList: [
        {
          x: 100,
          y: 230,
        },
        {
          x: 100,
          y: 260,
        },
        {
          x: 100,
          y: 260,
        },
        {
          x: 100,
          y: 240,
        },
        {
          x: 100,
          y: 240,
        },
        {
          x: 100,
          y: 270,
        },
      ],
    },
    {
      id: "Flow_ae3c900",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "可行性方案",
      targetNodeId: "会签评估",
      sourceAnchorId: "可行性方案_2",
      targetAnchorId: "会签评估_0",
      startPoint: {
        x: 100,
        y: 330,
      },
      endPoint: {
        x: 100,
        y: 360,
      },
      pointsList: [
        {
          x: 100,
          y: 330,
        },
        {
          x: 100,
          y: 360,
        },
        {
          x: 100,
          y: 360,
        },
        {
          x: 100,
          y: 330,
        },
        {
          x: 100,
          y: 330,
        },
        {
          x: 100,
          y: 360,
        },
      ],
    },
    {
      id: "Flow_38848d6",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "会签评估",
      targetNodeId: "研发技术部审批1",
      sourceAnchorId: "会签评估_2",
      targetAnchorId: "研发技术部审批1_0",
      startPoint: {
        x: 100,
        y: 440,
      },
      endPoint: {
        x: 100,
        y: 475,
      },
      pointsList: [
        {
          x: 100,
          y: 440,
        },
        {
          x: 100,
          y: 470,
        },
        {
          x: 100,
          y: 470,
        },
        {
          x: 100,
          y: 445,
        },
        {
          x: 100,
          y: 445,
        },
        {
          x: 100,
          y: 475,
        },
      ],
    },
    {
      id: "Flow_10d1281",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批1",
      targetNodeId: "总经理审批1",
      sourceAnchorId: "研发技术部审批1_1",
      targetAnchorId: "总经理审批1_3",
      startPoint: {
        x: 125,
        y: 500,
      },
      endPoint: {
        x: 275,
        y: 500,
      },
      text: {
        x: 183,
        y: 500,
        value: "同意报总经理",
      },
      pointsList: [
        {
          x: 125,
          y: 500,
        },
        {
          x: 275,
          y: 500,
        },
      ],
    },
    {
      id: "Flow_004a480",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批1",
      targetNodeId: "可行性方案",
      sourceAnchorId: "研发技术部审批1_3",
      targetAnchorId: "可行性方案_3",
      startPoint: {
        x: 75,
        y: 500,
      },
      endPoint: {
        x: 50,
        y: 314,
      },
      text: {
        x: 4,
        y: 407,
        value: "驳回",
      },
      pointsList: [
        {
          x: 75,
          y: 500,
        },
        {
          x: 4,
          y: 500,
        },
        {
          x: 4,
          y: 314,
        },
        {
          x: 50,
          y: 314,
        },
      ],
    },
    {
      id: "Flow_73d165e",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "总经理审批1",
      targetNodeId: "可行性方案",
      sourceAnchorId: "总经理审批1_0",
      targetAnchorId: "可行性方案_1",
      startPoint: {
        x: 300,
        y: 475,
      },
      endPoint: {
        x: 150,
        y: 312,
      },
      text: {
        x: 300,
        y: 393.5,
        value: "驳回",
      },
      pointsList: [
        {
          x: 300,
          y: 475,
        },
        {
          x: 300,
          y: 312,
        },
        {
          x: 150,
          y: 312,
        },
      ],
    },
    {
      id: "Flow_8ea5be8",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批1",
      targetNodeId: "测试需求单",
      sourceAnchorId: "研发技术部审批1_2",
      targetAnchorId: "测试需求单_0",
      startPoint: {
        x: 100,
        y: 525,
      },
      endPoint: {
        x: 100,
        y: 610,
      },
      text: {
        x: 100,
        y: 567.5,
        value: "同意",
      },
      pointsList: [
        {
          x: 100,
          y: 525,
        },
        {
          x: 100,
          y: 610,
        },
      ],
    },
    {
      id: "Flow_6ae8b06",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "总经理审批1",
      targetNodeId: "测试需求单",
      sourceAnchorId: "总经理审批1_2",
      targetAnchorId: "测试需求单_0",
      startPoint: {
        x: 300,
        y: 525,
      },
      endPoint: {
        x: 100,
        y: 610,
      },
      text: {
        x: 197,
        y: 590,
        value: "同意",
      },
      pointsList: [
        {
          x: 300,
          y: 525,
        },
        {
          x: 300,
          y: 585,
        },
        {
          x: 100,
          y: 585,
        },
        {
          x: 100,
          y: 610,
        },
      ],
    },
    {
      id: "Flow_d3fa062",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "测试需求单",
      targetNodeId: "部门会签测试",
      sourceAnchorId: "测试需求单_1",
      targetAnchorId: "部门会签测试_3",
      startPoint: {
        x: 150,
        y: 650,
      },
      endPoint: {
        x: 250,
        y: 650,
      },
      pointsList: [
        {
          x: 150,
          y: 650,
        },
        {
          x: 250,
          y: 650,
        },
      ],
    },
    {
      id: "Flow_ba7714b",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "部门会签测试",
      targetNodeId: "研发技术部审批2",
      sourceAnchorId: "部门会签测试_2",
      targetAnchorId: "研发技术部审批2_0",
      startPoint: {
        x: 300,
        y: 685,
      },
      endPoint: {
        x: 100,
        y: 725,
      },
      pointsList: [
        {
          x: 300,
          y: 685,
        },
        {
          x: 300,
          y: 695,
        },
        {
          x: 100,
          y: 695,
        },
        {
          x: 100,
          y: 725,
        },
      ],
    },
    {
      id: "Flow_b95d83c",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批2",
      targetNodeId: "总经理审批2",
      sourceAnchorId: "研发技术部审批2_1",
      targetAnchorId: "总经理审批2_3",
      startPoint: {
        x: 125,
        y: 750,
      },
      endPoint: {
        x: 275,
        y: 750,
      },
      text: {
        x: 194.3588513324135,
        y: 750,
        value: "同意报总经理",
      },
      pointsList: [
        {
          x: 125,
          y: 750,
        },
        {
          x: 275,
          y: 750,
        },
      ],
    },
    {
      id: "Flow_c35c31f",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "总经理审批2",
      targetNodeId: "可行性方案",
      sourceAnchorId: "总经理审批2_1",
      targetAnchorId: "可行性方案_1",
      startPoint: {
        x: 325,
        y: 750,
      },
      endPoint: {
        x: 150,
        y: 294,
      },
      text: {
        x: 359.5,
        y: 750,
        value: "驳回",
      },
      pointsList: [
        {
          x: 325,
          y: 750,
        },
        {
          x: 394,
          y: 750,
        },
        {
          x: 394,
          y: 294,
        },
        {
          x: 150,
          y: 294,
        },
      ],
    },
    {
      id: "Flow_9c1953d",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批2",
      targetNodeId: "可行性方案",
      sourceAnchorId: "研发技术部审批2_3",
      targetAnchorId: "可行性方案_3",
      startPoint: {
        x: 75,
        y: 750,
      },
      endPoint: {
        x: 50,
        y: 300,
      },
      text: {
        x: 6.200956595571341,
        y: 750,
        value: "驳回",
      },
      pointsList: [
        {
          x: 75,
          y: 750,
        },
        {
          x: -52,
          y: 750,
        },
        {
          x: -52,
          y: 300,
        },
        {
          x: 50,
          y: 300,
        },
      ],
    },
    {
      id: "Flow_2115bfe",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "研发技术部审批2",
      targetNodeId: "结案报告",
      sourceAnchorId: "研发技术部审批2_2",
      targetAnchorId: "结案报告_0",
      startPoint: {
        x: 100,
        y: 775,
      },
      endPoint: {
        x: 100,
        y: 870,
      },
      pointsList: [
        {
          x: 100,
          y: 775,
        },
        {
          x: 100,
          y: 870,
        },
      ],
    },
    {
      id: "Flow_f78de03",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "总经理审批2",
      targetNodeId: "结案报告",
      sourceAnchorId: "总经理审批2_2",
      targetAnchorId: "结案报告_0",
      startPoint: {
        x: 300,
        y: 775,
      },
      endPoint: {
        x: 100,
        y: 870,
      },
      text: {
        x: 160.27272701263428,
        y: 840,
        value: "同意",
      },
      pointsList: [
        {
          x: 300,
          y: 775,
        },
        {
          x: 300,
          y: 840,
        },
        {
          x: 100,
          y: 840,
        },
        {
          x: 100,
          y: 870,
        },
      ],
    },
    {
      id: "Flow_db7ad16",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "结案报告",
      targetNodeId: "部门会签结案",
      sourceAnchorId: "结案报告_2",
      targetAnchorId: "部门会签结案_0",
      startPoint: {
        x: 100,
        y: 1000,
      },
      endPoint: {
        x: 100,
        y: 1000,
      },
      pointsList: [
        {
          x: 100,
          y: 950,
        },
        {
          x: 100,
          y: 1000,
        },
        {
          x: 100,
          y: 1000,
        },
        {
          x: 100,
          y: 950,
        },
        {
          x: 100,
          y: 950,
        },
        {
          x: 100,
          y: 1000,
        },
      ],
    },
    {
      id: "Flow_new_direct",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "部门会签结案",
      targetNodeId: "变更通知",
      sourceAnchorId: "部门会签结案_2",
      targetAnchorId: "变更通知_0",
      startPoint: {
        x: 100,
        y: 1100,
      },
      endPoint: {
        x: 100,
        y: 1160,
      },
      pointsList: [
        { x: 100, y: 1100 },
        { x: 100, y: 1160 },
      ],
    },
    {
      id: "Flow_88d6173",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "变更通知",
      targetNodeId: "质量部长审核1",
      sourceAnchorId: "变更通知_2",
      targetAnchorId: "质量部长审核1_0",
      startPoint: {
        x: 100,
        y: 1230,
      },
      endPoint: {
        x: 100,
        y: 1275,
      },
      pointsList: [
        {
          x: 100,
          y: 1230,
        },
        {
          x: 100,
          y: 1260,
        },
        {
          x: 100,
          y: 1260,
        },
        {
          x: 100,
          y: 1245,
        },
        {
          x: 100,
          y: 1245,
        },
        {
          x: 100,
          y: 1275,
        },
      ],
    },
    {
      id: "Flow_7c25a61",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "质量部长审核1",
      targetNodeId: "技术部长批准1",
      sourceAnchorId: "质量部长审核1_2",
      targetAnchorId: "技术部长批准1_0",
      startPoint: {
        x: 100,
        y: 1325,
      },
      endPoint: {
        x: 100,
        y: 1375,
      },
      pointsList: [
        {
          x: 100,
          y: 1325,
        },
        {
          x: 100,
          y: 1355,
        },
        {
          x: 100,
          y: 1355,
        },
        {
          x: 100,
          y: 1345,
        },
        {
          x: 100,
          y: 1345,
        },
        {
          x: 100,
          y: 1375,
        },
      ],
    },
    {
      id: "Flow_bb99022",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "质量部长审核1",
      targetNodeId: "变更通知",
      sourceAnchorId: "质量部长审核1_3",
      targetAnchorId: "变更通知_3",
      startPoint: {
        x: 75,
        y: 1300,
      },
      endPoint: {
        x: 50,
        y: 1200,
      },
      text: {
        x: 39.27272701263428,
        y: 1300,
        value: "驳回",
      },
      pointsList: [
        {
          x: 75,
          y: 1300,
        },
        {
          x: -4,
          y: 1300,
        },
        {
          x: -4,
          y: 1200,
        },
        {
          x: 50,
          y: 1200,
        },
      ],
    },
    {
      id: "Flow_40b5042",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "技术部长批准1",
      targetNodeId: "变更跟踪",
      sourceAnchorId: "技术部长批准1_2",
      targetAnchorId: "变更跟踪_0",
      startPoint: {
        x: 100,
        y: 1425,
      },
      endPoint: {
        x: 100,
        y: 1470,
      },
      pointsList: [
        {
          x: 100,
          y: 1425,
        },
        {
          x: 100,
          y: 1455,
        },
        {
          x: 100,
          y: 1455,
        },
        {
          x: 100,
          y: 1440,
        },
        {
          x: 100,
          y: 1440,
        },
        {
          x: 100,
          y: 1470,
        },
      ],
    },
    {
      id: "Flow_2a02b7c",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "技术部长批准1",
      targetNodeId: "变更通知",
      sourceAnchorId: "技术部长批准1_1",
      targetAnchorId: "变更通知_1",
      startPoint: {
        x: 125,
        y: 1400,
      },
      endPoint: {
        x: 150,
        y: 1200,
      },
      text: {
        x: 205,
        y: 1300,
        value: "驳回",
      },
      pointsList: [
        {
          x: 125,
          y: 1400,
        },
        {
          x: 205,
          y: 1400,
        },
        {
          x: 205,
          y: 1200,
        },
        {
          x: 150,
          y: 1200,
        },
      ],
    },
    {
      id: "Flow_new_1",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "变更跟踪",
      targetNodeId: "部门会签跟踪",
      sourceAnchorId: "变更跟踪_2",
      targetAnchorId: "部门会签跟踪_0",
      startPoint: {
        x: 100,
        y: 1530,
      },
      endPoint: {
        x: 100,
        y: 1560,
      },
      pointsList: [
        {
          x: 100,
          y: 1530,
        },
        {
          x: 100,
          y: 1560,
        },
        {
          x: 100,
          y: 1560,
        },
        {
          x: 100,
          y: 1535,
        },
        {
          x: 100,
          y: 1535,
        },
        {
          x: 100,
          y: 1560,
        },
      ],
    },
    // 添加从部门会签跟踪到质量部长审核2的连线
    {
      id: "Flow_new_2",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "部门会签跟踪",
      targetNodeId: "质量部长审核2",
      sourceAnchorId: "部门会签跟踪_2",
      targetAnchorId: "质量部长审核2_0",
      startPoint: {
        x: 100,
        y: 1640,
      },
      endPoint: {
        x: 100,
        y: 1675,
      },
      pointsList: [
        {
          x: 100,
          y: 1640,
        },
        {
          x: 100,
          y: 1670,
        },
        {
          x: 100,
          y: 1670,
        },
        {
          x: 100,
          y: 1645,
        },
        {
          x: 100,
          y: 1645,
        },
        {
          x: 100,
          y: 1675,
        },
      ],
    },
    {
      id: "Flow_f90c0b2",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "质量部长审核2",
      targetNodeId: "结束",
      sourceAnchorId: "质量部长审核2_2",
      targetAnchorId: "结束_0",
      startPoint: {
        x: 100,
        y: 1725,
      },
      endPoint: {
        x: 100,
        y: 1782,
      },
      pointsList: [
        {
          x: 100,
          y: 1725,
        },
        {
          x: 100,
          y: 1755,
        },
        {
          x: 100,
          y: 1755,
        },
        {
          x: 100,
          y: 1752,
        },
        {
          x: 100,
          y: 1752,
        },
        {
          x: 100,
          y: 1782,
        },
      ],
    },
    {
      id: "Flow_3992312",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "质量部长审核2",
      targetNodeId: "变更跟踪",
      sourceAnchorId: "质量部长审核2_3",
      targetAnchorId: "变更跟踪_3",
      startPoint: {
        x: 75,
        y: 1700,
      },
      endPoint: {
        x: 50,
        y: 1500,
      },
      text: {
        x: 22,
        y: 1700,
        value: "驳回",
      },
      pointsList: [
        {
          x: 75,
          y: 1700,
        },
        {
          x: -31,
          y: 1700,
        },
        {
          x: -31,
          y: 1500,
        },
        {
          x: 50,
          y: 1500,
        },
      ],
    },
  ],
};
const default_nodesStatus = {
  开始: "未开始",
  变更申请: "未开始",
  变更受理: "未开始",
  可行性方案: "未开始",
  会签评估: "未开始",
  研发技术部审批1: "未开始",
  总经理审批1: "未开始",
  测试需求单: "未开始",
  部门会签测试: "未开始",
  研发技术部审批2: "未开始",
  总经理审批2: "未开始",
  结案报告: "未开始",
  部门会签结案: "未开始",
  变更通知: "未开始",
  质量部长审核1: "未开始",
  技术部长批准1: "未开始",
  变更跟踪: "未开始",
  质量部长审核2: "未开始",
  结束: "未开始",
};

function ChangeBpm() {
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const [record, setRecord] = useState({});
  const [nodeData, setNodeData] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [currentNode, setCurrentNode] = useState("");
  const [change_data, setChangeData] = useState({});
  const onNodeClick = (data, e, position) => {
    const { id } = data;
    if (["开始", "结束"].includes(id)) return;
    setCurrentNode(id);
  };
  const getReview = () => {
    if (record.编号) {
      allChangeInfo(
        { number: record.编号 },
        (res) => {
          const { code, data } = res.data;
          if (code === 200 && data) {
            const { 操作记录 = [], 流程状态 } = data;
            setNodeData(流程状态);
            let opt_record = 操作记录.map((item) => ({
              children: item,
              color: item.includes("驳回") ? "red" : "blue",
            }));
            setHistoryData(opt_record);
            setChangeData(data);
          } else {
            setChangeData({});
            setNodeData(default_nodesStatus);
            setHistoryData([]);
          }
        },
        () => {
          setChangeData({});
          setNodeData(default_nodesStatus);
          setHistoryData([]);
        }
      );
    }
  };
  const handleGetNode = () => {
    // 判断是否结束
    if (nodeData["结束"] === "通过") {
      setCurrentNode("变更跟踪");
      return;
    }
    const [firstKey, firstNode] =
      Object.entries(nodeData).find(([_, node]) => node === "进行中") || [];
    setCurrentNode(firstKey || "");
  };
  const initData = () => {};

  useEffect(() => {
    if (Object.keys(nodeData).length > 0) {
      // 计算当前节点
      handleGetNode();
    }
  }, [nodeData]);

  useEffect(() => {
    if (record) {
      getReview();
    }
  }, [record]);
  useEffect(() => {
    if (state) {
      const { record } = state;
      if (record) {
        setRecord(record);
      }
    }
  }, [state]);

  useEffect(() => {
    initData();
    setNodeData(default_nodesStatus);
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "变更管理", "审批流程"]} />
      <div className="content_root">
        <Flex justify="space-between" align="center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <div>变更单号:{record.编号 || ""}</div>
        </Flex>
        <Flex>
          <CommonFlow
            onNodeClick={onNodeClick}
            graphData={graphData}
            recordData={historyData || []}
            nodeData={nodeData}
            minHeight={1200}
          >
            {currentNode === "变更申请" && (
              <ShenQing
                id={record.编号}
                review_data={change_data["变更申请"]}
                disabled={nodeData["变更申请"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "变更受理" && (
              <Shouli
                id={record.编号}
                review_data={change_data["变更受理"]}
                disabled={nodeData["变更受理"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "可行性方案" && (
              <KeXingXing
                id={record.编号}
                review_data={change_data["可行性方案"]}
                disabled={nodeData["可行性方案"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "会签评估" && (
              <Huiqian
                name="会签评估"
                id={record.编号}
                review_data={change_data["会签评估"]}
                disabled={nodeData["会签评估"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "部门会签测试" && (
              <Huiqian
                name="部门会签测试"
                id={record.编号}
                review_data={change_data["部门会签测试"]}
                disabled={nodeData["部门会签测试"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "部门会签结案" && (
              <Huiqian
                name="部门会签结案"
                id={record.编号}
                review_data={change_data["部门会签结案"]}
                disabled={nodeData["部门会签结案"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "部门会签跟踪" && (
              <Huiqian
                name="部门会签跟踪"
                id={record.编号}
                review_data={change_data["部门会签跟踪"]}
                disabled={nodeData["部门会签跟踪"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "测试需求单" && (
              <CeShi
                id={record.编号}
                review_data={change_data["测试需求单"]}
                disabled={nodeData["测试需求单"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "结案报告" && (
              <BaoGao
                id={record.编号}
                review_data={change_data["结案报告"]}
                disabled={nodeData["结案报告"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "变更通知" && (
              <TongZhi
                id={record.编号}
                review_data={change_data["变更通知"]}
                disabled={nodeData["变更通知"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "变更跟踪" && (
              <GenZong
                id={record.编号}
                review_data={change_data["变更跟踪"]}
                disabled={nodeData["变更跟踪"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {currentNode === "研发技术部审批1" && (
              <ApprovalTech
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["研发技术部审批1"] !== "进行中"}
                reFresh={getReview}
                node="研发技术部审批1"
              />
            )}
            {currentNode === "研发技术部审批2" && (
              <ApprovalTech
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["研发技术部审批2"] !== "进行中"}
                reFresh={getReview}
                node="研发技术部审批2"
              />
            )}
            {currentNode === "总经理审批1" && (
              <VpReview
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["总经理审批1"] !== "进行中"}
                reFresh={getReview}
                node="总经理审批1"
                is_vp={true}
              />
            )}
            {currentNode === "总经理审批2" && (
              <VpReview
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["总经理审批2"] !== "进行中"}
                reFresh={getReview}
                node="总经理审批2"
                is_vp={true}
              />
            )}
            {currentNode === "质量部长审核1" && (
              <VpReview
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["质量部长审核1"] !== "进行中"}
                reFresh={getReview}
                node="质量部长审核1"
              />
            )}
            {currentNode === "技术部长批准1" && (
              <VpReview
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["技术部长批准1"] !== "进行中"}
                reFresh={getReview}
                node="技术部长批准1"
              />
            )}
            {currentNode === "质量部长审核2" && (
              <VpReview
                id={record.编号}
                review_data={change_data["签名"]}
                disabled={nodeData["质量部长审核2"] !== "进行中"}
                reFresh={getReview}
                node="质量部长审核2"
              />
            )}
          </CommonFlow>
        </Flex>
      </div>
    </div>
  );
}

export default ChangeBpm;
