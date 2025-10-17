import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import { ComputeFormCol, FileUpload } from "@/utils/obj";
import { qualityDataStorage } from "@/apis/anls_router";
import { selectList2Option } from "../../../../utils/string";
import { MyBreadcrumb } from "../../../../components/CommonCard";

const TestPurpose = {
  到货检验: ["GDMS全元素检验", "D-SIMS"],
  月度抽检: ["GDMS全元素检验"],
  研发测试: ["ICPMS/MS", "GDMS部分元素检验"],
};
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
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const IQC_keys = [
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Na",
  "Mg",
  "Al",
  "Si",
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
const convertToFloat = (data) => {
  if (typeof data === "string") return data;
  try {
    return parseFloat(data);
  } catch (e) {
    return null;
  }
};
// 质量数据上传
function QualityDataUpload() {
  const [form] = Form.useForm();
  const [tb_form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [tb_data, setTbData] = useState([]);
  const [area_input, setAreaInput] = useState("");
  const [fileList, setFileList] = useState([]);

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
      editable: true,
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
            <Popconfirm
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
            </Popconfirm>
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
    val["质检报告"] = tb_data;
    const formData = new FormData();
    formData.append("quality_data", JSON.stringify(val));
    if (fileList.length > 0) {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    setLoad(true);
    qualityDataStorage(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg || "提交失败");
        }
      },
      () => {
        setLoad(false);
        message.error("网络异常");
      }
    );
  };
  const decodeAreaInput = () => {
    if (area_input === "") {
      message.warning("请复制参数后再解析");
      return;
    }
    const oriCharsList = area_input.split(/\s+/).filter(Boolean);
    const results = {};
    const results_modify = {};
    const unRecognizedKeys = IQC_keys.filter(
      (key) => !oriCharsList.includes(key)
    );
    for (const key of IQC_keys) {
      const indexKey = oriCharsList.indexOf(key);
      if (indexKey === -1) {
        // 如果元素符号不存在，跳过
        continue;
      }
      let value = "";
      if (indexKey + 1 < oriCharsList.length) {
        value = oriCharsList[indexKey + 1];
        if (
          indexKey + 2 < oriCharsList.length &&
          !IQC_keys.includes(oriCharsList[indexKey + 2])
        ) {
          value += oriCharsList[indexKey + 2];
        }
      }
      results[key] = value;
      if (value === "-") {
        results_modify[key] = null;
      } else {
        if (value.endsWith("*")) {
          results_modify[key] = convertToFloat(value.slice(0, -1));
        } else {
          if (value.startsWith("<")) {
            results_modify[key] = "0";
          } else {
            results_modify[key] = convertToFloat(value);
          }
        }
      }
    }
    // 如果有未识别的元素，弹窗提醒
    if (unRecognizedKeys.length > 0) {
      message.warning(`以下元素未被识别：${unRecognizedKeys.join(", ")}`);
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
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量检验", "质量数据录入"]} />
      <div className="content_root">
        <Spin spinning={load}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form
                form={form}
                initialValues={{
                  工序: "质量",
                  检测目的: "",
                  检测方法: "",
                  供应商名称: "",
                  物料名称: "",
                  物料规格: "",
                  批次号: "",
                  检测日期: dayjs().format("YYYY-MM-DD"),
                }}
                {...ComputeFormCol(3)}
              >
                <Flex vertical gap={20}>
                  <h2>创盛-质量数据上传</h2>
                  <Input.TextArea
                    placeholder="请复制参数"
                    rows={3}
                    value={area_input}
                    onChange={(e) => setAreaInput(e.target.value)}
                  />
                  <Form.Item label="工序" name="工序">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label="检测目的"
                    name="检测目的"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={selectList2Option(Object.keys(TestPurpose))}
                      placeholder="请选择"
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, current) =>
                      prev.检测目的 !== current.检测目的
                    }
                  >
                    {
                      ({ getFieldValue, setFieldValue }) => {
                        setFieldValue("检测方法", "");
                        const purpose = getFieldValue("检测目的");
                        return (
                          <Form.Item
                            label="检测方法"
                            name="检测方法"
                            rules={[{ required: true }]}
                          >
                            <Select
                              options={selectList2Option(
                                TestPurpose[purpose] || []
                              )}
                              placeholder="请选择"
                            />
                          </Form.Item>
                        );
                      }
                      // getFieldValue("检测目的") && (
                      //   <Form.Item
                      //     label="BOM原因"
                      //     name="bomImpactReason"
                      //     rules={[{ required: true }]}
                      //   >
                      //     <Input placeholder="请输入原因" />
                      //   </Form.Item>
                      // )
                    }
                  </Form.Item>

                  <Form.Item
                    label="供应商名称"
                    name="供应商名称"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="物料名称"
                    name="物料名称"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="物料规格"
                    name="物料规格"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="批次号"
                    name="批次号"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item
                    label="检测日期"
                    name="检测日期"
                    getValueProps={(value) => {
                      return {
                        value: value && dayjs(value),
                      };
                    }}
                    normalize={(value) =>
                      value && dayjs(value).format("YYYY-MM-DD")
                    }
                  >
                    <DatePicker allowClear={false} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item label="上传附件">
                    <FileUpload
                      fileList={fileList}
                      setFileList={setFileList}
                      accept=".pdf"
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
                    <Space size={20}>
                      <Button type="primary" onClick={decodeAreaInput}>
                        解析
                      </Button>
                      <Button type="primary" onClick={handleSubmit}>
                        提交
                      </Button>
                    </Space>
                  </Form.Item>
                </Flex>
              </Form>
            </Col>
            <Col span={12}>
              <Flex vertical gap={20}>
                <h3>质检报告</h3>
                <Form
                  form={tb_form}
                  component={false}
                  style={{ marginTop: 20 }}
                >
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
              </Flex>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
}

export default QualityDataUpload;
