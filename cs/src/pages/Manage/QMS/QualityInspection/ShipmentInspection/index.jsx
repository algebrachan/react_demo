import React, {useState, useEffect} from "react";
import {MyBreadcrumb} from "@/components/CommonCard";
import {Tabs} from "antd";
import Report from "./Report";
import QueryResult from "./QueryResult";
import ReportQuery from "./ReportQuery";
import ShipmentCreate from "./ShipmentCreate";

function ShipmentInspection({isMobile = false}) {
  const items = isMobile ?
    [
      {
        key: "2",
        label: "出货工单",
        children: <ShipmentCreate />,
      },
      {
        key: "3",
        label: "检验报告",
        children: <Report />,
      },
    ] :
    [
      {
        key: "1",
        label: "出货检任务",
        children: <QueryResult />,
      },
      {
        key: "2",
        label: "出货工单",
        children: <ShipmentCreate />,
      },
      {
        key: "3",
        label: "检验报告",
        children: <Report />,
      },
      {
        key: "4",
        label: "报告查询",
        children: <ReportQuery />,
      },
    ];
  return (
    <div>
      {!isMobile && <MyBreadcrumb items={[window.sys_name, "质量检验", "出货检验"]} />}
      <div className="content_root">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}

export default ShipmentInspection;
