import React from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import InspectionGuideDoc from "./InspectionGuideDoc";
import { Tabs } from "antd";
import SopGuideDoc from "./SopGuideDoc";

function StandardMng() {
  const items = [
    {
      key: "1",
      label: "检验指导书",
      children: <InspectionGuideDoc />,
    },
    {
      key: "2",
      label: "作业指导书",
      children: <SopGuideDoc />,
    },
  ];

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "标准管理"]} />
      <div className="content_root">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}

export default StandardMng;
