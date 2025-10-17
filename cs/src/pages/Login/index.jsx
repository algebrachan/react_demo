import React, {useEffect, useState} from "react";
import {Button, Form, Input, Carousel, message, Spin} from "antd";
import "./login.less";
import {useNavigate, useSearchParams} from "react-router-dom";
import {login} from "../../apis/auth_api";
import {encryptDes} from "../AuthMngSys/utils/encode";
import {
  getLocal,
  setLocal,
  setSession,
  setSessionObj,
} from "../../utils/storage";
import devImg from "./assets/show_img.png";
import loginImg1 from "../../assets/login/1.jpg";
import loginImg2 from "../../assets/login/2.jpg";

const CarouselChild = ({title = "", desc = "", src = "", url = ""}) => {
  const handleClick = () => {
    console.log("点击跳转到对应页面", url);
  };
  return (
    <div className="carousel">
      <img
        style={{width: 365, height: 203, cursor: "pointer"}}
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
  const [searchParams] = useSearchParams();
  const [login_spin, setSpin] = useState(false);
  const [autoLoading, setAutoLoading] = useState(true);
  const submit = () => {
    let val = form.getFieldsValue();
    const {user_name = "", user_psw = ""} = val;
    if (user_name === "" || user_psw === "") {
      message.warning("请输入用户名和密码");
      return;
    }
    let param = {
      username: user_name,
      password: encryptDes(user_psw),
    };
    loginRequest(param)
  };
  const autoNavigate = (permissions, toPath) => {
    const qmsMenu = permissions.find(({menu_type, path}) => menu_type === '菜单' && ~(path?.indexOf(toPath) ?? -1))
    navigate(qmsMenu ? qmsMenu.path : '/mng')
  }
  const loginRequest = (param) => {
    setSpin(true);
    setTimeout(() => {
      login(
        param,
        (res) => {
          setSpin(false);
          const {data, code, msg} = res.data;
          if (data && code === 0) {
            const {permissions, token, user_info} = data;
            const {username} = user_info;
            const {access_token} = token;
            setLocal("account", username);
            setSession("token", access_token);
            setSessionObj("permissions", permissions);
            setSessionObj("user_info", user_info);
            message.success("登录成功");
            const from = searchParams.get('from');
            const to = searchParams.get('to')
            if (from === 'qms') autoNavigate(permissions, '/qms')
            else if (from === 'fdc') autoNavigate(permissions, '/fdc')
            else if (from === 'spc_analysis') autoNavigate(permissions, '/spc_analysis')
            else if (from === 'spc_dispatch') autoNavigate(permissions, '/spc_dispatch')
            else if (to) navigate(to)
            else navigate("/mng");
          } else {
            message.error(msg);
          }
        },
        () => {
          setSpin(false);
        }
      );
    }, 300)
  }
  const onKeyup = (e) => {
    if (e.keyCode === 13) {
      submit();
    }
  };
  const cancel = () => {
    form.resetFields();
  };
  useEffect(() => {
    form.setFieldValue("user_name", getLocal("account"));
    const token = searchParams.get('token')
    const username = searchParams.get('username')
    const password = searchParams.get('password')
    if (token) {
      loginRequest({token})
    } else if (username && password) {
      loginRequest({username, password})
    } else {
      setAutoLoading(false)
    }
  }, []);
  return (
    <div className={`login_root1 ${autoLoading ? 'login_root1--no_bg' : ''}`}>
      <div className="login_form_root" onKeyUp={(e) => onKeyup(e)}>
        <Spin tip="登录中。。。" spinning={login_spin} size="large">
          {
            !autoLoading && (
              <>
                <div className="form_left">
                  <Carousel style={{width: 365, margin: "188px auto"}} autoplay>
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
              </>
            )
          }
        </Spin>
      </div>
    </div>
  );
}

export default Login;
