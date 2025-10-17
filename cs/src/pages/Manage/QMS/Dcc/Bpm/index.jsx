import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, message, Spin } from "antd";
import CommonFlow from "@/components/CommonFlow";
import { useLocation, useNavigate } from "react-router-dom";
import DccShenQing from "./shenqing";
import { DccShenPi } from "./shenpi";
import { qmsDccGetProcess } from "../../../../../apis/nc_review_router";
import DccHuiqian from "./huiqian";

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
      id: "发起申请",
      type: "bpmn:serviceTask",
      x: 100.19999980926514,
      y: 115.79999542236328,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 100.19999980926514,
        y: 115.79999542236328,
        value: "发起申请",
      },
    },
    {
      id: "内容审核",
      type: "bpmn:exclusiveGateway",
      x: 100.19999980926514,
      y: 244.79999542236328,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100.19999980926514,
        y: 284.7999954223633,
        value: "内容审核",
      },
    },
    {
      id: "格式卡控",
      type: "bpmn:exclusiveGateway",
      x: 100.19999980926514,
      y: 368.7999954223633,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 100.19999980926514,
        y: 408.7999954223633,
        value: "格式卡控",
      },
    },
    {
      id: "合规性审核",
      type: "bpmn:exclusiveGateway",
      x: 99.19999980926514,
      y: 492.7999954223633,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 99.19999980926514,
        y: 532.7999954223633,
        value: "合规性审核",
      },
    },
    {
      id: "批准",
      type: "bpmn:exclusiveGateway",
      x: 98.19999980926514,
      y: 620.7999954223633,
      properties: {
        width: 50,
        height: 50,
      },
      text: {
        x: 98.19999980926514,
        y: 660.7999954223633,
        value: "批准",
      },
    },
    {
      id: "会签",
      type: "bpmn:serviceTask",
      x: 98.19999980926514,
      y: 741.7999954223633,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 98.19999980926514,
        y: 741.7999954223633,
        value: "会签",
      },
    },
    {
      id: "结束",
      type: "bpmn:endEvent",
      x: 98.19999980926514,
      y: 857.7999954223633,
      properties: {
        width: 36,
        height: 36,
      },
      text: {
        x: 98.19999980926514,
        y: 897.7999954223633,
        value: "结束",
      },
    },
    {
      id: "通知相关方",
      type: "bpmn:serviceTask",
      x: 253.19999980926514,
      y: 881.7999954223633,
      properties: {
        width: 100,
        height: 80,
      },
      text: {
        x: 253.19999980926514,
        y: 881.7999954223633,
        value: "通知相关方",
      },
    },
  ],
  edges: [
    {
      id: "Flow_dd16274",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "开始",
      targetNodeId: "发起申请",
      sourceAnchorId: "开始_2",
      targetAnchorId: "发起申请_0",
      startPoint: {
        x: 100,
        y: 18,
      },
      endPoint: {
        x: 100.19999980926514,
        y: 75.79999542236328,
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
          x: 100.09999990463257,
          y: 48,
        },
        {
          x: 100.09999990463257,
          y: 45.79999542236328,
        },
        {
          x: 100.19999980926514,
          y: 45.79999542236328,
        },
        {
          x: 100.19999980926514,
          y: 75.79999542236328,
        },
      ],
    },
    {
      id: "Flow_ab932c3",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "发起申请",
      targetNodeId: "内容审核",
      sourceAnchorId: "发起申请_2",
      targetAnchorId: "内容审核_0",
      startPoint: {
        x: 100.19999980926514,
        y: 155.79999542236328,
      },
      endPoint: {
        x: 100.19999980926514,
        y: 219.79999542236328,
      },
      pointsList: [
        {
          x: 100.19999980926514,
          y: 155.79999542236328,
        },
        {
          x: 100.19999980926514,
          y: 219.79999542236328,
        },
      ],
    },
    {
      id: "Flow_c4453bb",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "内容审核",
      targetNodeId: "格式卡控",
      sourceAnchorId: "内容审核_2",
      targetAnchorId: "格式卡控_0",
      startPoint: {
        x: 100.19999980926514,
        y: 269.7999954223633,
      },
      endPoint: {
        x: 100.19999980926514,
        y: 343.7999954223633,
      },
      pointsList: [
        {
          x: 100.19999980926514,
          y: 269.7999954223633,
        },
        {
          x: 100.19999980926514,
          y: 343.7999954223633,
        },
      ],
    },
    {
      id: "Flow_2cb6c7a",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "格式卡控",
      targetNodeId: "合规性审核",
      sourceAnchorId: "格式卡控_2",
      targetAnchorId: "合规性审核_0",
      startPoint: {
        x: 100.19999980926514,
        y: 393.7999954223633,
      },
      endPoint: {
        x: 99.19999980926514,
        y: 467.7999954223633,
      },
      pointsList: [
        {
          x: 100.19999980926514,
          y: 393.7999954223633,
        },
        {
          x: 100.19999980926514,
          y: 430.7999954223633,
        },
        {
          x: 99.19999980926514,
          y: 430.7999954223633,
        },
        {
          x: 99.19999980926514,
          y: 467.7999954223633,
        },
      ],
    },
    {
      id: "Flow_a4aa772",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "合规性审核",
      targetNodeId: "批准",
      sourceAnchorId: "合规性审核_2",
      targetAnchorId: "批准_0",
      startPoint: {
        x: 99.19999980926514,
        y: 517.7999954223633,
      },
      endPoint: {
        x: 98.19999980926514,
        y: 595.7999954223633,
      },
      pointsList: [
        {
          x: 99.19999980926514,
          y: 517.7999954223633,
        },
        {
          x: 99.19999980926514,
          y: 556.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 556.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 595.7999954223633,
        },
      ],
    },
    {
      id: "Flow_d990ca7",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "批准",
      targetNodeId: "会签",
      sourceAnchorId: "批准_2",
      targetAnchorId: "会签_0",
      startPoint: {
        x: 98.19999980926514,
        y: 645.7999954223633,
      },
      endPoint: {
        x: 98.19999980926514,
        y: 701.7999954223633,
      },
      pointsList: [
        {
          x: 98.19999980926514,
          y: 645.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 675.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 675.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 671.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 671.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 701.7999954223633,
        },
      ],
    },
    {
      id: "Flow_b6f3610",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "会签",
      targetNodeId: "结束",
      sourceAnchorId: "会签_2",
      targetAnchorId: "结束_0",
      startPoint: {
        x: 98.19999980926514,
        y: 781.7999954223633,
      },
      endPoint: {
        x: 98.19999980926514,
        y: 839.7999954223633,
      },
      pointsList: [
        {
          x: 98.19999980926514,
          y: 781.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 811.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 811.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 809.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 809.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 839.7999954223633,
        },
      ],
    },
    {
      id: "Flow_c3ae558",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "会签",
      targetNodeId: "通知相关方",
      sourceAnchorId: "会签_2",
      targetAnchorId: "通知相关方_0",
      startPoint: {
        x: 98.19999980926514,
        y: 781.7999954223633,
      },
      endPoint: {
        x: 253.19999980926514,
        y: 841.7999954223633,
      },
      pointsList: [
        {
          x: 98.19999980926514,
          y: 781.7999954223633,
        },
        {
          x: 98.19999980926514,
          y: 811.7999954223633,
        },
        {
          x: 253.19999980926514,
          y: 811.7999954223633,
        },
        {
          x: 253.19999980926514,
          y: 841.7999954223633,
        },
      ],
    },
    {
      id: "Flow_420645c",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "内容审核",
      targetNodeId: "发起申请",
      sourceAnchorId: "内容审核_3",
      targetAnchorId: "发起申请_3",
      startPoint: {
        x: 75.19999980926514,
        y: 244.79999542236328,
      },
      endPoint: {
        x: 50.19999980926514,
        y: 115.79999542236328,
      },
      pointsList: [
        {
          x: 75.19999980926514,
          y: 244.79999542236328,
        },
        {
          x: 20.199999809265137,
          y: 244.79999542236328,
        },
        {
          x: 20.199999809265137,
          y: 115.79999542236328,
        },
        {
          x: 50.19999980926514,
          y: 115.79999542236328,
        },
      ],
    },
    {
      id: "Flow_7bf6f8e",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "格式卡控",
      targetNodeId: "发起申请",
      sourceAnchorId: "格式卡控_1",
      targetAnchorId: "发起申请_1",
      startPoint: {
        x: 125.19999980926514,
        y: 368.7999954223633,
      },
      endPoint: {
        x: 150.19999980926514,
        y: 115.79999542236328,
      },
      pointsList: [
        {
          x: 125.19999980926514,
          y: 368.7999954223633,
        },
        {
          x: 180.19999980926514,
          y: 368.7999954223633,
        },
        {
          x: 180.19999980926514,
          y: 115.79999542236328,
        },
        {
          x: 150.19999980926514,
          y: 115.79999542236328,
        },
      ],
    },
    {
      id: "Flow_b96d404",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "合规性审核",
      targetNodeId: "发起申请",
      sourceAnchorId: "合规性审核_3",
      targetAnchorId: "发起申请_3",
      startPoint: {
        x: 74.19999980926514,
        y: 492.7999954223633,
      },
      endPoint: {
        x: 50.19999980926514,
        y: 115.79999542236328,
      },
      pointsList: [
        {
          x: 74.19999980926514,
          y: 492.7999954223633,
        },
        {
          x: -42.80000019073486,
          y: 492.7999954223633,
        },
        {
          x: -42.80000019073486,
          y: 115.79999542236328,
        },
        {
          x: 50.19999980926514,
          y: 115.79999542236328,
        },
      ],
    },
    {
      id: "Flow_f908c03",
      type: "bpmn:sequenceFlow",
      properties: {},
      sourceNodeId: "批准",
      targetNodeId: "发起申请",
      sourceAnchorId: "批准_1",
      targetAnchorId: "发起申请_1",
      startPoint: {
        x: 73.19999980926514,
        y: 620.7999954223633,
      },
      endPoint: {
        x: 150.19999980926514,
        y: 115.79999542236328,
      },
      pointsList: [
        {
          x: 73.19999980926514,
          y: 620.7999954223633,
        },
        {
          x: 261.19999980926514,
          y: 620.7999954223633,
        },
        {
          x: 261.19999980926514,
          y: 115.79999542236328,
        },
        {
          x: 150.19999980926514,
          y: 115.79999542236328,
        },
      ],
    },
  ],
};

const default_nodesStatus = {
  开始: "通过",
  发起申请: "进行中",
  内容审核: "未开始",
  格式卡控: "未开始",
  合规性审核: "未开始",
  批准: "未开始",
  会签: "未开始",
  结束: "未开始",
};
const DccBpm = () => {
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const [process_id, setProcessId] = useState("");
  const [load, setLoad] = useState(false);
  const [nodeData, setNodeData] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [currentNode, setCurrentNode] = useState("");
  const [review_data, setReviewData] = useState({});
  const getReview = () => {
    // 请求
    setLoad(true);
    qmsDccGetProcess(
      { process_id },
      (res) => {
        setLoad(false);
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 操作记录 = [], 流程状态 } = data;
          setNodeData(流程状态);
          let opt_record = 操作记录.map((item) => ({
            children: item,
            color: item.includes("驳回") ? "red" : "blue",
          }));
          setHistoryData(opt_record);
          setReviewData(data);
        } else {
          message.error(msg);
          setReviewData({});
          setNodeData(default_nodesStatus);
          setHistoryData([]);
        }
      },
      () => {
        setLoad(false);
        setReviewData({});
        setNodeData(default_nodesStatus);
        setHistoryData([]);
      }
    );
  };
  const onNodeClick = (data, e, position) => {
    const { id } = data;
    if (["开始", "结束"].includes(id)) return;
    setCurrentNode(id);
  };
  const handleGetNode = () => {
    // 判断是否结束
    if (nodeData["结束"] === "通过") {
      setCurrentNode("会签");
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
    if (process_id) {
      getReview();
    }
  }, [process_id]);
  useEffect(() => {
    if (state) {
      const { 流程单号 = "" } = state;
      if (流程单号 === "") {
        setNodeData(default_nodesStatus);
      } else {
        setProcessId(流程单号);
      }
    }
  }, [state]);

  useEffect(() => {
    initData();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "DCC", "审批流程"]} />
      <div className="content_root">
        <Spin spinning={load}>
          <Flex justify="space-between" align="center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <div>流程单号:{process_id || ""}</div>
          </Flex>
          <Flex>
            <CommonFlow
              onNodeClick={onNodeClick}
              graphData={graphData}
              recordData={historyData || []}
              nodeData={nodeData}
            >
              {currentNode === "发起申请" && (
                <DccShenQing
                  id={process_id}
                  setProcessId={setProcessId}
                  review_data={review_data["发起申请"]}
                  disabled={nodeData["发起申请"] !== "进行中"}
                  reFresh={getReview}
                  file_jump={state['file_jump']}
                />
              )}

              {["内容审核", "格式卡控", "合规性审核", "批准"].includes(
                currentNode
              ) && (
                <DccShenPi
                  id={process_id}
                  review_data={review_data}
                  disabled={nodeData[currentNode] !== "进行中"}
                  name={currentNode}
                  reFresh={getReview}
                />
              )}
              {currentNode === "会签" && (
                <DccHuiqian
                  id={process_id}
                  review_data={review_data["会签"]}
                  disabled={nodeData["会签"] !== "进行中"}
                  reFresh={getReview}
                />
              )}
            </CommonFlow>
          </Flex>
        </Spin>
      </div>
    </div>
  );
};

export default DccBpm;
