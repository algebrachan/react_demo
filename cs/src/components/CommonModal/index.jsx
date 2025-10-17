import {
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Space,
  DatePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { selectList2Option, timeFormat } from "../../utils/string";
import { ComputeFormCol } from "../../utils/obj";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
export const PointModal = ({ open = false, point = [], onOk, onCancel }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    if (open) {
      setText("");
    }
  }, [open]);
  return (
    <Modal
      title="注释信息"
      open={open}
      onOk={() => onOk(point, text)}
      onCancel={onCancel}
      destroyOnHidden={true}
      okText="确认"
      width={300}
    >
      <div>
        <Input
          placeholder="请输入注释文字"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Space style={{ fontSize: 16, marginTop: 5 }} size={20}>
          <div>x坐标:{point[0]}</div>
          <div>y坐标:{point[1]}</div>
        </Space>
      </div>
    </Modal>
  );
};

export const ClearPointModal = ({
  open = false,
  point = [],
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      form.setFieldValue("del_point", []);
    }
  }, [open]);
  const handleOk = () => {
    let del_idx_list = form.getFieldValue("del_point");
    let rest = point.filter((item, _) => !del_idx_list.includes(_));
    onOk(rest);
  };
  return (
    <Modal
      title="删除标注"
      open={open}
      onOk={() => handleOk()}
      onCancel={onCancel}
      destroyOnHidden={true}
      okText="确认"
      width={400}
    >
      <div>
        <Form form={form} initialValues={{ del_point: [] }}>
          <Form.Item name="del_point">
            <Checkbox.Group style={{ width: "100%" }}>
              {point.map((item, _) => (
                <Checkbox
                  value={_}
                  key={_}
                  style={{ width: "100%", textAlign: "center", marginTop: 5 }}
                >
                  {`位置:(${item.x},${item.y}) 说明:${item.t}`}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export const SearchFileModal = ({
  open = false,
  option_obj = {},
  onOk,
  onCancel,
}) => {
  const handleOk = () => {
    // 整理过后，给一个para
    onCancel();
    onOk();
  };
  useEffect(() => {}, []);
  return (
    <Modal
      title="查询文件"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden={true}
      okText="确认"
      width={500}
    >
      <div
        style={{
          padding: 10,
          display: "flex",
          rowGap: 16,
          flexDirection: "column",
        }}
      >
        <Form.Item
          label="时间"
          name="时间"
          getValueProps={(value) => {
            return {
              value: value && value.map((e) => dayjs(e)),
            };
          }}
          normalize={(value) =>
            value && value.map((e) => dayjs(e).format(timeFormat))
          }
          {...ComputeFormCol(3)}
        >
          <RangePicker showTime allowClear={false} />
        </Form.Item>
        <Form.Item label="工厂" name="工厂" {...ComputeFormCol(3)}>
          <Select options={selectList2Option(option_obj["工厂"])} />
        </Form.Item>
        <Form.Item label="车间" name="车间" {...ComputeFormCol(3)}>
          <Select options={selectList2Option(option_obj["车间"])} />
        </Form.Item>
        <Form.Item label="工序" name="工序" {...ComputeFormCol(3)}>
          <Select options={selectList2Option(option_obj["工序"])} />
        </Form.Item>
        <Form.Item label="机台" name="机台" {...ComputeFormCol(3)}>
          <Select options={selectList2Option(option_obj["机台"])} />
        </Form.Item>
      </div>
    </Modal>
  );
};

export const PanelResizeHandleStyle = {
  display: "flex",
  outline: "none",
  flex: "0 0 .25rem",
  justifyContent: "stretch",
  alignItems: "stretch",
  transition: "background-color .2s linear",
  cursor: "col-resize",
  backgroundColor: "#e6f4ff",
};

export const OperationConfirmPassword = ({ open = false, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const { password } = await form.validateFields();
      if (password === "1234.com") {
        onOk();
        onCancel();
      } else {
        onCancel();
        message.warning("密码错误");
      }
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="确认密码"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={400}
    >
      <Form form={form} initialValues={{ password: "" }}>
        <Form.Item
          name="password"
          label="请输入密码"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
