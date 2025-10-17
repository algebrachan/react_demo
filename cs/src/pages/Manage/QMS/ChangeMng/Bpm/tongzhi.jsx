import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  message,
  DatePicker,
  Card,
  Spin,
} from "antd";
import { Flex } from "antd";
import { ComputeFormCol, CommonEditTable } from "@/utils/obj";
import { selectList2Option } from "@/utils/string";
import { postChangeNotification } from "@/apis/qms_router";
import dayjs from "dayjs";
import { DeparmentList } from "./common";

const TongZhi = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [load, setLoad] = useState(false);
  const changeCategory = Form.useWatch("change_category", form);
  const proposeUnit = Form.useWatch("propose_unit", form);
  const changeImportRequirements = Form.useWatch(
    "change_import_requirements",
    form
  );
  const default_form_data = {
    change_category: "",
    start_change_time: "",
    end_change_time: "",
    change_order_number: "",
    propose_unit: "",
    change_number: "",
    project_phase: "",
    involving_customer_names: "",
    product_name_specification: "",
    change_import_requirements: "",
    switch_date: "",
    distribution_department: [],
    compilation_date: "",
  };
  const columnsItems = [
    { label: "变更前内容", name: "pre_change_content", type: "input" },
    { label: "变更后内容", name: "change_content", type: "input" },
  ];
  const postChange = async () => {
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
    let param = {
      ...default_form_data,
      ...values,
      change_content: tb_data,
      number: id,
    };
    setLoad(true);
    postChangeNotification(
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
  useEffect(() => {
    if (changeCategory !== "临时性")
      form.setFieldsValue({ start_change_time: "", end_change_time: "" });
  }, [changeCategory]);
  useEffect(() => {
    if (proposeUnit !== "顾客") form.setFieldsValue({ change_number: "" });
  }, [proposeUnit]);
  useEffect(() => {
    if (changeImportRequirements !== "按日期切换")
      form.setFieldsValue({ switch_date: "" });
  }, [changeImportRequirements]);
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue(review_data);
      setTbData(review_data["review_data"] || []);
    } else {
      form.resetFields();
      setTbData([]);
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">变更通知</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            {...ComputeFormCol(4)}
            initialValues={default_form_data}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item label="变更类别" name="change_category">
                <Radio.Group
                  options={selectList2Option(["永久性", "临时性"])}
                />
              </Form.Item>
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD HH:mm:ss")
                }
                label="变更开始时间"
                name="start_change_time"
              >
                <DatePicker showTime disabled={changeCategory !== "临时性"} />
              </Form.Item>
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD HH:mm:ss")
                }
                label="变更结束时间"
                name="end_change_time"
              >
                <DatePicker showTime disabled={changeCategory !== "临时性"} />
              </Form.Item>
              <Form.Item label="变更单号" name="change_order_number">
                <Input />
              </Form.Item>
              <Form.Item label="提出单位" name="propose_unit">
                <Radio.Group
                  options={selectList2Option(["内部", "二级供应商", "顾客"])}
                />
              </Form.Item>
              <Form.Item label="更改号" name="change_number">
                <Input disabled={proposeUnit !== "顾客"} />
              </Form.Item>
              <Form.Item label="项目阶段" name="project_phase">
                <Input />
              </Form.Item>
              <Form.Item label="涉及顾客名称" name="involving_customer_names">
                <Input />
              </Form.Item>
              <Form.Item
                label="产品名称/规格"
                name="product_name_specification"
              >
                <Input />
              </Form.Item>
              <Form.Item label="变更导入要求" name="change_import_requirements">
                <Radio.Group
                  options={selectList2Option([
                    "立即导入",
                    "自然切换",
                    "按日期切换",
                    "其他",
                  ])}
                />
              </Form.Item>
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD")
                }
                label="切换日期"
                name="switch_date"
              >
                <DatePicker
                  disabled={changeImportRequirements !== "按日期切换"}
                />
              </Form.Item>
              <Form.Item label="分发部门" name="distribution_department">
                <Checkbox.Group options={selectList2Option(DeparmentList)} />
              </Form.Item>
              <Form.Item
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) =>
                  value && dayjs(value).format("YYYY-MM-DD")
                }
                label="编制日期"
                name="compilation_date"
              >
                <DatePicker />
              </Form.Item>
              <CommonEditTable
                name="变更内容"
                dataSource={tb_data}
                setTbData={setTbData}
                columnsItems={columnsItems}
              />
              <Flex justify="end">
                <Button type="primary" onClick={postChange}>
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
export default TongZhi;
