import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Row } from "antd";
import { Flex } from "antd";
import { Form } from "antd";
import { Card } from "antd";
import { Radio } from "antd";
import { Input } from "antd";
import { ComputeFormCol, ImageUpload, base64ToBlob } from "@/utils/obj";
import { qmsStep2 } from "@/apis/qms_router";
import { Spin } from "antd";
import { message } from "antd";

//不合格隔离
function NoIsolation({ order_record = {}, review_data = {} }) {
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [fileList, setFileList] = useState([]);
  const default_form_data = {
    review_id: "",
    location: "",
    description: "",
  };
  const desc_items = [
    "产品名称",
    "规格",
    "物料编号",
    "批次号",
    "批次总数量",
    "不合格数量",
    "不合格占比",
    "检验员",
    "检验日期",
  ].map((item, _) => ({
    key: _ + 1,
    label: item,
    children: order_record[item] || "",
  }));
  const submit = async () => {
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
    formData.append("request_data", JSON.stringify(values));
    fileList.forEach((item) => {
      if (item.uid.startsWith("-")) {
        formData.append(
          "images",
          new File([base64ToBlob(item.url)], item.name)
        );
      } else {
        formData.append("images", item.originFileObj);
      }
    });
    setLoad(true);
    qmsStep2(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
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
    if (order_record["编号"]) {
      const { non_conformance_description = {}, images = [] } = review_data;
      const initialFiles = images.map((base64, index) => ({
        uid: `-${index}`,
        name: `image_${index}.png`,
        url: base64,
      }));
      setFileList(initialFiles);
      form.setFieldsValue({
        ...non_conformance_description,
        review_id: order_record["编号"],
      });
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [order_record, review_data]);
  return (
    <Flex vertical gap={16}>
      <Descriptions title="基础信息" bordered items={desc_items} />
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={default_form_data}
            {...ComputeFormCol(3)}
          >
            <Row gutter={[10, 10]}>
              <Col span={8}>
                <Form.Item
                  label="编号"
                  name="review_id"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请选择编号" disabled />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label="不合格品发生地"
                  name="location"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={["来料", "生产工序", "出货", "仓库", "其他"]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="现象描述"
                  name="description"
                  rules={[{ required: true }]}
                  {...ComputeFormCol(1)}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{ background: "rgb(250, 250, 250)" }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="附件上传" {...ComputeFormCol(1)}>
                  <ImageUpload fileList={fileList} setFileList={setFileList} />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="end" style={{ marginTop: 10 }}>
              <Button type="primary" onClick={submit}>
                提交
              </Button>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
}

export default NoIsolation;
