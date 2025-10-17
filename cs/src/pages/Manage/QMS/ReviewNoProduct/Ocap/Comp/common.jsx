import { Flex } from "antd";
import React from "react";
import closeIcon from "../../../../../../assets/ocap/close.png";
import checkIcon from "../../../../../../assets/ocap/check.png";
import "./comp.less";

export const RecommendedComp = ({ arr = [], useReson }) => {
  return (
    <Flex gap={20}>
      <Flex vertical gap={6} style={{ color: "#8E8E93" }}>
        <div>推荐原因:</div>
        {arr.map((item, _) => (
          <div key={_}>{`${_ + 1}、${item}`}</div>
        ))}
      </Flex>
      <Flex vertical gap={6}>
        <div>&nbsp;</div>
        {arr.map((item, _) => (
          <a key={_} onClick={() => useReson(_)}>
            使用
          </a>
        ))}
      </Flex>
    </Flex>
  );
};

export const StatusGreen = ({ text = "决策已填写" }) => {
  return (
    <Flex gap={5} className="ocap_tag_green" align="center">
      <img src={checkIcon} />
      <span>{text}</span>
    </Flex>
  );
};
export const StatusRed = ({ text = "决策未填写" }) => {
  return (
    <Flex gap={5} className="ocap_tag_red" align="center">
      <img src={closeIcon} />
      <span>{text}</span>
    </Flex>
  );
};
