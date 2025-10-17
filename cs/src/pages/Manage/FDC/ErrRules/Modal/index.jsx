import React, { useEffect } from "react";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
} from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { InputNumber } from "antd";
import { useState } from "react";
import {
  createAbnormalRule,
  getSearchPara,
  updateAbnormalRule,
} from "../../../../../apis/fdc_api";
import { message } from "antd";

export const RuleModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
  query_opt = {},
}) => {
  const default_form_data = {
    工厂: "",
    车间: "",
    工序: "",
    设备: "",
    point_position_info_id: "",
    related_field_id: null,
    基准类型: "固定",
    限制类型: "百分比",
    规则名: "",
    上限: 0,
    基准: 0,
    下限: 0,
    报警等级: "一般",
    状态: 1,
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [param_opt, setParamOpt] = useState({});
  const [param_load, setParamLoad] = useState(false);
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const initParam = (车间, 工序) => {
    if (车间 && 工序) {
      setParamLoad(true);
      getSearchPara(
        { 车间, 工序 },
        (res) => {
          setParamLoad(false);
          const { code, data } = res.data;
          if (code === 200 && data) {
            const { dev_list = [] } = data;
            let temp_list = dev_list.map((e) => e.设备);
            setDevList(temp_list);
            setParamOpt(data);
          } else {
            setDevList([]);
            setParamOpt({});
          }
        },
        () => {
          setParamLoad(false);
          setDevList([]);
          setParamOpt({});
        }
      );
    }
  };
  const handleOk = async () => {
    let val = await form.validateFields();
    setLoad(true);
    if (data["name"] === "新增") {
      createAbnormalRule(
        val,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            setLoad(false);
            message.success("添加成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setLoad(false);
          message.error("网络错误");
        }
      );
    } else {
      const { id, 车间 } = data["record"];
      updateAbnormalRule(
        { id, 车间,...val },
        (res) => {
          setLoad(false);
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
          setLoad(false);
          message.error("网络错误");
        }
      );
    }
  };
  useEffect(() => {
    if (data["name"] === "编辑" && Object.keys(param_opt).length > 0) {
      let dev_name = form.getFieldValue("设备");
      const { dev_list = [] } = param_opt;
      let dev = dev_list.find((e) => e.设备 === dev_name);
      const { 参数 = [], ids = [] } = dev;
      let param_list = 参数.map((e, _) => ({
        label: e,
        value: ids[_],
      }));
      setParamList(param_list);
    }
  }, [param_opt]);
  useEffect(() => {
    if (open) {
      const { name = "新增", record = {} } = data;
      setDevList([]);
      setParamList([]);
      if (name === "新增") {
        form.resetFields();
      } else {
        console.log(record);
        form.setFieldsValue(record);
        const { 车间, 工序 } = record;
        initParam(车间, 工序);
        // // 把参数列表添加进去
        // const { 工序 = "", 设备 = "" } = record;
        // let temp = query_opt["工序"].find((e) => e.name === 工序);
        // const { dev_list = [] } = temp;
        // let temp1 = dev_list.find((e) => e.设备 === 设备);
        // const { 参数 = [], ids = [] } = temp1;
        // let param_list = 参数.map((e, _) => ({
        //   label: e,
        //   value: ids[_],
        // }));
        // setParamList(param_list);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`${data["name"]}异常规则`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={600}
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
              <Form.Item name="工厂" label="工厂" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(query_opt["工厂"])}
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="车间" label="车间" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(query_opt["车间"])}
                  disabled={data["name"] === "编辑"}
                  onChange={(val) => {
                    form.setFieldsValue({
                      工序: query_opt["工序"][val],
                      设备: "",
                      point_position_info_id: "",
                      related_field_id: null,
                    });
                    initParam(val, query_opt["工序"][val]);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="工序" label="工序" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option([])}
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="设备" label="设备" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(dev_list)}
                  onChange={(val) => {
                    form.setFieldsValue({
                      point_position_info_id: "",
                      related_field_id: null,
                    });
                    const { dev_list = [] } = param_opt;
                    let dev = dev_list.find((e) => e.设备 === val);
                    const { 参数 = [], ids = [] } = dev;
                    let param_list = 参数.map((e, _) => ({
                      label: e,
                      value: ids[_],
                    }));
                    setParamList(param_list);
                  }}
                  disabled={data["name"] === "编辑"}
                  loading={param_load}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="point_position_info_id"
                label="参数"
                rules={[{ required: true }]}
              >
                <Select options={param_list} loading={param_load} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="related_field_id" label="相关点位">
                <Select options={param_list} allowClear loading={param_load} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="基准类型" label="基准类型">
                <Radio.Group options={selectList2Option(["固定", "非固定"])} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="限制类型" label="限制类型">
                <Radio.Group
                  options={selectList2Option(["百分比", "绝对值", "无"])}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="规则名"
                label="规则名"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            {["上限", "基准", "下限"].map((item) => (
              <Col span={12} key={item}>
                <Form.Item name={item} label={item}>
                  <InputNumber placeholder="请输入" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
            <Col span={12}>
              <Form.Item name="报警等级" label="报警等级">
                <Select options={selectList2Option(query_opt["报警等级"])} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="状态"
                label="状态"
                normalize={(value) => (value ? 1 : 0)}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
