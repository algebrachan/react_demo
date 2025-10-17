import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  DatePicker,
  Button,
  Typography,
  Card,
  message,
  Spin,
  Flex,
} from "antd";
import { ComputeFormCol } from "@/utils/obj";
import {
  qmsPutReport,
  qmsPostReport,
  qmsSubmitReport,
} from "@/apis/qms_router";
import { CommonEditTable, FileUpload } from "@/utils/obj";
import dayjs from "dayjs";
import { dateFormat } from "@/utils/string";
import { downloadMeasuringTools } from "@/apis/nc_review_router";
import { base64ToBlob } from "../../../../../utils/obj";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BaoGao = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [test_type, setTestType] = useState("");
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const default_form_data = {
    test_number: "", // 测试编号
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
    线下报告: false,
  };
  // 实验用重要原辅料
  const materials_columnsItems = [
    { name: "材料编号", type: "input" },
    { name: "材料名称", type: "input" },
    { name: "规格", type: "input" },
    { name: "生产批号", type: "input" },
    { name: "供应商", type: "input" },
  ];
  const [materials_bodyData, setMaterialsBodyData] = useState([]);
  // 实验用生产设备
  const prod_equip_columnsItems = [
    { name: "设备编号", type: "input" },
    { name: "设备名称", type: "input" },
    { name: "型号", type: "input" },
    { name: "下次维保日期", type: "time", width: 140 },
    { name: "状态", type: "input" },
  ];
  const [prod_equip_bodyData, setProdEquipBodyData] = useState([]);
  // 实验用检测设备
  const [test_equip_bodyData, setTestEquipBodyData] = useState([]);
  const data_analysis_columnsItems = [
    { name: "说明", type: "text_area", width: 300 },
    { name: "附件", type: "image" },
  ];
  const [data_analysis_bodyData, setDataAnalysisBodyData] = useState([]);

  // 实验结果
  const results_columnsItems = [
    { name: "验证项目", type: "input" },
    { name: "验证方法标准", type: "input" },
    { name: "判定标准", type: "input" },
    { name: "验证结果", type: "input" },
    { name: "结果判定", type: "input" },
  ];
  const [results_bodyData, setResultsBodyData] = useState([]);

  const submit1 = async () => {
    const values = form.getFieldsValue();
    const param = {
      number: id,
      experimentCategory: test_type,
      typeof: 1,
      test_number: values["test_number"],
      experimentName: values["experimentName"],
      testOrderNumber: values["testOrderNumber"],
      keyWord: values["keyWord"],
      charge_charge_person: values["charge_charge_person"],
      participants: values["participants"],
      experimentalDate: values["experimentalDate"],
      reportDate: values["reportDate"],
      compilation: values["compilation"],
      compilationDate: dayjs().format(dateFormat),
    };
    setLoad(true);
    qmsSubmitReport(
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
  const submit2 = (status = "同意") => {
    const values = form.getFieldsValue();
    const param = {
      experimentCategory: test_type,
      number: id,
      typeof: 2,
      status,
      review: values["review"],
      reviewDate: dayjs().format(dateFormat),
    };
    setLoad(true);
    qmsSubmitReport(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("操作成功");
          reFresh();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("");
      }
    );
  };
  const submit3 = (status = "同意") => {
    const values = form.getFieldsValue();
    const param = {
      experimentCategory: test_type,
      number: id,
      typeof: 3,
      status,
      approval: values["approval"],
      approvalDate: dayjs().format(dateFormat),
    };
    setLoad(true);
    qmsSubmitReport(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("操作成功");
          reFresh();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("");
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
    const formData = new FormData();
    let temp_data_list = [];
    data_analysis_bodyData.forEach(({ 附件, ...rest }) => {
      if (附件 && 附件.length > 0) {
        if (附件[0].uid.startsWith("-")) {
          formData.append(
            "images",
            new File([base64ToBlob(附件[0].url)], 附件[0].name, {
              type: 附件[0].mimetype || "image/png",
              lastModified: new Date().getTime(),
            })
          );
        } else {
          formData.append("images", 附件[0].originFileObj);
        }
      } else {
        formData.append("images", new Blob([], { type: "text/plain" }));
      }
      temp_data_list.push({ ...rest });
    });
    const param = {
      ...default_form_data,
      ...values,
      relatedAttachments: [],
      tableEditFlag: true,
      materials_bodyData,
      prod_equip_bodyData,
      test_equip_bodyData,
      results_bodyData,
      data_analysis_bodyData: temp_data_list,
      experimentCategory: test_type,
      number: id,
    };
    formData.append("changes_report", JSON.stringify(param));
    if (fileList.length > 0) {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    setLoad(true);
    qmsPutReport(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("保存成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };

  const post_report = async () => {
    const param = {
      ...data,
      number: id,
    };
    setLoad(true);
    qmsPostReport(
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
    setFileList([]);
    if (obj[value]) {
      form.setFieldsValue({
        ...default_form_data,
        ...obj[value],
      });
      const {
        materials_bodyData = [],
        prod_equip_bodyData = [],
        test_equip_bodyData = [],
        results_bodyData = [],
        data_analysis_bodyData = [],
      } = obj[value];
      let new_tb = data_analysis_bodyData.map((item, index) => {
        let { image, ...rest } = item;
        let picture = image
          ? [
              {
                uid: `-${index}`,
                name: `image_${index}.png`,
                url: image,
              },
            ]
          : [];
        return { 附件: picture, ...rest };
      });
      setDataAnalysisBodyData(new_tb);
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
      form.setFieldsValue({ ...default_form_data });
      setMaterialsBodyData([]);
      setProdEquipBodyData([]);
      setTestEquipBodyData([]);
      setResultsBodyData([]);
    }
  };
  useEffect(() => {
    chgCategory(test_type);
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
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">结案报告</div>
      <Card>
        <Spin spinning={load}>
          <Flex gap={20}>
            <div>实验类型：</div>
            <Radio.Group
              value={test_type}
              options={["试样", "小批量", "批量"]}
              onChange={(e) => setTestType(e.target.value)}
            />
          </Flex>
          <Form
            form={form}
            default_form_data={default_form_data}
            {...ComputeFormCol(3)}
            disabled={
              disabled || test_type !== review_data["experimentCategory"]
            }
            style={{ marginTop: 20 }}
          >
            <Flex vertical gap={16}>
              <Form.Item label="测试编号" name="test_number">
                <Input placeholder="自动生成" disabled />
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
              <Form.Item
                label="实验日期"
                name="experimentalDate"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker placeholder="选择日期" />
              </Form.Item>
              <Form.Item
                label="报告日期"
                name="reportDate"
                getValueProps={(value) => {
                  return {
                    value: value && dayjs(value),
                  };
                }}
                normalize={(value) => value && dayjs(value).format(dateFormat)}
              >
                <DatePicker placeholder="选择日期" />
              </Form.Item>
              <Form.Item label="变更负责人编制">
                <Flex gap={20}>
                  <Form.Item name="compilation">
                    <Input style={{ width: 200 }} placeholder="请签字" />
                  </Form.Item>
                  <Button type="primary" onClick={submit1}>
                    提交
                  </Button>
                </Flex>
              </Form.Item>
              <Form.Item
                label="编制日期"
                name="compilationDate"
                getValueProps={(value) => {
                  return {
                    value: value && dayjs(value),
                  };
                }}
                normalize={(value) => value && dayjs(value).format(dateFormat)}
              >
                <DatePicker placeholder="提交时生成" disabled />
              </Form.Item>
              <Form.Item label="研发主管审核">
                <Flex gap={20}>
                  <Form.Item name="review">
                    <Input style={{ width: 200 }} placeholder="请签字" />
                  </Form.Item>
                  <Button type="primary" onClick={() => submit2("同意")}>
                    同意
                  </Button>
                  <Button type="primary" danger onClick={() => submit2("驳回")}>
                    驳回
                  </Button>
                </Flex>
              </Form.Item>
              <Form.Item
                label="审核日期"
                name="reviewDate"
                getValueProps={(value) => {
                  return {
                    value: value && dayjs(value),
                  };
                }}
                normalize={(value) => value && dayjs(value).format(dateFormat)}
              >
                <DatePicker placeholder="提交时生成" disabled />
              </Form.Item>
              <Form.Item label="技术负责人批准">
                <Flex gap={20}>
                  <Form.Item name="approval">
                    <Input style={{ width: 200 }} placeholder="请签字" />
                  </Form.Item>
                  <Button type="primary" onClick={() => submit3("同意")}>
                    同意
                  </Button>
                  <Button type="primary" danger onClick={() => submit3("驳回")}>
                    驳回
                  </Button>
                </Flex>
              </Form.Item>
              <Form.Item
                label="批准日期"
                name="approvalDate"
                getValueProps={(value) => {
                  return {
                    value: value && dayjs(value),
                  };
                }}
                normalize={(value) => value && dayjs(value).format(dateFormat)}
              >
                <DatePicker placeholder="提交时生成" disabled />
              </Form.Item>
              <Title level={4}>测试报告正文</Title>
              <Form.Item label="测试单号" name="testOrderNumber">
                <Input />
              </Form.Item>
              <Form.Item label="实验名称" name="experimentName">
                <Input />
              </Form.Item>
              <Form.Item label="实验目的" name="experimentPurpose">
                <Input />
              </Form.Item>
              <CommonEditTable
                dataSource={materials_bodyData}
                setTbData={setMaterialsBodyData}
                columnsItems={materials_columnsItems}
                name="实验用重要原辅材料"
              />
              <CommonEditTable
                dataSource={prod_equip_bodyData}
                setTbData={setProdEquipBodyData}
                columnsItems={prod_equip_columnsItems}
                name="实验用生产设备"
              />
              <CommonEditTable
                dataSource={test_equip_bodyData}
                setTbData={setTestEquipBodyData}
                columnsItems={prod_equip_columnsItems}
                name="实验用检测设备"
              />
              <Form.Item label="实验计划" name="experimentalPlan">
                <Input.TextArea placeholder="请输入实验计划" />
              </Form.Item>
              <Form.Item label="数据分析">
                <CommonEditTable
                  dataSource={data_analysis_bodyData}
                  setTbData={setDataAnalysisBodyData}
                  columnsItems={data_analysis_columnsItems}
                />
              </Form.Item>
              <CommonEditTable
                dataSource={results_bodyData}
                setTbData={setResultsBodyData}
                columnsItems={results_columnsItems}
                name="实验结果"
              />
              <Form.Item label="实验结论" name="experimentalConclusion">
                <Input.TextArea placeholder="请输入实验结论" />
              </Form.Item>
              <Form.Item label="问题及建议" name="questionsAndSuggestions">
                <Input.TextArea placeholder="请输入问题及建议" />
              </Form.Item>
              <Form.Item label="线下报告" name="线下报告">
                <Radio.Group
                  options={[
                    { value: false, label: "否" },
                    { value: true, label: "是" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="文件上传">
                <Flex vertical gap={10} style={{ width: 300 }}>
                  <FileUpload
                    fileList={fileList}
                    setFileList={setFileList}
                    accept=".pdf"
                  />
                  <a
                    onClick={() => preview(data?.[test_type]?.file_path ?? "")}
                  >
                    点击查看报告
                  </a>
                </Flex>
              </Form.Item>
              <Flex justify="end" gap={20}>
                <Button type="primary" onClick={put_report}>
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

export default BaoGao;
