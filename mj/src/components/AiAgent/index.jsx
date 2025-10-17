import React, { useState } from "react";
import "./agent.less";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const AgentButton = () => {
  const [isIframeVisible, setIframeVisible] = useState(false);
  const handleToggleIframe = () => {
    // 更新状态，取反当前值
    setIframeVisible((prevValue) => !prevValue);
  };
  return (
    <div>
      <Button
        className="fixed_button_container"
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleToggleIframe}
      />
      {isIframeVisible && (
        <iframe
          src="http://10.60.120.129:81/chat/5DPik3eiKIvpZTou"
          style={{
            position: "fixed",
            right: 20,
            bottom: 60,
            width: "400px",
            height: "600px",
            border: "none",
            zIndex: 1000, // 确保 iframe 显示在其他内容之上
          }}
          title="Togglable Iframe"
        />
      )}
    </div>
  );
};
