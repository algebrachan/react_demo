import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, message } from "antd";
import CommonFlow from "@/components/CommonFlow";
import { useLocation, useNavigate } from "react-router-dom";
import { GmReview, NoIsolation, NoReview, NoTrace, QmReview } from "./comp.jsx";
import { qmsGetReviews } from "@/apis/nc_review_router.jsx";
import { getUsersMap } from "../../../../../apis/nc_review_router.jsx";

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
      id: "返工",
      type: "bpmn:serviceTask",
      x: 50,
      y: 500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 50,
        y: 500,
        value: "返工",
      },
    },
    {
      id: "返修",
      type: "bpmn:serviceTask",
      x: 150,
      y: 500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 150,
        y: 500,
        value: "返修",
      },
    },
    {
      id: "挑选",
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
        value: "挑选",
      },
    },
    {
      id: "让步接收",
      type: "bpmn:serviceTask",
      x: 350,
      y: 500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 350,
        y: 500,
        value: "让步接收",
      },
    },
    {
      id: "报废",
      type: "bpmn:serviceTask",
      x: 450,
      y: 500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 450,
        y: 500,
        value: "报废",
      },
    },
    {
      id: "特采",
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
        value: "特采",
      },
    },
    {
      id: "退货",
      type: "bpmn:serviceTask",
      x: 650,
      y: 500,
      properties: {
        width: 100,
        height: 60,
      },
      text: {
        x: 650,
        y: 500,
        value: "退货",
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
          x: 710,
          y: 650,
        },
        {
          x: 710,
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
          x: -10,
          y: 650,
        },
        {
          x: -10,
          y: 350,
        },
        {
          x: 265,
          y: 350,
        },
      ],
    },
    {
      id: "Flow_rework",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "不合格评审",
      targetNodeId: "返工",
      sourceAnchorId: "不合格评审_2",
      targetAnchorId: "返工_0",
      startPoint: {
        x: 325,
        y: 380,
      },
      endPoint: {
        x: 50,
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
          x: 50,
          y: 411,
        },
        {
          x: 50,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_rework_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "返工",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "返工_2",
      targetAnchorId: "质量部长审批_0",
      startPoint: {
        x: 50,
        y: 530,
      },
      endPoint: {
        x: 200,
        y: 625,
      },
      pointsList: [
        {
          x: 50,
          y: 530,
        },
        {
          x: 50,
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
    // 返修连接
    {
      id: "Flow_repair",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "不合格评审",
      targetNodeId: "返修",
      sourceAnchorId: "不合格评审_2",
      targetAnchorId: "返修_0",
      startPoint: {
        x: 325,
        y: 380,
      },
      endPoint: {
        x: 150,
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
          x: 150,
          y: 411,
        },
        {
          x: 150,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_repair_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "返修",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "返修_2",
      targetAnchorId: "质量部长审批_0",
      startPoint: {
        x: 150,
        y: 530,
      },
      endPoint: {
        x: 200,
        y: 625,
      },
      pointsList: [
        {
          x: 150,
          y: 530,
        },
        {
          x: 150,
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
    // 挑选连接
    {
      id: "Flow_select",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "不合格评审",
      targetNodeId: "挑选",
      sourceAnchorId: "不合格评审_2",
      targetAnchorId: "挑选_0",
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
          y: 411,
        },
        {
          x: 250,
          y: 411,
        },
        {
          x: 250,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_select_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "挑选",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "挑选_2",
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
    // 让步接收连接
    {
      id: "Flow_concession",
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
        x: 350,
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
          x: 350,
          y: 411,
        },
        {
          x: 350,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_concession_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "让步接收",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "让步接收_2",
      targetAnchorId: "质量部长审批_0",
      startPoint: {
        x: 350,
        y: 530,
      },
      endPoint: {
        x: 200,
        y: 625,
      },
      pointsList: [
        {
          x: 350,
          y: 530,
        },
        {
          x: 350,
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
    // 报废连接
    {
      id: "Flow_scrap",
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
        x: 450,
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
          x: 450,
          y: 411,
        },
        {
          x: 450,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_scrap_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "报废",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "报废_2",
      targetAnchorId: "质量部长审批_0",
      startPoint: {
        x: 450,
        y: 530,
      },
      endPoint: {
        x: 200,
        y: 625,
      },
      pointsList: [
        {
          x: 450,
          y: 530,
        },
        {
          x: 450,
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
    // 特采连接
    {
      id: "Flow_special",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "不合格评审",
      targetNodeId: "特采",
      sourceAnchorId: "不合格评审_2",
      targetAnchorId: "特采_0",
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
      id: "Flow_special_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "特采",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "特采_2",
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
    // 退货连接
    {
      id: "Flow_return",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "不合格评审",
      targetNodeId: "退货",
      sourceAnchorId: "不合格评审_2",
      targetAnchorId: "退货_0",
      startPoint: {
        x: 325,
        y: 380,
      },
      endPoint: {
        x: 650,
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
          x: 650,
          y: 411,
        },
        {
          x: 650,
          y: 470,
        },
      ],
    },
    {
      id: "Flow_return_qms",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "退货",
      targetNodeId: "质量部长审批",
      sourceAnchorId: "退货_2",
      targetAnchorId: "质量部长审批_0",
      startPoint: {
        x: 650,
        y: 530,
      },
      endPoint: {
        x: 200,
        y: 625,
      },
      pointsList: [
        {
          x: 650,
          y: 530,
        },
        {
          x: 650,
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
  ],
};

const default_nodesStatus = {
  开始: "未开始",
  不合格品标识: "未开始",
  不合格品隔离: "未开始",
  不合格评审: "未开始",
  返工: "未开始",
  返修: "未开始",
  挑选: "未开始",
  让步接收: "未开始",
  报废: "未开始",
  特采: "未开始",
  退货: "未开始",
  质量部长审批: "未开始",
  总经理审批: "未开始",
  不合格处置跟踪: "未开始",
  结束: "未开始",
};
const NoProductBpm = () => {
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const [review_id, setReviewId] = useState("");

  const [nodeData, setNodeData] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [currentNode, setCurrentNode] = useState("");
  const [review_data, setReviewData] = useState({});
  const [user_opt, setUserOpt] = useState([]);
  const onNodeClick = (data, e, position) => {
    const { id } = data;
    if (["开始", "不合格品标识", "结束"].includes(id)) return;
    setCurrentNode(id);
  };
  const getReview = () => {
    qmsGetReviews(
      { review_id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { 操作记录 = [], 流程状态 } = data;
          setNodeData(流程状态);
          let opt_record = 操作记录.map((item) => ({
            children: item,
            color: item.includes("驳回") ? "red" : "blue",
          }));
          setHistoryData(opt_record);
          setReviewData(data);
          // setNodeData(default_nodesStatus);
        } else {
          message.error(msg);
          setReviewData({});
          setNodeData(default_nodesStatus);
          setHistoryData([]);
        }
      },
      () => {
        setReviewData({});
        setNodeData(default_nodesStatus);
        setHistoryData([]);
      }
    );
  };
  const handleGetNode = () => {
    // 判断是否结束
    if (nodeData["结束"] === "通过") {
      setCurrentNode("不合格处置跟踪");
      return;
    }
    const [firstKey, firstNode] =
      Object.entries(nodeData).find(([_, node]) => node === "进行中") || [];
    setCurrentNode(firstKey || "");
  };
  const initData = () => {
    getUsersMap(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setUserOpt(data_list);
        } else {
          setUserOpt([]);
        }
      },
      () => {
        setUserOpt([]);
      }
    );
  };
  useEffect(() => {
    if (Object.keys(nodeData).length > 0) {
      // 计算当前节点
      handleGetNode();
    }
  }, [nodeData]);

  useEffect(() => {
    if (review_id) {
      getReview();
    }
  }, [review_id]);
  useEffect(() => {
    if (state) {
      const { 编号 = "" } = state;
      if (编号) {
        setReviewId(编号);
      }
    }
  }, [state]);

  useEffect(() => {
    initData();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "不合格处置", "审批流程"]} />
      <div className="content_root">
        <Flex justify="space-between" align="center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/mng/qms_reviewnoproduct")}
          >
            返回
          </Button>
          <div>单号:{review_data["单号"] || ""}</div>
        </Flex>
        <Flex>
          <CommonFlow
            onNodeClick={onNodeClick}
            graphData={graphData}
            recordData={historyData || []}
            nodeData={nodeData}
          >
            {currentNode === "不合格品隔离" && (
              <NoIsolation
                id={review_id}
                order_record={review_data["产品信息"]}
                user_opt={user_opt}
                review_data={review_data["不合格品隔离"]}
                disabled={nodeData["不合格品隔离"] !== "进行中"}
                reFresh={getReview}
              />
            )}
            {[
              "不合格评审",
              "返工",
              "返修",
              "挑选",
              "让步接收",
              "报废",
              "特采",
              "退货",
            ].includes(currentNode) && (
              <NoReview
                id={review_id}
                reFresh={getReview}
                review_data={review_data["不合格评审"]}
                disabled={nodeData["不合格评审"] !== "进行中"}
              />
            )}
            {currentNode === "质量部长审批" && (
              <QmReview
                id={review_id}
                reFresh={getReview}
                review_data={{
                  ...review_data["不合格评审"],
                  ...review_data["质量部长审批"],
                }}
                disabled={nodeData["质量部长审批"] !== "进行中"}
              />
            )}
            {currentNode === "总经理审批" && (
              <GmReview
                id={review_id}
                reFresh={getReview}
                review_data={{
                  质量部长审批: review_data["质量部长审批"],
                  ...review_data["总经理审批"],
                }}
                disabled={nodeData["总经理审批"] !== "进行中"}
              />
            )}
            {currentNode === "不合格处置跟踪" && (
              <NoTrace
                id={review_id}
                reFresh={getReview}
                review_data={review_data["不合格处置跟踪"]}
                disabled={nodeData["不合格处置跟踪"] !== "进行中"}
              />
            )}
          </CommonFlow>
        </Flex>
      </div>
    </div>
  );
};

export default NoProductBpm;
