import React, { useState, useEffect } from "react";
import {
  Button,
  Cascader,
  Form,
  Input,
  Table,
  Modal,
  Flex,
  message,
  Space,
} from "antd";
import { ComputeFormCol, FileUpload } from "../../../../../utils/obj";
import { PlusOutlined } from "@ant-design/icons";
export const DEPARTMENT_LIST = [
  "研发技术部",
  "制造部",
  "长晶生产车间",
  "原料合成车间",
  "坩埚车间",
  "设备动力科",
  "质量管理部",
  "安环部",
  "采购部",
  "财务部",
  "信息部",
  "综合办",
  "销售部",
  "计划部",
  "人力资源部",
];
export const FILE_RANK = ["一级", "二级", "三级", "指导书", "单点教育"];
export const URGENCY = ["一般", "中等", "紧急"];
export const DOC_FUNC = ["质量管理体系", "环境和职业健康安全管理体系"];
export const SECURITY_LEVEL = ["绝密A", "机密B", "秘密C", "公开D"];
export const TIME_RANGE = [
  { label: "一个月", value: 1 },
  { label: "三个月", value: 3 },
  { label: "半年", value: 6 },
  { label: "一年", value: 12 },
  { label: "全部", value: 0 },
  { label: "自定义", value: -1 },
];
const versionOptions = Array.from({ length: 5 }, (_, i) => ({
  value: `V${i + 1}`,
  label: `V${i + 1}`,
  children: Array.from({ length: 11 }, (_, j) => ({
    value: `V${i + 1}.${j}`,
    label: `V${i + 1}.${j}`,
    // 第三层级示例
    // children: Array.from({length:5}, (_,k) => ({
    //   value: `v${i+1}.${j}.${k}`,
    //   label: `修订版${k}` }))
  })),
}));

export const CommonFormDataItems = [
  { name: "公司", type: "input", disabled: true },
  {
    name: "文件申请类型",
    type: "select",
    opt: ["新增", "更改", "接收外来文件", "作废"],
  },
  { name: "申请人", type: "input", required: true },
  { name: "申请部门", type: "select", required: true, opt: DEPARTMENT_LIST },
  { name: "申请原因", type: "text_area", required: true },
  { name: "申请时间", type: "time", required: true },
  { name: "紧急程度", type: "select", required: true, opt: URGENCY },
  { name: "内外部", type: "radio", required: true, opt: ["内部", "外部"] },
];
export const AddFormDataItems = [
  { name: "文件职能", type: "select", required: true, opt: DOC_FUNC },
  { name: "文件级别", type: "select", required: true, opt: FILE_RANK },
  { name: "归档部门", type: "select", required: true, opt: DEPARTMENT_LIST },
  { name: "保密等级", type: "select", required: true, opt: SECURITY_LEVEL },
  { name: "文件名称", type: "input", required: true },
  { name: "文件版本", type: "cascader", required: true, opt: versionOptions },
  {
    name: "文件编号",
    type: "input",
    placeholder: "请申请编号",
    disabled: true,
  },
  { name: "文件编制人", type: "input", required: true },
];
export const UpdateFormDataItems = [
  { name: "文件职能", type: "select", required: true, opt: DOC_FUNC },
  { name: "文件级别", type: "select", required: true, opt: FILE_RANK },
  { name: "归档部门", type: "select", required: true, opt: DEPARTMENT_LIST },
  { name: "保密等级", type: "select", required: true, opt: SECURITY_LEVEL },
  {
    name: "更改前文件名称",
    type: "customize",
    required: true,
    component: <Input />,
  },
  {
    name: "更改前文件版本",
    type: "cascader",
    required: true,
    opt: versionOptions,
  },
  { name: "更改前文件编号", type: "input", required: true },
  { name: "更改后文件名称", type: "input", required: true },
  {
    name: "更改后文件版本",
    type: "cascader",
    required: true,
    opt: versionOptions,
  },
  { name: "更改后文件编号", type: "input", required: true },
  { name: "文件更改原因", type: "text_area", required: true },
  { name: "更改前内容", type: "text_area", required: true },
  { name: "更改后内容", type: "text_area", required: true },
  {
    name: "文件处置",
    type: "input",
    required: true,
  },
  { name: "文件编制人", type: "input", required: true },
];
export const ReceiveFormDataItems = [
  {
    name: "文件类型",
    type: "select",
    required: true,
    opt: ["协议类", "其他类"],
  },
  { name: "保密等级", type: "select", required: true, opt: SECURITY_LEVEL },
  { name: "归档部门", type: "select", required: true, opt: DEPARTMENT_LIST },
  { name: "外来文件名称", type: "input", required: true },
  {
    name: "外来文件版本",
    type: "cascader",
    required: true,
    opt: versionOptions,
  },
  { name: "外来文件编号", type: "input", required: true },
  { name: "文件来源", type: "input", required: true },
  { name: "接收人", type: "input", required: true },
  { name: "接收时间", type: "time", required: true },
  { name: "适用范围", type: "input", required: true },
  { name: "适用内容", type: "input", required: true },
  { name: "代替内容", type: "text_area", required: true },
  { name: "实施时间", type: "time", required: true },
];
export const CancelFormDataItems = [
  { name: "文件职能", type: "select", required: true, opt: DOC_FUNC },
  { name: "文件级别", type: "select", required: true, opt: FILE_RANK },
  { name: "保密等级", type: "select", required: true, opt: SECURITY_LEVEL },
  {
    name: "需作废文件名称",
    type: "customize",
    required: true,
    component: <Input />,
  },
  {
    name: "需作废文件版本",
    type: "cascader",
    required: true,
    opt: versionOptions,
  },
  { name: "需作废文件编号", type: "input", required: true },
  { name: "需作废文件编制人", type: "input", required: true },
  { name: "作废日期", type: "date", required: true },
  {
    name: "作废留存时间",
    type: "select",
    required: true,
    opt: ["3年", "15年"],
  },
  {
    name: "查看部门",
    type: "checkbox",
    required: true,
    opt: DEPARTMENT_LIST,
  },
];

// 四级文件表单文件
export const RelatedFormTable = ({
  tb_data = [],
  setTbData = () => {},
  addFormNumbers,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [modal_file, setModalFile] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "表单名称",
      dataIndex: "表单名称",
      key: "表单名称",
    },
    {
      title: "表单编号",
      dataIndex: "表单编号",
      key: "表单编号",
    },
    {
      title: "版本",
      dataIndex: "版本",
      key: "版本",
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
            disabled={disabled}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const handleSubmit = async () => {
    if (modal_file.length === 0) return message.warning("请选择文件");
    const values = form.getFieldsValue();
    const file_item = {
      key: Date.now().toString(),
      表单名称: values["表单名称"],
      版本: Array.isArray(values["版本"])
        ? values["版本"].length >= 2
          ? values["版本"][1]
          : ""
        : values["版本"] || "",
      file: modal_file[0],
    };
    const temp_tb = addFormNumbers([...tb_data, file_item]);
    setTbData(temp_tb);
    setIsModalOpen(false);
  };
  const handleDelete = (key) => {
    const newData = tb_data.filter((item) => item.key !== key);
    setTbData(addFormNumbers(newData));
  };
  useEffect(() => {
    if (modal_file.length > 0) {
      form.setFieldValue("表单名称", modal_file[0].name);
    } else {
      form.setFieldValue("表单名称", "");
    }
  }, [modal_file]);
  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setModalFile([]);
    }
  }, [isModalOpen]);
  return (
    <div>
      <Table
        title={() => (
          <Flex justify="end" gap={20}>
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<PlusOutlined />}
              disabled={disabled}
            >
              添加四级文件
            </Button>
          </Flex>
        )}
        size="small"
        columns={columns}
        dataSource={tb_data}
        bordered
        pagination={false}
      />
      <Modal
        title="添加四级文件"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          initialValues={{ 表单名称: "", 版本: "V1.0" }}
          {...ComputeFormCol(6)}
        >
          <Flex vertical gap={16}>
            <Form.Item name="表单名称" label="表单名称">
              <Input disabled />
            </Form.Item>
            <Form.Item name="版本" label="版本">
              <Cascader
                options={versionOptions}
                placeholder="请选择"
                expandTrigger="hover"
                displayRender={(labels) => labels[labels.length - 1]}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item label="上传四级文件">
              <FileUpload
                listType="text"
                fileList={modal_file}
                setFileList={setModalFile}
              />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </div>
  );
};
