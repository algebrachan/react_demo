import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../../components/CommonCard";
import { useLocation } from "react-router-dom";
import StatusBar from "./Comp/StatusBar";
import { Button, Descriptions, Flex, message } from "antd";
import PhenomenonDesc from "./Comp/PhenomenonDesc";
import DisposalOpinion from "./Comp/DisposalOpinion";
import ExecutionTrack from "./Comp/ExecutionTrack";
import Correct from "./Comp/Correct";
import {
  qmsGetReviews,
  qmsGetReviewStatus,
  qmsManualClose,
} from "../../../../../apis/qms_router";

function Ocap() {
  const { state = {} } = useLocation();
  const [data, setData] = useState({});
  const [record, setRecord] = useState({});
  const [id, setId] = useState("");
  const [status_data, setStatusData] = useState({});
  const desc_items = [
    "产品名称",
    "规格",
    "物料编号",
    "批次号",
    "批次总数量",
    "不合格数量",
    "不合格占比",
    "检验员",
    "检验日期",
  ].map((item, _) => ({
    key: _ + 1,
    label: item,
    children: record[item] || "",
  }));

  const requestData = () => {
    qmsGetReviews(
      { review_id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setData(data);
        } else {
          setData({});
        }
      },
      () => {
        setData({});
      }
    );
  };
  const getStatus = () => {
    qmsGetReviewStatus(
      { review_id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0){
          setStatusData(data);
        } else{
          setStatusData({})
        }
      },
      () => { setStatusData({})}
    );
  };

  const refresh = () => {
    getStatus();
    requestData();
  }
  const close = () => {
    qmsManualClose({ review_id: id }, (res) => {
      const {code,msg,data} = res.data;
      if(code === 0&&data) {
        message.success('关闭成功')
        refresh()
      }else{
        message.error(msg)
      }
    },()=>{
      console.log("关闭失败")
    })
  }
  useEffect(() => {
    if (id) {
      refresh()
    }
  }, [id]);

  useEffect(() => {
    const { record } = state;
    if (record && record.编号) {
      setRecord(record);
      setId(record.编号);
    }
  }, [state]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "不合格品评审", "处理详情"]} />
      <Flex className="content_root" vertical gap={20}>
        <StatusBar data={status_data} />
        <Descriptions title="基础信息" bordered items={desc_items} />
        <PhenomenonDesc id={id} data={data["non_conformance_description"]} refresh={refresh}/>
        <DisposalOpinion id={id} data={data['department_opinions']} detail={data['final_disposition']} refresh={refresh}/>
        <ExecutionTrack id={id} data={data['execution_tracking']} refresh={refresh}/>
        <Correct id={id} data={data['corrective_preventive_measures']} refresh={refresh}/>
        {/* <Flex justify="end"><Button type="primary" danger onClick={close}>关闭</Button></Flex> */}
      </Flex>
    </div>
  );
}

export default Ocap;
