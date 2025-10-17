import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../utils/storage";

function Err404() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起,你不能访问"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/login", { replace: true });
            logout();
          }}
        >
          返回登录页面
        </Button>
      }
    />
  );
}

export default Err404;
