import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Space } from "antd";
import {
  getUserMessage,
  handleUserMessage,
} from "../../../apis/nc_review_router";
import { useNavigate } from "react-router-dom";

function MsgCenter() {
  const [msg_list, setMsgList] = useState([]);
  const navigate = useNavigate();
  const initMsg = () => {
    getUserMessage(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { messages } = data;
          setMsgList(messages);
        } else {
          setMsgList([]);
        }
      },
      () => {
        setMsgList([]);
      }
    );
  };
  const handleMenuClick = (e) => {
    const { 编号, id } = e;
    // 这里可以添加消息阅读状态更新等逻辑
    navigate("/mng/qms_reviewnoproduct/bpm", {
      state: { 编号 },
    });
    handleUserMessage({ id }, (res) => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        initMsg();
      }
    });
  };
  const items = msg_list.map((item, _) => ({
    key: _,
    label: (
      <Space onClick={() => handleMenuClick(item)}>
        <div>{item["模块"]}</div>
        <div>{item["流程单号"]}</div>
        <div></div>
      </Space>
    ),
  }));

  useEffect(() => {
    initMsg();
    const intervalId = setInterval(() => {
      initMsg();
    }, 60 * 1000);

    // 清理函数：组件卸载时清除定时器
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ width: 50, height: 40 }}>
      <Badge count={msg_list.length} offset={[-5, 10]} size="small">
        <Dropdown
          menu={{ items }}
          placement="bottom"
          arrow={true}
          trigger={["click"]}
        >
          <div className="mng_msg" title="消息" />
        </Dropdown>
      </Badge>
    </div>
  );
}

export default MsgCenter;
