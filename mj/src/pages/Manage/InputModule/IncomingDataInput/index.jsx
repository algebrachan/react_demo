import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import "./qdu.less";
import { ComputeFormCol } from "../../../../utils/obj";
import { selectList2Option } from "../../../../utils/string";
import { useNavigate } from "react-router-dom";
import { addIqcData } from "../../../../apis/tpm_api";

// 1	2	3	4	5	6	7	8	9	10	11	12
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
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
const convertToFloat = (data) => {
  if (typeof data === "string") return data;
  try {
    return parseFloat(data);
  } catch (e) {
    return null;
  }
};
// 质量数据上传
function IncomingDataInput() {
  const [form] = Form.useForm();
  const [tb_form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [tb_data, setTbData] = useState([]);
  const [area_input, setAreaInput] = useState("");
  const navigate = useNavigate();
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    tb_form.setFieldsValue(record);
    setEditingKey(record.key);
  };
  const del = (key) => {
    const newData = tb_data.filter((item) => item.key !== key);
    setTbData(newData);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await tb_form.validateFields();
      const newData = [...tb_data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, Object.assign(Object.assign({}, item), row));
        setTbData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTbData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      width: 50,
      editable: false,
    },
    {
      title: "元素",
      dataIndex: "元素",
      width: 120,
      editable: false,
    },
    {
      title: "解析数据",
      dataIndex: "解析数据",
      width: 120,
      editable: true,
    },
    {
      title: "修正数据",
      dataIndex: "修正数据",
      width: 120,
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "操作",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => save(record.key)}
            >
              保存
            </Button>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={editingKey !== ""}
              style={{ padding: 5 }}
              onClick={() => edit(record)}
            >
              编辑
            </Button>
            {/* <Popconfirm
              title="警告"
              description="确认删除该条数据?"
              onConfirm={() => del(record.key)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                disabled={editingKey !== ""}
                style={{ padding: 5 }}
                type="link"
                danger
              >
                删除
              </Button>
            </Popconfirm> */}
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const handleSubmit = async () => {
    let val = await form.validateFields();
    IQC_keys.forEach((key)=>{
        let element = tb_data.find((item)=>key===item.元素)
        val[key] = element?Number(element.修正数据):null;
    })
    addIqcData(val,(res)=>{
        const {code,msg,data} = res.data;
        if(code===0&&data){
            message.success('上传成功！')
        }else{
            message.error(msg)
        }

    },()=>{  message.error('网络异常')})
  };
  const decodeAreaInput = () => {
    if (area_input === "") {
      message.warning("请复制参数后再解析");
      return;
    }

    const values = area_input.trim().split(/[ \t]+/)
    const results = {};
    const results_modify = {};
    if (values.length !== IQC_keys.length) {
      message.warning("输入数据的列数与元素数量不匹配！");
      return;
    }
    for (let i = 0; i < IQC_keys.length; i++) {
      const key = IQC_keys[i];
      const value = values[i];
      results[key] = value;
      results_modify[key] = convertToFloat(value);
    }
    // 组成table数据
    const newData = [];
    Object.keys(results).forEach((item, _) => {
      newData.push({
        key: _,
        元素: item,
        解析数据: results[item],
        修正数据: results_modify[item],
      });
    });
    setTbData(newData);
  };
  return (
    <Row className="quality_data_upload_root" gutter={[16, 16]}>
      <Col span={12}>
        <Form
          form={form}
          initialValues={{
            检测日期: dayjs().format("YYYY-MM-DD"),
            类型: "",
            供应商名称: "",
            型号: "",
            牌号: "",
            编号: "",
            批号: "",
            分析项目: "",
            纯度判定: "",
            批号来料日期: dayjs().format("YYYY-MM-DD"),
            生产日期: dayjs().format("YYYY-MM-DD"),
          }}
          {...ComputeFormCol(3)}
          size="large"
        >
          <Flex vertical gap={20}>
            <Flex gap={40}>
            <h2>美晶-IQC质量数据上传</h2>
            <Button  onClick={() => {
              navigate("/mng");
            }} size="middle">返回</Button>
            </Flex>
            <Input.TextArea
              placeholder="请复制参数"
              rows={2}
              value={area_input}
              onChange={(e) => setAreaInput(e.target.value)}
            />
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
            <Form.Item label="类型" name="类型" rules={[{ required: true }]}>
              <Select options={selectList2Option(["COA", "供应商", "其他"])} />
            </Form.Item>
            <Form.Item
              label="供应商名称"
              name="供应商名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="型号" name="型号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="牌号" name="牌号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="编号" name="编号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="批号" name="批号" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="分析项目"
              name="分析项目"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="纯度判定"
              name="纯度判定"
              rules={[{ required: true }]}
            >
              <Select options={selectList2Option(["OK", "NG"])} />
            </Form.Item>
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
            <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
              <Space size={20}>
                <Button type="primary" onClick={decodeAreaInput} size="middle">
                  解析
                </Button>
                <Button type="primary" onClick={handleSubmit} size="middle">
                  提交
                </Button>
              </Space>
            </Form.Item>
          </Flex>
        </Form>
      </Col>
      <Col span={12}>
        <div className="table_root">
          <h3>质检报告</h3>
          <Form form={tb_form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{ y: 700 }}
              bordered
              dataSource={tb_data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false}
              size="small"
            />
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default IncomingDataInput;
