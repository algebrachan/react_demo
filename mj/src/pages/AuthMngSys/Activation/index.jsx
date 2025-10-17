import React, { useEffect, useRef, useState } from "react";
import { Layout, Form, Input, Flex, Button, Result, message } from "antd";
import { ComputeFormCol } from "../../../utils/obj";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getActiveCode, submitActivation } from "../../../apis/auth_api";
import { encryptDes } from "../utils/encode";
import "./a.less";
const { Header, Content, Footer } = Layout;

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
};

function Activation() {
  const [form] = Form.useForm();
  const [is_submit, setIsSubmit] = useState(false);
  const [is_emall, setIsEmall] = useState(false);
  const [emall_btn, setEmallBtn] = useState(false);
  const [second, setSecond] = useState(3);
  const navigate = useNavigate();
  const timer = useRef(-1);
  const applyCode = async () => {
    const { username, email, password, serial_number } = form.getFieldsValue();
    setIsEmall(false);
    setEmallBtn(true);
    getActiveCode(
      {
        username,
        email,
        password: encryptDes(password),
        serial_number,
      },
      (res) => {
        setEmallBtn(false);
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success(msg);
          setIsEmall(true);
        } else {
          message.error(msg);
        }
      },
      () => {
        setEmallBtn(false);
        message.error("网络异常");
      }
    );
  };
  const submit = () => {
    const val = form.getFieldsValue();
    val["password"] = encryptDes(val["password"]);
    submitActivation(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("激活成功，即将跳转登录页面...");
          setIsSubmit(true);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    if (!is_submit) return;

    timer.current = setInterval(() => {
      setSecond((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer.current);
  }, [is_submit, navigate]);

  useEffect(() => {
    if (second === 0) {
      navigate("/login"); // 倒计时结束跳转到登录页
    }
  }, [second]);

  return (
    <div className="manage_root">
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "100vw",
            position: "fixed",
            zIndex: 10,
          }}
          className="manage_header"
        >
          <div className="mng_logo" />
          <div className="mng_title">{window.sys_name}</div>
        </Header>
        <Content
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {is_submit ? (
            <div className="reasult_root">
              <Result
                icon={<CheckCircleFilled style={{ color: "#2BA471" }} />}
                title="恭喜!激活成功"
                subTitle={
                  <div>
                    激活有效期10个月,
                    <span style={{ color: "#ff4d4f" }}>{second}s</span>
                    后返回登录页面重新登陆
                  </div>
                }
                extra={[
                  <Button key="login" onClick={() => navigate("/login")}>
                    前往登录页面
                  </Button>,
                ]}
              />
            </div>
          ) : (
            <div className="activation_form_root">
              <div className="title">登录激活</div>
              <Form
                form={form}
                className="form_content"
                {...ComputeFormCol(4)}
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  serial_number: "",
                  license_key: "",
                }}
              >
                <Flex vertical gap={16}>
                  <Form.Item name="username" label="用户名">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item name="password" label="密码">
                    <Input.Password placeholder="请输入" />
                  </Form.Item>
                  <Form.Item name="serial_number" label="序列号">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item label="激活邮箱">
                    <Flex vertical gap={10}>
                      <Flex justify="space-between" gap={20}>
                        <Form.Item name="email" noStyle>
                          <Input placeholder="请输入" onChange={()=>setIsEmall(false)}/>
                        </Form.Item>
                        <Button
                          type="primary"
                          onClick={applyCode}
                          loading={emall_btn}
                        >
                          申请激活码
                        </Button>
                      </Flex>
                      {is_emall && (
                        <div className="activate_green_text">
                          <CheckCircleFilled />
                          <span>激活码已发送至邮箱</span>
                        </div>
                      )}
                    </Flex>
                  </Form.Item>
                  <Form.Item name="license_key" label="激活码">
                    <Input.TextArea rows={3} placeholder="请输入" />
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={submit}
                    >
                      激活
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </div>
          )}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          JSG | 300316
        </Footer>
      </Layout>
    </div>
  );
}

export default Activation;
