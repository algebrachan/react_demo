import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Carousel,
  message,
  Spin,
  Flex,
  Modal,
} from "antd";
import "./login.less";
import { useNavigate } from "react-router-dom";
import { activeStatus, login } from "../../apis/auth_api";
import { encryptDes } from "../AuthMngSys/utils/encode";
import {
  getLocal,
  setLocal,
  setSession,
  setSessionObj,
} from "../../utils/storage";
import devImg from "./assets/show_img.png";
import loginImg1 from "../../assets/login/1.jpg";
import loginImg2 from "../../assets/login/2.jpg";
import { ArrowRightOutlined } from "@ant-design/icons";
import { LoginDecryption } from "../../apis/rms";

const ActivationModal = ({ open = false, data = {}, onCancel }) => {
  const navigate = useNavigate();
  const status_obj = {
    active: "已激活",
    expired: "已过期",
    inactive: "未激活",
  };
  return (
    <Modal
      title="激活情况"
      open={open}
      onCancel={onCancel}
      destroyOnHidden={true}
      width={400}
      footer={[
        <Button onClick={onCancel} key="back">
          返回登录
        </Button>,
        <Button
          onClick={() => navigate("/activation")}
          key="refresh"
          type="primary"
        >
          刷新状态
        </Button>,
      ]}
    >
      <Flex vertical gap={16} className="activation_modal">
        <div>
          <span>激活状态:</span>
          <span className="value">
            {data["is_active"] && status_obj[data["is_active"]]}
          </span>
        </div>
        <div>
          <span>激活日期:</span>
          <span className="value">{data["avtive_time"]}</span>
        </div>
        <div>
          <span>激活剩余天数:</span>
          <span className="value">{data["time_left"]}</span>
        </div>
        <div>
          <span>激活到期日期 :</span>
          <span className="value">{data["expiration_date"]}</span>
        </div>
      </Flex>
    </Modal>
  );
};

const CarouselChild = ({ title = "", desc = "", src = "", url = "" }) => {
  const handleClick = () => {
    console.log("点击跳转到对应页面", url);
  };
  return (
    <div className="carousel">
      <img
        style={{ width: 365, height: 203, cursor: "pointer" }}
        src={src}
        onClick={handleClick}
      />
      <div className="title">{title}</div>
      <div className="text">{desc}</div>
    </div>
  );
};

function Login() {
  const SYS_NAME = window.sys_name;
  const FOOT_NAME = "浙江晶盛机电股份有限公司";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [login_spin, setSpin] = useState(false);
  const [user_info, setUserInfo] = useState({});
  const [is_modal, setIsModal] = useState(false);
  const submit = async () => {
    let val = form.getFieldsValue();
    const { user_name = "", user_psw = "" } = val;
    if (user_name === "" || user_psw === "") {
      message.warning("请输入用户名和密码");
      return;
    }
    let param = {
      username: user_name,
      password: encryptDes(user_psw),
    };
    setSpin(true);
    try {
      // 首先执行主登录请求
      const loginRes = await new Promise((resolve, reject) => {
        login(
          param,
          (res) => resolve(res),
          (err) => reject(err)
        );
      });

      // 然后处理主登录响应
      const { data, code, msg } = loginRes.data;
      if (data && code === 0) {
        const { permissions, token, user_info } = data;
        setLocal("account", user_name);
        const { access_token } = token;
        setSession("token", access_token);
        setSessionObj("permissions", permissions);
        setSessionObj("user_info", user_info);
        message.success("登录成功");
        navigate("/mng");
        // 主登录成功后，再尝试执行RMS解密请求（使用try-catch确保失败不影响主流程）
        try {
          const decryptionRes = await LoginDecryption({
            userName: user_name,
            password: encryptDes(user_psw),
          });

          const { Data, IsSuccess } = decryptionRes;
          // 处理RMS登录响应
          if (IsSuccess) {
            setSession("rms_token", `Bearer ${Data.AccessToken}`);
          }
        } catch (rmsError) {
          console.warn("RMS解密请求失败，但不影响登录流程", rmsError);
          // 这里可以选择是否显示警告信息
          // message.warning("RMS系统连接失败，部分功能可能受限");
        }

        // 无论RMS解密是否成功，都继续导航
      } else {
        message.error(msg);
        initUserInfo();
      }
    } catch (err) {
      message.error(`登录失败`);
    } finally {
      setSpin(false);
    }
  };
  const onKeyup = (e) => {
    if (e.keyCode === 13) {
      submit();
    }
  };
  const generateActivation = () => {
    let temp = "";
    switch (user_info["is_active"]) {
      case "active":
        temp = (
          <>
            <div>账号激活到期:{user_info["expiration_date"]}</div>
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={() => setIsModal(true)}
            >
              查看详情
            </Button>
          </>
        );
        break;
      case "expired":
        temp = (
          <>
            <div>账号已过期</div>
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={() => navigate("/activation")}
            >
              去激活
            </Button>
          </>
        );
        break;
      default:
        temp = (
          <>
            <div>首次登录需激活账号</div>
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={() => navigate("/activation")}
            >
              去激活
            </Button>
          </>
        );
        break;
    }
    return (
      <Flex className="activation_info" align="center" justify="space-between">
        {temp}
      </Flex>
    );
  };
  const cancel = () => {
    form.resetFields();
  };
  const initUserInfo = () => {
    let username = form.getFieldValue("user_name");
    if (username) {
      activeStatus({ username }, (res) => {
        const { data, code } = res.data;
        if (code === 0 && data) {
          const { expiration_date = "" } = data;
          data["expiration_date"] = expiration_date.split(" ")[0];
          setUserInfo(data);
        } else {
          setUserInfo({});
        }
      });
    }
  };
  useEffect(() => {
    form.setFieldValue("user_name", getLocal("account"));
    initUserInfo();
  }, []);
  return (
    <div className="login_root1">
      <div className="login_form_root" onKeyUp={(e) => onKeyup(e)}>
        <Spin tip="登录中。。。" spinning={login_spin} size="large">
          <div className="form_left">
            <Carousel style={{ width: 365, margin: "188px auto" }} autoplay>
              <CarouselChild
                title="统计过程控制分析模块"
                desc="通过实时监控生产过程的关键质量参数，确保生产过程的稳定性和一致性，从而提高产品质量，减少浪费，并优化生产效率"
                src={loginImg1}
              />
              <CarouselChild
                title="熔融加工过程分析模块"
                desc="纵向对比熔融过程的过程参数，利用数据驱动的AI算法自动识别异常过程，建立动态的监控管控通道实现工艺优化"
                src={loginImg2}
              />
              <CarouselChild
                title="配方管理模块"
                desc="RMS系统具备权限管控、步骤管控、参数管控、范围管控等功能，确保配方的完整性和正确性，实现先进工艺控制中的程序参数化需求。"
                src={devImg}
              />
            </Carousel>
          </div>
          <div className="form_right">
            <Form
              className="login_content"
              form={form}
              initialValues={{
                user_name: "",
                user_psw: "",
              }}
              layout="vertical"
            >
              <div className="logo" />
              <div className="title">{SYS_NAME}</div>
              <Form.Item name="user_name" label="用户名">
                <Input
                  className="ipt"
                  size="large"
                  placeholder="请输入用户名"
                />
              </Form.Item>
              <Form.Item name="user_psw" label="密码">
                <Input.Password
                  className="ipt"
                  size="large"
                  placeholder="请输入密码"
                />
              </Form.Item>
              {generateActivation()}
              <div className="btn_content">
                <Button type="primary" className="btn_cancel" onClick={cancel}>
                  取消
                </Button>
                <Button type="primary" className="btn_ok" onClick={submit}>
                  登录
                </Button>
              </div>
              <div className="foot">{FOOT_NAME}</div>
            </Form>
          </div>
        </Spin>
      </div>
      <ActivationModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        data={user_info}
      />
    </div>
  );
}

export default Login;
