import { Col, Form, Input, Modal, Row } from "antd";
import { ComputeFormCol } from "../../../../utils/obj";
import { useEffect, useRef } from "react";
import { getDeviceDetails } from "../../../../apis/mform_api";

export const RealTimeProcessModal = ({ open, data, onCancel }) => {
  const timer = useRef(-1);
  const { 设备号 = "#11" } = data;
  const [form] = Form.useForm();

  const reqeustData = () => {
    getDeviceDetails(
      { device: 设备号 },
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          form.setFieldsValue(data);
        }
      },
      () => {}
    );
  };

  useEffect(() => {
    if (open) {
      reqeustData();
      timer.current = setInterval(() => {
        reqeustData();
      }, 1000);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [open]);

  return (
    <Modal
      title={`熔融机${设备号} - 实时加工情况`}
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      destroyOnHidden={true}
      width={800}
    >
      <Form
        form={form}
        {...ComputeFormCol(10)}
        style={{ marginTop: 10, padding: 10 }}
      >
        <Row gutter={[16, 20]}>
          <Col span={8}>
            <Form.Item name="图号" label="图号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12} offset={4}>
            <Form.Item name="产品加工记录编号" label="产品加工记录编号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="引弧时间" label="引弧时间">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12} offset={4}>
            <Form.Item name="模具真空压力" label="模具真空压力">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="A相电流" label="A相电流">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="A相电流偏差" label="偏差">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="A相电压" label="A相电压">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="B相电流" label="B相电流">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="B相电流偏差" label="偏差">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="B相电压" label="B相电压">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="C相电流" label="C相电流">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="C相电流偏差" label="偏差">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="C相电压" label="C相电压">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="功率" label="功率">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12} offset={4}>
            <Form.Item name="设定输出电流" label="设定输出电流">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="模具进水温度" label="模具进水温度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="模具出水温度" label="模具出水温度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="模具真空压力" label="模具真空压力">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="电极开闭位置" label="电极开闭位置">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="电极开闭速度" label="电极开闭速度">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
