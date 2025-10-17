import { Col, Form, Input, Modal, Row } from "antd";
import { ComputeFormCol } from "../../../../utils/obj";
import { useEffect, useRef } from "react";

export const RealTimeProcessModal = ({ open, data, onCancel }) => {
  const timer = useRef(-1);
  const { 设备号 = "#11" } = data;
  const [form] = Form.useForm();

  const reqeustData = () => {
    
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
export const RealTimeProcessModal1 = ({ open, data, onCancel }) => {
  const timer = useRef(-1);
  const [form] = Form.useForm();
  const { 设备号 = "#0" } = data;
  const reqeustData = () => {
    form.setFieldsValue({
      图号: 0,
      产品加工记录编号: 0,
      研磨机转速: 0,
      研磨水压: 0,
      研磨水压流量: 0,
      研磨用水量: 0,
      研磨压力: 0,
      研磨时间: 0,
      研磨总用水量: 0,
    });
  };

  useEffect(() => {
    if (open) {
      reqeustData();
      // timer.current = setInterval(() => {
      //   reqeustData();
      // }, 1000);
    } else {
      // clearInterval(timer.current);
    }

    return () => {
      // clearInterval(timer.current);
    };
  }, [open]);

  return (
    <Modal
      title={`切割机${设备号} - 实时加工情况`}
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
          <Col span={12}>
            <Form.Item name="图号" label="图号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="产品加工记录编号" label="产品加工记录编号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨机转速" label="研磨机转速">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨水压" label="研磨水压">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨水压流量" label="研磨水压流量">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨用水量" label="研磨用水量">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨压力" label="研磨压力">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨时间" label="研磨时间">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="研磨总用水量" label="研磨总用水量">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export const RealTimeProcessModal2 = ({ open, data, onCancel }) => {
  const timer = useRef(-1);
  const { 设备号 = "#0" } = data;
  const [form] = Form.useForm();

  const reqeustData = () => {
    form.setFieldsValue({
      图号: 0,
      产品加工记录编号: 0,
      切割机坩埚转速: 0,
      切割真空吸附压力: 0,
      最大切割压力: 0,
      切割水压: 0,
      进刀1段速度: 0,
      进刀2段速度: 0,
      进刀3段速度: 0,
      切割用水量: 0,
      切割时间: 0,
      切割高度: 0,
      外倒角设定参数: 0,
      内倒角设定参数: 0,
    });
  };

  useEffect(() => {
    if (open) {
      reqeustData();
      // timer.current = setInterval(() => {
      //   reqeustData();
      // }, 1000);
    } else {
      // clearInterval(timer.current);
    }
    return () => {
      // clearInterval(timer.current);
    };
  }, [open]);

  return (
    <Modal
      title={`切割机${设备号} - 实时加工情况`}
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
          <Col span={12}>
            <Form.Item name="图号" label="图号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="产品加工记录编号" label="产品加工记录编号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割机坩埚转速" label="切割机坩埚转速">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割真空吸附压力" label="切割真空吸附压力">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="最大切割压力" label="最大切割压力">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割水压" label="切割水压">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="进刀1段速度" label="进刀1段速度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="进刀2段速度" label="进刀2段速度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="进刀3段速度" label="进刀3段速度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割用水量" label="切割用水量">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割时间" label="切割时间">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="切割高度" label="切割高度">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="外倒角设定参数" label="外倒角设定参数">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="内倒角设定参数" label="内倒角设定参数">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
