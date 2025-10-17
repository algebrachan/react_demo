import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  DatePicker,
  Button,
  Space,
  Typography,
  Table,
  message,
  Spin,
  Upload,
  Flex,
} from "antd";
import { EditTable } from "../Common";
import { ComputeFormCol } from "../../../../../utils/obj";
import {
  qmsGetReport,
  qmsPutReport,
  qmsPostReport,
} from "../../../../../apis/qms_router";

import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const agreeOptions = [
  { label: "同意", value: "同意" },
  { label: "驳回", value: "驳回" },
];
const FileUpload = ({ fileList = [], setFileList = () => {}, size = 10 }) => {
  return (
    <Upload
      maxCount={1}
      fileList={fileList}
      beforeUpload={(file) => {
        const isLt10M = file.size / 1024 / 1024 < size;
        if (!isLt10M) {
          message.error("文件大小不能超过10MB");
          return Upload.LIST_IGNORE;
        }
        return false;
      }}
      onChange={({ fileList }) => setFileList(fileList)}
      showUploadList={{ showRemoveIcon: true }}
    >
      <Button icon={<UploadOutlined />}>选择文件</Button>
    </Upload>
  );
};

const BianGengReport = ({ activeKey }) => {
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const default_form_data = {
    experimentCategory: "",
    test_number: "", // 测试编号
    edition: "",
    experimentName: "",
    testOrderNumber: "",
    keyWord: "",
    charge_charge_person: "",
    participants: [],
    experimentalDate: "",
    reportDate: "",
    compilation: "",
    compilationDate: "",
    review: "",
    reviewDate: "",
    approval: "",
    approvalDate: "",
    experimentPurpose: "",
    experimentalPlan: "",
    dataAnalysis: "",
    experimentalConclusion: "",
    questionsAndSuggestions: "",
    relatedAttachments: [],
    tableEditFlag: true,
  };

  const [tableData, setTableData] = useState([
    { 序号: 1, 部门: "研发技术部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 2, 部门: "长晶生产车间", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 3, 部门: "原料合成车间", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 4, 部门: "质量管理部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 5, 部门: "销售部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 6, 部门: "设备动力科", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 7, 部门: "人力资源部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 8, 部门: "坩埚车间", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 9, 部门: "制造部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 10, 部门: "采购部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 11, 部门: "PMC", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 12, 部门: "安环部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 13, 部门: "财务部", 意见: "", 是否同意: "", 签名: "" },
    { 序号: 14, 部门: "计划部", 意见: "", 是否同意: "", 签名: "" },
  ]);

  const columns = [
    {
      title: "序号",
      dataIndex: "序号",
      key: "序号",
    },
    {
      title: "部门",
      dataIndex: "部门",
      key: "部门",
    },
    {
      title: "意见",
      dataIndex: "意见",
      key: "意见",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record, "意见")}
        />
      ),
    },
    {
      title: "是否同意",
      dataIndex: "是否同意",
      key: "是否同意",
      render: (text, record) => (
        <Radio.Group
          value={text}
          onChange={(e) => handleRadioChange(e, record)}
          options={agreeOptions}
        />
      ),
    },
    {
      title: "签名",
      dataIndex: "签名",
      key: "签名",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record, "签名")}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleAgree(record)}>
            同意
          </Button>
          <Button type="link" onClick={() => handleReject(record)}>
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const handleInputChange = (e, record, field) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index][field] = e.target.value;
      setTableData(newData);
    }
  };

  const handleRadioChange = (e, record) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = e.target.value;
      setTableData(newData);
    }
  };

  const handleAgree = (record) => {
    message.success(`已同意 ${record.部门} 的会签`);
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = "同意";
      setTableData(newData);
    }
  };

  const handleReject = (record) => {
    message.warning(`已驳回 ${record.部门} 的会签`);
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = "驳回";
      setTableData(newData);
    }
  };

  // 实验用重要原辅料
  const materials_headData = [
    "材料编号",
    "材料名称",
    "规格",
    "生产批号",
    "供应商",
  ];
  const [materials_bodyData, setMaterialsBodyData] = useState([]);
  // 实验用生产设备
  const prod_equip_headData = [
    "设备编号",
    "设备名称",
    "型号",
    "下次维保日期",
    "状态",
  ];
  const [prod_equip_bodyData, setProdEquipBodyData] = useState([]);
  // 实验用检测设备
  const test_equip_headData = [
    "设备编号",
    "设备名称",
    "型号",
    "下次维保日期",
    "状态",
  ];
  const [test_equip_bodyData, setTestEquipBodyData] = useState([]);
  // 实验结果

  const results_headData = [
    "验证项目",
    "验证方法标准",
    "判定标准",
    "验证结果",
    "结果判定",
  ]; // 原文件未明确，这里假设列名
  const [results_bodyData, setResultsBodyData] = useState([]);

  const search_report = () => {
    const { number } = form.getFieldsValue();
    if (!number) return message.error("请选择变更单号");
    setLoad(true);
    qmsGetReport(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          setData(data);
        } else {
          form.setFieldsValue({ ...default_form_data });
          setMaterialsBodyData([]);
          setProdEquipBodyData([]);
          setTestEquipBodyData([]);
          setResultsBodyData([]);
        }
      },
      () => {
        setLoad(false);
        form.setFieldsValue({ ...default_form_data });
        setMaterialsBodyData([]);
        setProdEquipBodyData([]);
        setTestEquipBodyData([]);
        setResultsBodyData([]);
        message.error("查询失败");
      }
    );
  };

  const put_report = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    const param = {
      ...values,
      relatedAttachments: [],
      tableEditFlag: true,
      materials_headData,
      materials_bodyData,
      prod_equip_headData,
      prod_equip_bodyData,
      test_equip_headData,
      test_equip_bodyData,
      results_headData,
      results_bodyData,
      bodyData: tableData,
      headData: ["序号", "部门", "意见", "是否同意", "签名"],
    };
    const formData = new FormData();
    formData.append("changes_report", JSON.stringify(param));
    if (fileList.length > 0) {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    qmsPutReport(
      formData,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("保存成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("保存失败");
      }
    );
  };

  const post_report = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    const param = {
      ...values,
      relatedAttachments: [],
      tableEditFlag: true,
      materials_headData,
      materials_bodyData,
      prod_equip_headData,
      prod_equip_bodyData,
      test_equip_headData,
      test_equip_bodyData,
      results_headData,
      results_bodyData,
      bodyData: tableData,
      headData: ["序号", "部门", "意见", "是否同意", "签名"],
    };
    const formData = new FormData();
    formData.append("changes_report", JSON.stringify(param));
    if (fileList.length > 0) {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    qmsPostReport(
      formData,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const chgCategory = (value) => {
    if (data[value]) {
      form.setFieldsValue({
        ...default_form_data,
        ...data[value],
        experimentCategory: value,
      });
      const {
        materials_bodyData = [],
        prod_equip_bodyData = [],
        test_equip_bodyData = [],
        results_bodyData = [],
      } = data[value];
      setMaterialsBodyData(
        materials_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
      setProdEquipBodyData(
        prod_equip_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
      setTestEquipBodyData(
        test_equip_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
      setResultsBodyData(
        results_bodyData.map((item, index) => ({ ...item, key: index + 1 }))
      );
    } else {
      form.setFieldsValue({ ...default_form_data, experimentCategory: value });
      setMaterialsBodyData([]);
      setProdEquipBodyData([]);
      setTestEquipBodyData([]);
      setResultsBodyData([]);
    }
  };
  useEffect(() => {
    if (data) {
      const { experimentCategory } = form.getFieldsValue();
      chgCategory(experimentCategory || "试样");
    }
  }, [data]);
  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
    if (activeKey) {
      search_report();
    }
  }, [activeKey]);
  return (
    <Spin spinning={load}>
      <Form form={form} default_form_data={default_form_data} {...ComputeFormCol(2)}>
        <Flex vertical gap={16}>
          <Form.Item
            label="变更单号"
            name="number"
            rules={[{ required: true, message: "请选择变更单号" }]}
          >
            <Input placeholder="请选择变更单号" disabled />
          </Form.Item>
          <Form.Item label="实验类型" name="experimentCategory">
            <Radio.Group
              options={["试样", "小批量", "批量"]}
              onChange={(e) => chgCategory(e.target.value)}
            />
          </Form.Item>
            <Form.Item label="测试编号" name="test_number">
            <Input placeholder="自动生成" disabled />
          </Form.Item>
          <Form.Item label="版本" name="edition">
            <Input placeholder="请输入版本" />
          </Form.Item>
          <Form.Item label="实验名称" name="experimentName">
            <Input placeholder="请输入实验名称" />
          </Form.Item>
          <Form.Item label="测试单号" name="testOrderNumber">
            <Input placeholder="请输入测试单号" />
          </Form.Item>
          <Form.Item label="关键词" name="keyWord">
            <Input placeholder="请输入关键词" />
          </Form.Item>
          <Form.Item label="变更负责人" name="charge_charge_person">
            <Input placeholder="请输入变更负责人" />
          </Form.Item>
          <Form.Item label="参与实验人员">
            <Form.List name="participants">
              {(fields, { add, remove }) => (
                <Flex vertical gap={8}>
                  {fields.map(({ key, name, ...restField }) => (
                    <Flex gap={8} key={key} align="center">
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[{ required: true, message: "请输入姓名" }]}
                      >
                        <Input placeholder="姓名" style={{ width: 120 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "position"]}
                        rules={[{ required: true, message: "请输入岗位" }]}
                      >
                        <Input placeholder="岗位" style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "responsibility"]}
                        rules={[{ required: true, message: "请输入职责" }]}
                      >
                        <Input placeholder="职责" style={{ width: 200 }} />
                      </Form.Item>
                      <Button danger onClick={() => remove(name)}>
                        删除
                      </Button>
                    </Flex>
                  ))}
                  <Button type="dashed" onClick={() => add()}>
                    添加参与人员
                  </Button>
                </Flex>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="实验日期" name="experimentalDate">
            <DatePicker
              placeholder="选择日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            />
          </Form.Item>
          <Form.Item label="报告日期" name="reportDate">
            <DatePicker
              placeholder="选择日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            />
          </Form.Item>
          <Form.Item label="变更负责人编制" name="compilation">
            <Input />
          </Form.Item>
          <Form.Item label="编制日期" name="compilationDate">
            <DatePicker
              placeholder="选择日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            />
          </Form.Item>
          <Form.Item label="研发主管审核" name="review">
            <Input />
          </Form.Item>
          <Form.Item label="审核日期" name="reviewDate">
            <DatePicker
              placeholder="选择日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            />
          </Form.Item>
          <Form.Item label="技术负责人批准" name="approval">
            <Input />
          </Form.Item>
          <Form.Item label="批准日期" name="approvalDate">
            <DatePicker
              placeholder="选择日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            />
          </Form.Item>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="序号"
            bordered
            pagination={false}
          />

          <Title level={2}>测试报告正文</Title>

          <Form.Item label="测试单号" name="testOrderNumber">
            <Input />
          </Form.Item>
          <Form.Item label="实验名称" name="experimentName">
            <Input />
          </Form.Item>
          <Form.Item label="实验目的" name="experimentPurpose">
            <Input />
          </Form.Item>

          <EditTable
            title={() => "实验用重要原辅材料"}
            add_name="添加原辅材料"
            columns_text={materials_headData}
            dataSource={materials_bodyData}
            setTbData={setMaterialsBodyData}
          />

          <EditTable
            title={() => "实验用生产设备"}
            add_name="添加生产设备"
            columns_text={prod_equip_headData}
            dataSource={prod_equip_bodyData}
            setTbData={setProdEquipBodyData}
          />

          <EditTable
            title={() => "实验用检测设备"}
            add_name="添加检测设备"
            columns_text={test_equip_headData}
            dataSource={test_equip_bodyData}
            setTbData={setTestEquipBodyData}
          />

          <Form.Item label="实验计划" name="experimentalPlan">
            <Input.TextArea placeholder="请输入实验计划" />
          </Form.Item>
          <Form.Item label="数据分析" name="dataAnalysis">
            <Input.TextArea placeholder="请输入数据分析" />
          </Form.Item>

          <EditTable
            title={() => "实验结果"}
            add_name="添加结果"
            columns_text={results_headData}
            dataSource={results_bodyData}
            setTbData={setResultsBodyData}
          />

          <Form.Item label="实验结论" name="experimentalConclusion">
            <Input.TextArea placeholder="请输入实验结论" />
          </Form.Item>
          <Form.Item label="问题及建议" name="questionsAndSuggestions">
            <Input.TextArea placeholder="请输入问题及建议" />
          </Form.Item>
          <Form.Item label="文件上传">
            <Flex vertical gap={10} style={{ width: 300 }}>
              <FileUpload fileList={fileList} setFileList={setFileList} />
            </Flex>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
            <Space size={20}>
              <Button type="primary" onClick={search_report}>
                查询
              </Button>
              {/* <Button >修改</Button> */}
              <Button onClick={put_report}>保存</Button>
              <Button onClick={post_report}>提交</Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Spin>
  );
};

export default BianGengReport;
