import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Spin,
  Modal,
  message,
  Row,
  Col,
  Card,
  DatePicker,
  Button,
  AutoComplete,
} from "antd";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option, timeFormat } from "../../../../../utils/string";
import { qmsPutChanges } from "@/apis/qms_router";
import { EditTable } from "../Common";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
const { TextArea } = Input;

const ShenQing = ({
  id = "",
  review_data = null,
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const default_form_data = {
    theme: "",
    changeType: [],
    level: "",
    changeCategory: "",
    changeTimeRange: [],
    proposeUnit: "",
    changeImportRequirements: [],
    importTime: "",
    reasonForChange: "",
    descriptionOfChangeContentsBefore: "",
    descriptionOfChangeContentsAfter: "",
    applicantDate: "",
    approvalByDepartmentHead: "",
  };
  const [tb_data, setTbData] = useState([]);
  const { user_list } = useSelector((state) => state.mng.qms);
  const [load, setLoad] = useState(false);
  const onSubmit = async () => {
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
    setLoad(true);
    qmsPutChanges(
      {
        ...default_form_data,
        ...values,
        bodyData: tb_data,
        number: id,
      },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("审批成功");
          reFresh();
        }
      },
      () => {
        setLoad(false);
      }
    );
  };
  useEffect(() => {
    if (review_data) {
      const { bodyData = [] } = review_data;
      setTbData(bodyData.map((item, _) => ({ ...item, key: _ })));
      form.setFieldsValue(review_data);
    } else {
      form.resetFields();
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">变更申请</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            {...ComputeFormCol(4)}
            initialValues={default_form_data}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item
                label="变更主题"
                name="theme"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="变更类型"
                name="changeType"
                rules={[{ required: true }]}
              >
                <Checkbox.Group
                  options={selectList2Option([
                    "原材料",
                    "供应商",
                    "生产场所",
                    "工艺",
                    "生产设备、工具",
                    "检测设备",
                    "检测方法",
                    "包装",
                    "运输方式",
                    "其他",
                  ])}
                />
              </Form.Item>
              <Form.Item
                label="变更类别"
                name="changeCategory"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={selectList2Option(["永久性", "临时性"])}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.changeCategory !== current.changeCategory
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("changeCategory") === "临时性" && (
                    <Form.Item
                      label="变更时间区间"
                      name="changeTimeRange"
                      rules={[{ required: true }]}
                      getValueProps={(value) => {
                        return {
                          value: value && value.map((e) => dayjs(e)),
                        };
                      }}
                      normalize={(value) =>
                        value && value.map((e) => dayjs(e).format(timeFormat))
                      }
                    >
                      <DatePicker.RangePicker
                        showTime
                        format={timeFormat}
                        style={{ width: 330 }}
                        placeholder={["开始时间", "结束时间"]}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item
                label="变更级别"
                name="level"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={selectList2Option(["A", "B", "C", "D", "E"])}
                />
              </Form.Item>
              <Form.Item
                label="提出单位"
                name="proposeUnit"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={selectList2Option(["内部", "二级供应商", "顾客"])}
                />
              </Form.Item>
              <Form.Item
                label="变更导入要求"
                name="changeImportRequirements"
                rules={[{ required: true }]}
              >
                <Checkbox.Group
                  options={selectList2Option([
                    "立即导入",
                    "自然切换",
                    "按日期切换",
                    "其他",
                  ])}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.changeImportRequirements !==
                  current.changeImportRequirements
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("changeImportRequirements").includes(
                    "按日期切换"
                  ) && (
                    <Form.Item
                      label="导入时间"
                      name="importTime"
                      rules={[{ required: true }]}
                      getValueProps={(value) => {
                        return {
                          value: value && dayjs(value),
                        };
                      }}
                      normalize={(value) =>
                        value && dayjs(value).format(timeFormat)
                      }
                    >
                      <DatePicker
                        showTime
                        format={timeFormat}
                        style={{ width: 330 }}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item
                label="变更原因"
                name="reasonForChange"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                label="变更前内容描述"
                name="descriptionOfChangeContentsBefore"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                label="变更后内容描述"
                name="descriptionOfChangeContentsAfter"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                label="申请人"
                name="applicantDate"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <EditTable
                add_name="添加产品"
                dataSource={tb_data}
                columns_text={["产品名称", "产品规格", "顾客", "备注"]}
                setTbData={setTbData}
              />
              <Form.Item
                label="部门主管批准"
                name="approvalByDepartmentHead"
                rules={[{ required: true }]}
              >
                <AutoComplete options={selectList2Option(user_list)} />
              </Form.Item>
              <Flex justify="end">
                <Button type="primary" onClick={onSubmit}>
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
export default ShenQing;
