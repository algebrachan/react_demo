import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Flex, Card, Typography } from "antd";
import "./dcc.less";
import { InfoCircleOutlined } from "@ant-design/icons";
import { dccGetFileStat } from "../../../../apis/qms_router";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCommonParam } from "../../mngSlice";
import { qmsDccUserDepartment } from "../../../../apis/nc_review_router";
import DccList from "./DccList";

const { Title } = Typography;

const color_obj = {
  全部流程: "#1890ff",
  已处理流程: "#52c41a",
  待处理流程: "#faad14",
};
const DocCard = ({ name = "", count = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cur_dcc_file_type } = useSelector((state) => state.mng.qms);

  return (
    <Card
      className={`dcc_doc_card ${
        name === cur_dcc_file_type && "dcc_doc_card_checked"
      }`}
      onClick={() => {
        if (location.pathname !== "/mng/qms_dcc") {
          navigate("/mng/qms_dcc");
        }
        dispatch(
          setCommonParam({
            param_name: "qms",
            param_val: { cur_dcc_file_type: name },
          })
        );
      }}
    >
      <Flex justify="space-between">
        <Title level={5}>{name}</Title>
        <div>
          <InfoCircleOutlined />
        </div>
      </Flex>
      <div className="count" style={{ color: color_obj[name] || "#333" }}>
        {count}
      </div>
    </Card>
  );
};

const default_doc_list = [
  { name: "全部流程", count: 0 },
  { name: "已处理流程", count: 0 },
  { name: "待处理流程", count: 0 },
];

function Dcc() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [doc_list, setDocList] = useState(default_doc_list);
  const RequestData = () => {
    dccGetFileStat(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          const doc_list = default_doc_list.map((item) => ({
            ...item,
            count: [data[item.name]],
          }));
          setDocList(doc_list);
        } else {
          setDocList(default_doc_list);
        }
      },
      () => {
        setDocList(default_doc_list);
      }
    );
  };
  const cardClick = (name) => {
    // 先判断地址是否是/mng/qms_dcc

    setCurFileType(name);
  };
  const initUser = () => {
    qmsDccUserDepartment(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          const { 姓名 = "", 角色, 部门 = "" } = data;
          dispatch(
            setCommonParam({
              param_name: "qms",
              param_val: { person: 姓名, department: 部门 },
            })
          );
        }
      },
      () => {}
    );
  };
  useEffect(() => {
    RequestData();
  }, [location]);
  useEffect(() => {
    initUser();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "DCC","流程管理"]} />
      <div style={{ padding: 16, background: "#fff", marginTop: 16 }}>
        <Flex gap={16}>
          {doc_list.map((item, _) => (
            <DocCard {...item} key={_} handleClick={cardClick} />
          ))}
        </Flex>
      </div>
      <div className="content_root">
        <DccList />
      </div>
    </div>
  );
}

export default Dcc;
