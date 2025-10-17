import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./comp.less";

const default_stat = [
  {
    key: 0,
    title: "现象描述",
    stat: "pending",
  },
  {
    key: 1,
    title: "处置意见",
    stat: "pending",
  },
  {
    key: 2,
    title: "执行跟踪",
    stat: "pending",
  },
  {
    key: 3,
    title: "纠正和预防措施",
    stat: "pending",
  },
  {
    key: 4,
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
  const navigate = useNavigate();
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      let stat_list = [
        "现象描述",
        "处置意见",
        "执行跟踪",
        "纠正和预防措施",
        "关闭",
      ].map((item, _) => ({
        key: _,
        title: item,
        stat: data[item],
      }));
      setStatusList(stat_list);
    } else {
      setStatusList(default_stat);
    }
  }, [data]);
  // /mng/err_handle
  return (
    <Flex justify="space-between" align="center" className="ocap_status_bar">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      >
        不合格品评审列表
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
        {/* <div className="ocap_timer">
                    <div className="ocap_timer_img" />
                    <span>
                        共耗时:{hour}hr
                    </span>
                </div> */}
      </Flex>
      <div>&nbsp;</div>
    </Flex>
  );
}

export default StatusBar;
