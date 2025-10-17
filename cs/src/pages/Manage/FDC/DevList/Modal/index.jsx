import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { createDevice, updateDevice } from "../../../../../apis/fdc_api";
import { getSession } from "../../../../../utils/storage";

const collect_type = [
  { label: "modbus", value: 1 },
  { label: "MySQL", value: 2 },
  { label: "MongoDB", value: 3 },
  { label: "http", value: 4 },
  { label: "SqlServer", value: 5 },
];

export const EditDevModal = ({
  open = false,
  data = {},
  query_opt = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    工厂: "",
    车间: "",
    工序: "",
    设备名: "",
    ip: "",
    port: "",
    数据库: "",
    表名: "",
    状态: true,
    采集类型: 1,
    路径: "",
    查询条件: "",
    唯一标识符: "",
    批次号: "",
    时间字段: "",
    来源数据库: "",
    来源数据表: "",
    用户: "",
    密码: "",
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const handleOk = async () => {
    let val = await form.validateFields();
    const user_str = getSession("user_info");
    let user = "";
    if (user_str) {
      const { nickname = "" } = JSON.parse(user_str);
      user = nickname;
    }
    // 判断是否必填
    const { 采集类型, 路径, 查询条件, 来源数据库, 来源数据表, 用户, 密码 } =
      val;
    if (采集类型 === 4) {
      if (路径 === "" || 查询条件 === "") {
        message.warning("当采集类型为http时,必须填写路径和查询条件");
        return;
      }
    } else if (采集类型 === 1) {
    } else {
      if (
        来源数据库 === "" ||
        来源数据表 === "" ||
        用户 === "" ||
        密码 === ""
      ) {
        message.warning(
          "当采集类型为MySQL、MongoDB、SqlServer时,必须填写来源数据库,来源数据表,用户,密码"
        );
        return;
      }
    }
    setLoad(true)
    if (data["name"] === "新增") {
      val["添加人"] = user;
      createDevice(
        val,
        (res) => {
          setLoad(false)
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("添加成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setLoad(false)
          message.error("网络错误");
        }
      );
    } else {
      val["id"] = data["record"]["id"];
      val["修改人"] = user;
      console.log(data);
      updateDevice(
        val,
        (res) => {
          setLoad(false)
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("修改成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setLoad(false)
          message.error("网络错误");
        }
      );
    }
  };
  useEffect(() => {
    if (open) {
      const { name = "新增", record = {} } = data;
      if (name === "新增") {
        form.resetFields();
      } else {
        form.setFieldsValue(record);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`设备${data["name"]}`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      onOk={handleOk}
      width={570}
    >
      <Spin spinning={load}>
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(8)}
        style={{ marginTop: 20 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="工厂" name="工厂">
              <AutoComplete
                placeholder="请输入"
                options={selectList2Option(query_opt["工厂"])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="车间" name="车间">
              <AutoComplete
                placeholder="请输入"
                options={selectList2Option(query_opt["车间"])}
                onChange={(val)=>form.setFieldsValue({工序:query_opt["工序"][val]})}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工序" name="工序">
            <Input placeholder="请输入"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="设备名" label="设备名">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ip" label="ip">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="port" label="port">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="数据库" name="数据库">
              <AutoComplete
                placeholder="请输入"
                options={selectList2Option(query_opt["数据库"])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="表名" label="表名">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="采集类型" label="采集类型">
              <Select options={collect_type} />
            </Form.Item>
          </Col>
          {[
            "路径",
            "查询条件",
            "唯一标识符",
            "批次号",
            "时间字段",
            "来源数据库",
            "来源数据表",
            "用户",
          ].map((e) => (
            <Col span={12} key={e}>
              <Form.Item name={e} label={e}>
                <Input />
              </Form.Item>
            </Col>
          ))}
          <Col span={12}>
            <Form.Item name="密码" label="密码">
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="状态" label="状态">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </Spin>
    </Modal>
  );
};
