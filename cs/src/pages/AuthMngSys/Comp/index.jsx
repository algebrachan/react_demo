import React, { useEffect, useState } from "react";
import "./comp.less";
import { getSession, logout } from "../../../utils/storage";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import { ComputeFormCol } from "../../../utils/obj";
import { encryptDes } from "../utils/encode";
import { modifyPassword } from "../../../apis/auth_api";
// 退出登录和用户按钮组件
const { Text } = Typography;

export const Logout = () => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const exit = async () => {
    // 加个提示
    const confirmed = await modal.confirm({
      title: "提示",
      content: <div>此操作将退出登录，是否继续?</div>,
      okText: "确认",
      cancelText: "取消",
    });
    if (confirmed) {
      navigate("/login", { replace: true });
      logout();
    }
  };
  return (
    <>
      {contextHolder}
      <div className="mng_logout" title="退出登录" onClick={() => exit()}>
        <LogoutOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
      </div>
    </>
  );
};

const PswModal = ({ open = false, onCancel }) => {
  const [form] = Form.useForm();
  const default_form_data = {
    旧密码: "",
    新密码: "",
    确认密码: "",
  };
  const handleOk = async () => {
    const { 旧密码, 新密码, 确认密码 } = await form.validateFields();
    if (新密码 !== 确认密码) {
      message.warning("新密码和确认密码必须相同");
      return;
    }
    const user_str = getSession("user_info");
    if (user_str) {
      const user_info = JSON.parse(user_str);
      const { user_id } = user_info;
      let val = {
        old_password: encryptDes(旧密码),
        new_password: encryptDes(新密码),
        user_id,
      };
      modifyPassword(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("修改成功");
            onCancel();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    } else {
      message.error("没有登录用户信息");
    }
    // 请求， 用户信息从token中获取
    // 修改成功之后需要重新登录
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);
  return (
    <Modal
      title="修改密码"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={400}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(6)}
      >
        <Flex vertical gap={16}>
          {["旧密码", "新密码", "确认密码"].map((item, _) => (
            <Form.Item
              label={item}
              name={item}
              key={_}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          ))}
        </Flex>
      </Form>
    </Modal>
  );
};

export const User = () => {
  const [is_modal, setIsModal] = useState(false);
  const [user, setUser] = useState({
    first: "",
    username: "",
  });
  // 用户的信息，从sessionStorage中获取
  // const user_str = getSession("user_info");
  useEffect(() => {
    const user_str = getSession("user_info");
    if (user_str) {
      const user_info = JSON.parse(user_str);
      const { nickname = "", username = "" } = user_info;
      setUser({
        first: nickname[0],
        username,
      });
    }
  }, []);
  return (
    <>
      <Space
        size={10}
        style={{ cursor: "pointer" }}
        onClick={() => setIsModal(true)}
        title="点击修改密码"
      >
        <Avatar
          // shape="square"
          style={{
            verticalAlign: "middle",
            backgroundColor: "#0070E0",
          }}
          // size="large"
        >
          {user["first"]}
        </Avatar>
        <Text style={{ color: "#fff", fontSize: 18 }}>{user["username"]}</Text>
      </Space>
      <PswModal
        open={is_modal}
        onCancel={() => {
          setIsModal(false);
          console.log("取消", is_modal);
        }}
      />
    </>
  );
};
