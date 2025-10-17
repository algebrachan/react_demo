import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  DatePicker,
  Button,
  Card,
  Flex,
  Typography,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import { ComputeFormCol } from "@/utils/obj";
import {
  qmsPostProcessRequirements,
  qmsPutProcessRequirements,
} from "@/apis/qms_router";
import { dateFormat, timeFormat } from "@/utils/string";
import { CommonEditTable } from "@/utils/obj";
import { downloadMeasuringTools } from "../../../../../apis/nc_review_router";
import { FileUpload } from "../../../../../utils/obj";
const { Text } = Typography;

const CeShi = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const default_form_data = {
    test_number: "", // 测试编号
    edition: "",
    plannedDate: "",
    testOrderNumber: "",
    experimentName: "",
    applicationDepartment: "",
    applicant: "",
    applicationDate: "",
    productName: "",
    specification: "",
    customers: "",
    experimentPurpose: "",
    requiredMaterials: "",
    requiredTools: "",
  };
  const [form] = Form.useForm();
  const [test_type, setTestType] = useState("");
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({});
  const [fileList, setFileList] = useState([]);

  const columnsItems = [
    { name: "验证项目", type: "input" },
    { name: "验证方法标准", type: "input" },
    { name: "判定标准", type: "input" },
  ];
  const [verificationBodyData, setVerificationBodyData] = useState([]);

  const save = async () => {
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
    const formData = new FormData();
    const param = {
      ...default_form_data,
      ...values,
      verification_bodyData: verificationBodyData,
      experimentCategory: test_type,
      number: id,
    };
    formData.append("testing_requirements", JSON.stringify(param));
    if (fileList.length > 0) {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    setLoad(true);
    qmsPutProcessRequirements(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };
  const postProcessRequirements = async () => {
    const param = {
      ...data,
      number: id,
    };
    setLoad(true);
    qmsPostProcessRequirements(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        } 
      },
      () => {
        setLoad(false);
      }
    );
  };

  const preview = (path) => {
    if (!path) {
      return message.warning("暂无附件");
    }
    downloadMeasuringTools(
      { path },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          const { url } = data;
          window.open(url, "_blank");
        }
      },
      () => {}
    );
  };
  const chgCategory = (value, obj = data) => {
    if (obj[value]) {
      const { verification_bodyData = [] } = obj[value];
      form.setFieldsValue({
        ...default_form_data,
        ...obj[value],
      });
      setVerificationBodyData(
        verification_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
    } else {
      form.setFieldsValue(default_form_data);
      setVerificationBodyData([]);
    }
  };
  useEffect(() => {
    if (test_type) {
      chgCategory(test_type);
    }
  }, [test_type]);

  useEffect(() => {
    if (review_data) {
      setData(review_data);
      const { experimentCategory = "试样" } = review_data;
      setTestType(experimentCategory);
      chgCategory(experimentCategory, review_data);
    } else {
      setData({ 小批量: {}, 批量: {}, 试样: {} });
    }
  }, [review_data]);

  useEffect(() => {}, []);

  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">测试需求单</div>
      <Card>
        <Flex gap={20}>
          <div>测试阶段：</div>
          <Radio.Group
            value={test_type}
            options={["试样", "小批量", "批量"]}
            onChange={(e) => setTestType(e.target.value)}
          />
        </Flex>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={default_form_data}
            {...ComputeFormCol(4)}
            style={{ marginTop: 20 }}
            disabled={
              disabled || test_type !== review_data["experimentCategory"]
            }
          >
            <Flex vertical gap={16}>
              <Form.Item label="测试编号" name="test_number">
                <Input placeholder="自动生成" disabled />
              </Form.Item>
              <Form.Item label="版本" name="edition">
                <Input placeholder="请输入版本" />
              </Form.Item>
              <Form.Item
                label="计划测试时间"
                name="plannedDate"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(timeFormat))
                }
              >
                <DatePicker.RangePicker showTime placeholder="选择日期" />
              </Form.Item>
              <Form.Item label="测试单号" name="testOrderNumber">
                <Input placeholder="请输入测试单号" />
              </Form.Item>
              <Form.Item label="测试名称" name="experimentName">
                <Input placeholder="请输入测试名称" />
              </Form.Item>
              <Form.Item label="申请部门" name="applicationDepartment">
                <Input placeholder="请输入部门" />
              </Form.Item>
              <Form.Item label="变更负责人" name="applicant">
                <Input placeholder="请输入实验名称" />
              </Form.Item>
              <Form.Item
                label="申请时间"
                name="applicationDate"
                getValueProps={(value) => {
                  return {
                    value: value && dayjs(value),
                  };
                }}
                normalize={(value) => value && dayjs(value).format(dateFormat)}
              >
                <DatePicker placeholder="选择日期" />
              </Form.Item>
              <Form.Item label="产品名称" name="productName">
                <Input placeholder="请输入产品名称" />
              </Form.Item>
              <Form.Item label="规格" name="specification">
                <Input placeholder="请输入规格" />
              </Form.Item>
              <Form.Item label="涉及顾客" name="customers">
                <Input placeholder="请输入涉及顾客" />
              </Form.Item>
              <h3>主要内容</h3>
              <Form.Item label="实验目的" name="experimentPurpose">
                <Input />
              </Form.Item>
              <CommonEditTable
                dataSource={verificationBodyData}
                setTbData={setVerificationBodyData}
                columnsItems={columnsItems}
                name="验证内容"
              />
              <Form.Item label="重要原辅材料要求" name="requiredMaterials">
                <Input />
              </Form.Item>
              <Form.Item label="设施、设备及工装要求" name="requiredTools">
                <Input />
              </Form.Item>
              <Form.Item label="附件上传">
                <Flex vertical gap={10} style={{ width: 300 }}>
                  <FileUpload
                    fileList={fileList}
                    setFileList={setFileList}
                    accept="*"
                  />
                  <a
                    onClick={() => preview(data?.[test_type]?.file_path ?? "")}
                  >
                    点击查看报告
                  </a>
                </Flex>
              </Form.Item>
              <Flex justify="end" gap={20}>
                <Button type="primary" onClick={save}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export default CeShi;
