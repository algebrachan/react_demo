import React, {useState, useEffect} from "react";
import {MyBreadcrumb} from "@/components/CommonCard";
import {Tabs} from "antd";
import Report from "./Report";
import NcInspectionTaskList from "./NcInspectionTaskList";
import QueryResult from "./QueryResult";
import {useDispatch, useSelector} from "react-redux";
import {setCommonParam} from "../../../mngSlice";

function InspectionReport({isMobile = false}) {
  const {inspection_tab} = useSelector((state) => state.mng.qms);
  const dispatch = useDispatch();
  const items = [
    {
      key: "1",
      label: "NC报检任务",
      children: <NcInspectionTaskList />,
    },
    {
      key: "2",
      label: "检验报告",
      children: <Report />,
    },
    {
      key: "3",
      label: "报告查询",
      children: <QueryResult />,
    },
  ];
  useEffect(() => {
    dispatch(
      setCommonParam({
        param_name: "qms",
        param_val: {inspection_tab: "1"},
      })
    );
  }, []);
  return (
    <div>
      {!isMobile && <MyBreadcrumb items={[window.sys_name, "质量检验", "进料检验"]} />}
      <div className="content_root">
        <Tabs
          activeKey={inspection_tab}
          items={items}
          onChange={(val) => {
            dispatch(
              setCommonParam({
                param_name: "qms",
                param_val: {inspection_tab: val},
              })
            );
          }}
        />
      </div>
    </div>
  );
}

export default InspectionReport;
