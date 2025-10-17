import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../../components/CommonCard";
import StatusBar from "./Comp/StatusBar";
import {
  confirmClosure,
  getLotnumberList,
  getProcessStatus,
  qualityConfirmation,
} from "../../../../../apis/ocap_api";
import "./ocap.less";
import ErrProduct from "./Comp/ErrProduct";
import { Button, Flex, message } from "antd";
import ReasonAnls from "./Comp/ReasonAnls";
import { useSelector } from "react-redux";
import ReasonClassify from "./Comp/ReasonClassify";
import Countermeasure from "./Comp/Countermeasure";
import Improve from "./Comp/Improve";
import { useSearchParams } from "react-router-dom";

function Ocap() {
  const [searchParams] = useSearchParams();
  const [id, setId] = useState("");
  const [status_data, setStatusData] = useState({});
  const [err_list, setErrList] = useState([]);

  const refresh_count = useSelector((state) => state.mng.ocap["refresh_count"]);
  const queryStatus = () => {
    getProcessStatus({ _id: id }, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        setStatusData(data);
      } else {
        setStatusData({});
      }
    });
  };
  const queryErrList = () => {
    getLotnumberList({ _id: id }, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        const { data_list } = data;
        setErrList(data_list);
      } else {
        setErrList([]);
      }
    });
  };
  const handleQuality = () => {
    qualityConfirmation(
      { _id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("操作成功");
          queryStatus();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const handleClose = () => {
    confirmClosure(
      { _id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("关闭成功");
          queryStatus();
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
    if (id) {
      queryStatus();
      queryErrList();
    }
  }, [id, refresh_count]);

  useEffect(() => {
    let id = searchParams.get("id");
    console.log("id", id);
    setId(id);
  }, [searchParams]);
  return (
    <div style={{ position: "relative" }}>
      <MyBreadcrumb items={[window.sys_name, "异常处理", "异常处理详情"]} />
      <div className="content_root">
        <StatusBar data={status_data} />
      </div>
      <Flex
        className="ocap_content_ocap"
        vertical
        gap={10}
        style={{ marginBottom: 40 }}
      >
        <ErrProduct id={id} err_list={err_list} queryErrList={queryErrList} />
        <ReasonAnls id={id} />
        <ReasonClassify id={id} />
        <Countermeasure id={id} />
        <Improve id={id} />
      </Flex>
      <Flex
        justify="end"
        gap={20}
        className="ocap_footer_root"
        style={{ position: "fixed", bottom: 20 }}
      >
        <Button type="primary" onClick={handleQuality}>
          质量确认
        </Button>
        <Button>上一条</Button>
        <Button>下一条</Button>
        <Button type="primary" onClick={handleClose}>
          关闭流程
        </Button>
      </Flex>
    </div>
  );
}

export default Ocap;
