import { Image, Button } from "antd";
import React, { useState } from "react";
import useWebSocket from "../../utils/websocket";
import { useEffect } from "react";
import { Flex } from "antd";

function Test() {
  const [imageBase64, setImageBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 新增加载状态

  // 使用WebSocket hook，这里的URL需要根据实际后端WebSocket服务地址修改
  const [socket, sendMessage, lastMessage, isConnected] = useWebSocket({
    url: `ws://10.60.38.28:8080`, // 替换为实际的WebSocket服务地址
    onMessage: (message) => {
      // 假设后端返回的数据包含base64字符串
      console.log("收到消息:", message);
      if (message.length > 20) {
        let img_base64 = message.split(",")[1];
        setImageBase64(img_base64);
      }
    },
    onError: (event) => {
      console.error("WebSocket连接错误:", event);
      setIsLoading(false); // 发生错误时，关闭加载状态
    },
    onOpen: () => {
      console.log("WebSocket连接已建立");
    },
  });

  const handleButtonClick = () => {
    sendMessage(1);
  };
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <Flex vertical gap={16}>
      <div>
        <Button
          type="primary"
          onClick={handleButtonClick}
          //   loading={isLoading} // 添加加载动画属性
        >
          发送
        </Button>
      </div>
      {imageBase64 ? (
        <Image
          src={`data:image/png;base64,${imageBase64}`}
          alt="WebSocket返回的图片"
        />
      ) : (
        <Image src="" alt="暂无图片" preview={false} />
      )}
    </Flex>
  );
}

export default Test;
