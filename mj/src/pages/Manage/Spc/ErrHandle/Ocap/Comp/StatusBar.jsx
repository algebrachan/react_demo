import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./comp.less";

const default_stat = [
  {
    key: 1,
    title: "异常预警",
    stat: "pending",
  },
  {
    key: 2,
    title: "原因分析",
    stat: "pending",
  },
  {
    key: 3,
    title: "原因分类",
    stat: "pending",
  },
  {
    key: 4,
    title: "对策提交",
    stat: "pending",
  },
  {
    key: 5,
    title: "实验验证",
    stat: "pending",
  },
  {
    key: 6,
    title: "质量确认",
    stat: "pending",
  },
  {
    key: 7,
    title: "关闭",
    stat: "pending",
  },
];
const StatusItem = ({ title = "", stat = "pending" }) => {
  return (
    <Flex vertical align="center" gap={5}>
      <div className={`ocap_stat_${stat}`} />
      <div style={{ color: "#333" }}>{title}</div>
    </Flex>
  );
};
function StatusBar({ data = {} }) {
  const [status_list, setStatusList] = useState(default_stat);
  const [hour, setHour] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const { 流程 = [], 耗时 = 0 } = data;
    if (流程.length > 0) {
      setStatusList(流程);
      setHour(耗时);
    } else {
      setStatusList(default_stat);
      setHour(0);
    }
  }, [data]);
  // /mng/err_handle
  return (
    <Flex justify="space-between" align="center" className="ocap_status_bar">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/mng/err_handle")}
      >
        异常概览
      </Button>
      <Flex gap={5} align="center">
        {status_list.map((item, _) => (
          <Fragment key={_}>
            <StatusItem key={item.key} title={item.title} stat={item.stat} />
            {_ < status_list.length - 1 && (
              <div className={`line_${item.stat}`}>
                {item.stat === "processing" ? <div /> : ""}
              </div>
            )}
          </Fragment>
        ))}
        <div className="ocap_timer">
          <div className="ocap_timer_img" />
          <span>共耗时:{hour}hr</span>
        </div>
      </Flex>
      <div>&nbsp;</div>
    </Flex>
  );
}

export default StatusBar;
