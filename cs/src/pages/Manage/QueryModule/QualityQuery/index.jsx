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
// import {
//   deleteIqcData,
//   searchIqcData,
//   updateIqcData,
// } from "../../../../apis/tpm_api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ComputeFormCol } from "../../../../utils/obj";
import {
  delQualityData,
  readQualityData,
  updateQualityData,
} from "../../../../apis/anls_router";
const { RangePicker } = DatePicker;

const default_query_form = {
  检测日期: [
    dayjs().subtract(30, "day").format(dateFormat),
    dayjs().format(dateFormat),
  ],
  供应商名称: "",
  批次号: "",
  物料名称: "",
  物料规格: "",
};

const IQC_keys = [
  "Li",
  "Be",
  "B",
  "F",
  "Na",
  "Mg",
  "Al",
  "P",
  "S",
  "Cl",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Cs",
  "Ba",
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
  "Hf",
  "Ta",
  "W",
  "Re",
  "Os",
  "Ir",
  "Pt",
  "Au",
  "Hg",
  "Tl",
  "Pb",
  "Bi",
  "Th",
  "U",
];
const IqcModal = ({ open = false, data = {}, onCancel, requestData }) => {
  const [form] = Form.useForm();

  const default_form_data = {
    检测日期: "",
    工序: "",
    供应商名称: "",
    检测目的: "",
    物料名称: "",
    物料规格: "",
    批次号: "",
    Li: 0,
    Be: 0,
    B: 0,
    F: 0,
    Na: 0,
    Mg: 0,
    Al: 0,
    P: 0,
    S: 0,
    Cl: 0,
    K: 0,
    Ca: 0,
    Sc: 0,
    Ti: 0,
    V: 0,
    Cr: 0,
    Mn: 0,
    Fe: 0,
    Co: 0,
    Ni: 0,
    Cu: 0,
    Zn: 0,
    Ga: 0,
    Ge: 0,
    As: 0,
    Se: 0,
    Br: 0,
    Rb: 0,
    Sr: 0,
    Y: 0,
    Zr: 0,
    Nb: 0,
    Mo: 0,
    Ru: 0,
    Rh: 0,
    Pd: 0,
    Ag: 0,
    Cd: 0,
    In: 0,
    Sn: 0,
    Sb: 0,
    Te: 0,
    I: 0,
    Cs: 0,
    Ba: 0,
    La: 0,
    Ce: 0,
    Pr: 0,
    Nd: 0,
    Sm: 0,
    Eu: 0,
    Gd: 0,
    Tb: 0,
    Dy: 0,
    Ho: 0,
    Er: 0,
    Tm: 0,
    Yb: 0,
    Lu: 0,
    Hf: 0,
    Ta: 0,
    W: 0,
    Re: 0,
    Os: 0,
    Ir: 0,
    Pt: 0,
    Au: 0,
    Hg: 0,
    Tl: 0,
    Pb: 0,
    Bi: 0,
    Th: 0,
    U: 0,
  };
  const handleOk = async () => {
    const val = await form.validateFields();
    val["id"] = data.id;
    updateQualityData(
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
      title="质量数据编辑"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={1200}
    >
      <Form
        form={form}
        {...ComputeFormCol(8)}
        initialValues={default_form_data}
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
            <Form.Item label="工序" name="工序" rules={[{ required: true }]}>
              <Input />
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
            <Form.Item
              label="物料名称"
              name="物料名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="物料规格"
              name="物料规格"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="批次号"
              name="批次号"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="检测目的"
              name="检测目的"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          {IQC_keys.map((item) => (
            <Col span={4} key={item}>
              <Form.Item label={item} name={item}>
                <InputNumber placeholder="请输入" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

function QualityQuery() {
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
    delQualityData(
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
      "物料规格",
      "物料名称",
      "供应商名称",
      "工序",
      "检测目的",
      "检测方法",
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
      title: "批次号",
      dataIndex: "批次号",
      key: "批次号",
      fixed: "left",
    });
    IQC_keys.forEach((e) => {
      columns.push({
        title: e,
        key: e,
        dataIndex: e,
        width: 50,
      });
    });
    columns.push({
      title: "附件",
      key: "附件",
      dataIndex: "File_path",
      render: (x) =>
        x && (
          <Button
            // type="link"
            onClick={() => window.open(x, "_blank")}
            target="_blank"
          >
            查看附件
          </Button>
        ),
      fixed: "right",
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      fixed: "right",
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
    const values = query_form.getFieldsValue();
    setTbLoad(true);
    readQualityData(
      values,
      (res) => {
        const { data, code, msg } = res.data;
        setTbLoad(false);
        if (code === 0 && data.length > 0) {
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
    requestData();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量检验", "质量数据查询"]} />
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
          <Space size={20}>
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
              <RangePicker allowClear={false} />
            </Form.Item>
            <Form.Item label="供应商名称" name="供应商名称">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="批次号" name="批次号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="物料名称" name="物料名称">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="物料规格" name="物料规格">
              <Input placeholder="请输入" />
            </Form.Item>
            <Button type="primary" onClick={requestData} loading={tb_load}>
              查询
            </Button>
          </Space>
        </Form>
        <GeneralCard name="质量数据表">
          <Table
            bordered
            rowKey="id"
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

export default QualityQuery;
