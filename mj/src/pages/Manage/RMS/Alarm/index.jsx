import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, Button, Table, Card, Input } from "antd";
import dayjs from "dayjs";
import { getDeviceHistoryAlarmList } from "@/apis/rms.js";
import Title from "@/pages/Manage/RMS/component/Title.jsx";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";

const RMSAlarm = ({ queryDeviceTypeIds }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const defaultQueryFormData = {
    dateRange: [
      dayjs().subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ],
  };
  const formItems = [
    [
      {
        span: 6,
        label: "时间范围",
        name: "dateRange",
        getValueProps: (value) => ({
          value: value && value.map((i) => i && dayjs(i)),
        }),
        normalize: (value) =>
          value?.map((i) => i && dayjs(i).format("YYYY-MM-DD HH:mm:ss")),
        formItem: (
          <DatePicker.RangePicker
            showTime
            placeholder={["开始时间", "结束时间"]}
            allowClear={false}
          />
        ),
      },
    ],
  ];
  // 表格列定义
  const columns = [
    {
      title: "序号",
      width: 80,
      render: (text, record, index) => index + 1,
    },
    {
      title: "设备名称",
      dataIndex: "DeviceName",
      width: 120,
    },
    {
      title: "报警时间",
      dataIndex: "RecordTime",
      width: 180,
    },
    {
      title: "消除时间",
      dataIndex: "ClearTime",
      width: 180,
    },
    {
      title: "报警内容",
      dataIndex: "RecordContemt",
    },
  ];
  useEffect(() => {
    search();
  }, [queryDeviceTypeIds]);
  // 查询日志记录
  const search = () => {
    setLoading(true);
    const [startTime, endTime] = form.getFieldValue(["dateRange"]);
    getDeviceHistoryAlarmList({
      startTime,
      endTime,
      deviceTypeIds: queryDeviceTypeIds,
    })
      .then((res) => {
        setTableData(res.ListData ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Title
      style={{ height: `calc(100% - 16` }}
      margin={`0 0 16`}
      title="报警记录"
      border={false}
    >
      <CustomForm
        form={form}
        formItems={formItems}
        onValuesChange={() => search()}
        initialValues={defaultQueryFormData}
      />
      <Table
        size="small"
        columns={columns}
        dataSource={tableData}
        loading={loading}
        scroll={{
          x: "max-content",
          y: `calc(100vh - 342)})`,
        }}
        pagination={false}
      />
    </Title>
  );
};
export default RMSAlarm;
