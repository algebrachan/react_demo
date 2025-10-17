import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Modal,
} from "antd";
import { dateFormat, selectList2Option } from "../../../../utils/string";
import dayjs from "dayjs";
import {
  deleteIqcData,
  searchIqcData,
  updateIqcData,
} from "../../../../apis/tpm_api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ComputeFormCol } from "../../../../utils/obj";
const { RangePicker } = DatePicker;

const default_query_form = {
  检测日期: [
    dayjs().subtract(30, "day").format(dateFormat),
    dayjs().format(dateFormat),
  ],
  类型: "全部",
  供应商名称: "",
  型号: "",
};

const IQC_keys = [
    "Li",
    "Na",
    "K",
    "Ca",
    "Fe",
    "Al",
    "Mg",
    "Cu",
    "Mn",
    "Cr",
    "Ni",
    "Ti",
  ];
const IqcModal = ({ open = false, data = {}, onCancel, requestData }) => {
  const [form] = Form.useForm();
  
  const default_form_data = {
    检测日期: "",
    类型: "",
    供应商名称: "",
    型号: "",
    牌号: "",
    编号: "",
    批号: "",
    分析项目: "",
    纯度判定: "",
    批号来料日期: "",
    生产日期: "",
    Li: 0,
    Na: 0,
    K: 0,
    Ca: 0,
    Fe: 0,
    Al: 0,
    Mg: 0,
    Cu: 0,
    Mn: 0,
    Cr: 0,
    Ni: 0,
    Ti: 0,
  };
  const handleOk = async () => {
    const val = await form.validateFields();
    val['id'] = data.id;
    updateIqcData(
      val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("修改成功");
          requestData();
          onCancel();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    }
  }, [open]);
  return (
    <Modal
      title="修改来料IQC"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={800}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(8)}
      >
        <Row gutter={[10, 10]}>
          <Col span={8}>
            <Form.Item
              label="检测日期"
              name="检测日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format("YYYY-MM-DD")}
            >
              <DatePicker allowClear={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="类型" name="类型" rules={[{ required: true }]}>
              <Select options={selectList2Option(["COA", "供应商", "其他"])} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="供应商名称"
              name="供应商名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="型号" name="型号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="牌号" name="牌号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="编号" name="编号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="批号" name="批号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="分析项目"
              name="分析项目"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="纯度判定"
              name="纯度判定"
              rules={[{ required: true }]}
            >
              <Select options={selectList2Option(["OK", "NG"])} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="批号来料日期"
              name="批号来料日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format("YYYY-MM-DD")}
            >
              <DatePicker allowClear={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="生产日期"
              name="生产日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format("YYYY-MM-DD")}
            >
              <DatePicker allowClear={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          {IQC_keys.map((item) => (
            <Col span={8} key={item}>
              <Form.Item label={item} name={item} rules={[{ required: true }]}>
                <InputNumber placeholder="请输入" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

function IqcQuery() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [curData, setCurData] = useState({});
  const [is_modal, setIsModal] = useState(false);

  const edit = (x) => {
    setCurData(x);
    setIsModal(true);
  };
  const del = (record) => {
    const { id = "" } = record;
    deleteIqcData(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };
  const generateColumns = () => {
    let columns = [
      "检测日期",
      "类型",
      "供应商名称",
      "型号",
      "牌号",
      "编号",
      "批号",
      "分析项目",
      "纯度判定",
      "批号来料日期",
    ].map((e, _) => {
      let col = {
        // width: e.length > 3 ? 80 : 60,
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      width: 60,
      title: "序号",
      key: "key",
      dataIndex: "key",
      render: (x) => x + 1,
    });
    IQC_keys.forEach((e) => {
      columns.push({
        title: e,
        key: e,
        dataIndex: e,
      });
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 160,
      render: (record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            style={{ padding: 0 }}
            type="link"
            onClick={() => edit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
    return columns;
  };
  const requestData = () => {
    let val = query_form.getFieldsValue();
    setTbLoad(true);
    searchIqcData(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        setTbLoad(false);
        if (code === 0 && data) {
          const { data_list = [] } = data;
          setTbData(data_list);
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
    requestData();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "来料IQC查询"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
        >
          <Form.Item
            label="检测日期"
            name="检测日期"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker style={{ width: 240 }} allowClear={false} />
          </Form.Item>
          <Form.Item label="类型" name="类型">
            <Select
              showSearch
              options={selectList2Option(["全部", "COA", "供应商", "其他"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="供应商名称" name="供应商名称">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="型号" name="型号">
            <Input placeholder="请输入" />
          </Form.Item>
          <Space size={20}>
            <Button type="primary" onClick={requestData} loading={tb_load}>
              查询
            </Button>
          </Space>
        </Form>
        <GeneralCard name="来料IQC表">
          <Table
            bordered
            loading={tb_load}
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
          />
          <IqcModal
            open={is_modal}
            onCancel={() => setIsModal(false)}
            data={curData}
            requestData={requestData}
          />
        </GeneralCard>
      </div>
    </div>
  );
}

export default IqcQuery;
