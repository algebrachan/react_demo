import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, Button, Table, Card, Input } from "antd";
import dayjs from "dayjs";
import { GetRecordTypes, GetLog } from "@/apis/rms.js";
import Title from "@/pages/Manage/RMS/component/Title.jsx";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import MultiSelect from "@/pages/Manage/RMS/component/MultiSelect.jsx";

const RMSLog = ({ queryDeviceTypeIds }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordTypeOptions, setRecordTypeOptions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const defaultQueryFormData = {
    dateRange: [
      dayjs().subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ],
    recordTypes: [],
  };
  const formItems = [
    [
      {
        span: 4,
        label: "记录类型",
        name: "recordTypes",
        formItem: (
          <MultiSelect
            placeholder="请选择"
            allowClear
            showCheckAll
            options={recordTypeOptions}
          />
        ),
      },
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
      dataIndex: "index",
      width: 80,
      render: (text, record, index) => index + 1,
    },
    {
      title: "操作者",
      dataIndex: "Optor",
      width: 100,
    },
    {
      title: "操作类型",
      dataIndex: "RecordType",
      width: 120,
      render: (text) =>
        recordTypeOptions.find((opt) => opt.value === text)?.label,
    },
    {
      title: "记录时间",
      dataIndex: "RecordTime",
      width: 180,
    },
    {
      title: "内容",
      dataIndex: "Content",
      width: 1200,
    },
    {
      title: "备注",
      dataIndex: "Remark",
    },
  ];
  const getType = () => {
    GetRecordTypes()
      .then(({ Data }) => {
        if (Data) {
          // 将返回的对象转换为下拉框选项格式
          const options = Object.entries(Data).map(([key, value]) => ({
            value: parseInt(key),
            label: value,
          }));
          form.setFieldValue(
            ["recordTypes"],
            options.map(({ value }) => value)
          );
          setRecordTypeOptions(options);
        } else {
          setRecordTypeOptions([]);
        }
      })
      .catch(() => {
        setRecordTypeOptions([]);
      });
  };
  // 查询日志记录
  const search = (page = 1, pageSize = 20) => {
    setLoading(true);
    const {
      dateRange: [startTime, endTime],
      recordTypes,
    } = form.getFieldsValue();
    // 构建查询参数
    const params = {
      pageInfo: {
        index: page,
        pageSize: pageSize,
      },
      startTime,
      endTime,
      recordTypes,
      deviceTypeIds: queryDeviceTypeIds,
    };
    GetLog(params)
      .then(({ PageInfo: { Index, PageSize, Count }, ListData }) => {
        const dataWithKeys = (ListData ?? []).map((item, _) => ({
          ...item,
          key: _,
        }));
        setTableData(dataWithKeys);
        setPagination({
          current: Index,
          pageSize: PageSize,
          total: Count || 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getType();
  }, []);
  useEffect(() => {
    if (recordTypeOptions.length > 0) {
      search();
    }
  }, [queryDeviceTypeIds, recordTypeOptions]);
  // 分页变化处理
  const handleTableChange = (paginationInfo) => {
    search(paginationInfo.current, paginationInfo.pageSize);
  };
  return (
    <Title
      style={{ height: `calc(100% - 16)` }}
      margin={`0 0 16`}
      title="日志记录"
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
          y: `calc(100vh - 398)`,
        }}
        pagination={{
          ...pagination,
          position: ["bottomCenter"],
          showTotal: (total) => `共 ${total} 条`,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
      />
    </Title>
  );
};
export default RMSLog;
