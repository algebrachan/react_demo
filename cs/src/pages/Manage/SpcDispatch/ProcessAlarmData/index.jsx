import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Flex,
  Form,
  DatePicker,
  Button,
  Input,
  Space,
  Table,
  message,
  Popconfirm,
  Modal,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { dateFormat } from "../../../../utils/string";
import {
  spcAlarmAbnornalData,
  spcDelAlarmAbnornalData,
} from "../../../../apis/nc_review_router";
import { ComputeFormCol, GenerateFormItem } from "../../../../utils/obj";
const { RangePicker } = DatePicker;

const DispatchModal = ({ open = false, data = {}, onCancel, requestData }) => {
  const [form] = Form.useForm();
  const default_form_data = {
    task_name: "",
    task_duration: 0,
    order_quantity: 0,
    order_role: [],
    order_user: [],
  };
  const FormDataItems = [
    { label: "任务名称", name: "task_name", type: "input", required: true },
    {
      label: "持续时间",
      name: "task_duration",
      type: "input_number",
      addonAfter: "h",
      required: true,
    },
    {
      label: "所需人数",
      name: "order_quantity",
      type: "input_number",
      required: true,
    },
    {
      label: "接单角色",
      name: "order_role",
      type: "multi_select",
      required: true,
      opt: [],
    },
    {
      label: "接单人员",
      name: "order_user",
      type: "multi_select",
      required: true,
      opt: [],
    },
  ];

  const handleOk = async () => {
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
    console.log(values);
  };

  useEffect(() => {
    if (open) {
      console.log(data);
    }
  }, [open]);
  return (
    <Modal
      title="派工任务"
      open={open}
      onCancel={onCancel}
      getContainer={false}
      onOk={handleOk}
      width={600}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(5)}
      >
        <Flex vertical gap={16}>
          {FormDataItems.map((item, _) => (
            <GenerateFormItem item={item} key={_} />
          ))}
        </Flex>
      </Form>
    </Modal>
  );
};

// 加工异常数据
function ProcessAlarmData() {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [is_modal, setIsModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
    };
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "订单编号",
      dataIndex: "订单编号",
      key: "订单编号",
      width: 150,
    },
    {
      title: "设备号",
      dataIndex: "设备号",
      key: "设备号",
      width: 150,
    },
    {
      title: "工序",
      dataIndex: "工序",
      key: "工序",
      width: 150,
    },
    {
      title: "异常数据",
      key: "abnormal_data",
      width: 300,
      render: (record) => {
        const filteredRecord = Object.entries(record)
          .filter(([key]) => !["订单编号", "设备号", "工序"].includes(key))
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join("\r\n");

        // 将过滤后的对象转换为JSON字符串并返回
        return <div style={{ whiteSpace: "pre-wrap" }}>{filteredRecord}</div>;
      },
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setCurData(record);
              setIsModal(true);
            }}
          >
            创建派工任务
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const del = (record) => {
    return;
    spcDelAlarmAbnornalData(
      { id: record.id },
      (res) => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success(msg);
          query();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("删除失败");
      }
    );
  };

  const query = () => {
    const values = form.getFieldsValue();
    setTbLoad(true);
    spcAlarmAbnornalData(
      values,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          setTbData(data);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    query();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "加工异常数据"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form
            layout="inline"
            form={form}
            initialValues={{
              process: "",
              time: [
                dayjs().subtract(1, "month").format(dateFormat),
                dayjs().format(dateFormat),
              ],
            }}
          >
            <Space>
              <Form.Item
                label="时间"
                name="time"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker allowClear={false} />
              </Form.Item>
              <Form.Item label="工序" name="process">
                <Input placeholder="请输入" />
              </Form.Item>
              <Button type="primary" onClick={query}>
                查询
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="订单编号"
            bordered
            loading={tb_load}
            size="small"
            columns={columns}
            dataSource={tb_data}
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
          />
        </Flex>
        <DispatchModal
          data={cur_data}
          open={is_modal}
          onCancel={() => setIsModal(false)}
        />
      </div>
    </div>
  );
}

export default ProcessAlarmData;
