import React from "react";
import LogicFlow from "@logicflow/core";
import {
  DndPanel,
  Control,
  SelectionSelect,
  BPMNElements,
} from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import "@logicflow/extension/dist/index.css";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Timeline } from "antd";

const CommonFlow = ({
  style = {},
  className = "",
  onNodeClick,
  children,
  graphData = { nodes: [], edges: [] },
  nodeData = {},
  recordData = [],
  minHeight = 600,
}) => {
  const containerRef = useRef(null);
  const lfContainerRef = useRef(null);
  const lfInstanceRef = useRef(null);
  const isFirst = useRef(true);
  const [graphHeight, setGraphHeight] = useState(0);
  const stylesMap = {
    未开始: {
      fill: "rgba(145,148,154,0.5)",
      stroke: "rgb(145,148,154)",
      strokeWidth: 2,
    },
    通过: {
      fill: "rgba(104,194,60,0.5)",
      stroke: "rgb(104,194,60)",
      strokeWidth: 2,
    },
    进行中: {
      fill: "rgb(65,159,255)",
      stroke: "rgb(9,86,234)",
      strokeWidth: 2,
    },
    驳回: {
      fill: "rgba(245,109,109,0.8)",
      stroke: "rgb(202,3,3)",
      strokeWidth: 2,
    },
  };
  const handleGraphData = (nodeData) => {
    const { nodes, edges } = graphData;
    return {
      nodes: nodes.map((node) => {
        return {
          ...node,
          properties: { style: stylesMap[nodeData[node.id]] },
        };
      }),
      edges,
    };
  };
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      // LogicFlow.use(Control);
      // LogicFlow.use(DndPanel);
      // LogicFlow.use(SelectionSelect);
      LogicFlow.use(BPMNElements);
      const graphRect = containerRef.current.getBoundingClientRect();
      setGraphHeight(graphRect.height);
      lfInstanceRef.current = new LogicFlow({
        container: lfContainerRef.current,
        grid: true,
        isSilentMode: true,
        stopScrollGraph: true,
        nodeTextEdit: false,
        edgeTextEdit: false,
        textEdit: false,
      });
      lfInstanceRef.current.on("node:click", ({ data, e, position }) => {
        onNodeClick && onNodeClick(data, e, position);
      });
    }
    const newGraphData = handleGraphData(nodeData);
    lfInstanceRef.current.render(newGraphData);
    setTimeout(() => {
      lfInstanceRef.current.translateCenter();
      lfInstanceRef.current.fitView();
    });
  }, [nodeData]);
  return (
    <div
      className={`bpmn ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: minHeight,
        display: "flex",
        padding: 10,
        ...style,
      }}
      ref={containerRef}
    >
      <div
        className="graph"
        style={{ width: "400px", height: graphHeight, flex: "none" }}
        ref={lfContainerRef}
      ></div>
      <div
        className="form"
        style={{
          flex: "auto",
          overflow: "auto",
          padding: "8px",
        }}
      >
        {children}
      </div>
      <Timeline
        items={recordData}
        style={{
          width: "300px",
          height: graphHeight,
          flex: "none",
          overflow: "auto",
          padding: 10,
        }}
      ></Timeline>
    </div>
  );
};
export default CommonFlow;
