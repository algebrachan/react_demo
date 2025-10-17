import React, { useEffect, useState } from "react";
import { Flex, Form, message, Spin } from "antd";
import { CommonEditTable } from "../../../../../utils/obj";
import { qmsDccApproveSignature } from "../../../../../apis/nc_review_router";

function DccHuiqian({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) {
  const [load, setLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const columnsItems = [
    { name: "部门", type: "text" },
    { name: "负责人工号", type: "text" },
    { name: "驳回意见", type: "text_area" },
    { name: "是否同意", type: "radio", opt: ["同意", "驳回"] },
    { name: "签名", type: "input" },
    { name: "时间", type: "text" },
  ];
  const handleSubmit = (record) => {
    const { 部门, 驳回意见, 是否同意, 签名 } = record;

    if (是否同意 === "驳回" && !驳回意见?.trim()) {
      message.warning("请填写驳回意见");
      return;
    }
    const values = {
      process_id: id,
      部门,
      驳回意见,
      是否同意,
      签名,
    };
    setLoad(true);
    qmsDccApproveSignature(
      values,
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          reFresh();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("提交失败");
      }
    );
  };
  useEffect(() => {
    if (review_data && typeof review_data === "object") {
      const tableData = Object.entries(review_data).map(
        ([department, data]) => ({
          key: department,
          部门: department,
          负责人工号: data["负责人工号"] || "",
          意见: data["意见"] || "",
          是否同意: data["是否同意"] || "同意",
          签名: data["签名"] || "",
          时间: data["时间"] || "",
        })
      );
      setTbData(tableData);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">部门会签</div>
      <Spin spinning={load}>
        <Form disabled={disabled}>
          <Flex vertical gap={16}>
            <CommonEditTable
              dataSource={tb_data}
              setTbData={setTbData}
              is_submit={true}
              is_del={false}
              columnsItems={columnsItems}
              onSubmit={handleSubmit}
            />
          </Flex>
        </Form>
      </Spin>
    </Flex>
  );
}

export default DccHuiqian;
