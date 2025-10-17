import React, { useEffect, useState } from "react";
import {
  Flex,
  Form,
  Row,
  Col,
  Spin,
  Divider,
  Select,
  Button,
  Checkbox,
  message,
  Input,
  AutoComplete,
} from "antd";
import {
  ComputeFormCol,
  FileUpload,
  GenerateFormItem,
} from "../../../../../utils/obj";
import {
  AddFormDataItems,
  CancelFormDataItems,
  DEPARTMENT_LIST,
  ReceiveFormDataItems,
  RelatedFormTable,
  UpdateFormDataItems,
  URGENCY,
} from "./common";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  dateFormat,
  selectList2Option,
  timeFormat,
} from "../../../../../utils/string";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { dccSubmitAndStartApproval } from "../../../../../apis/qms_router";
import {
  createFileCode,
  qmsDccGetFileList,
} from "../../../../../apis/nc_review_router";

const incrementVersion = (versions) => {
  // 检查输入是否有效
  if (!Array.isArray(versions) || versions.length < 2) {
    return versions; // 如果输入不是数组或长度不足2，直接返回原输入
  }

  // 获取第二个版本号
  const secondVersion = versions[1];

  // 提取前缀和数字部分
  const match = secondVersion.match(/^([A-Za-z]*)(\d+(?:\.\d+)?)$/);
  if (!match) {
    return versions; // 如果无法匹配版本号格式，返回原输入
  }

  const prefix = match[1];
  const versionNumber = match[2];

  // 递增版本号
  const incrementedVersion = (parseFloat(versionNumber) + 0.1).toFixed(1);

  // 移除末尾的.0（如果有）
  const formattedVersion = incrementedVersion.endsWith(".0")
    ? incrementedVersion.slice(0, -2)
    : incrementedVersion;

  // 组合新的版本号
  const newSecondVersion = prefix + formattedVersion;

  // 创建并返回新数组
  const result = [...versions];
  result[1] = newSecondVersion;

  return result;
};

function DccShenQing({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
  setProcessId = () => {},
  file_jump = null,
}) {
  const CommonFormDataItems = [
    { name: "公司", type: "input", disabled: true },
    {
      name: "文件申请类型",
      type: "select",
      opt: ["新增", "更改", "接收外来文件", "作废"],
      disabled: id || file_jump ? true : false,
    },
    { name: "申请人", type: "input", required: true },
    { name: "申请部门", type: "select", required: true, opt: DEPARTMENT_LIST },
    { name: "申请原因", type: "text_area", required: true },
    { name: "申请时间", type: "time", required: true },
    { name: "紧急程度", type: "select", required: true, opt: URGENCY },
    { name: "内外部", type: "radio", required: true, opt: ["内部", "外部"] },
  ];
  const { person, department } = useSelector((state) => state.mng.qms);
  const [filename_list, setFilenameList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [file4List, setFile4List] = useState([]);
  const [fujList, setFujList] = useState([]);
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const departMent = Form.useWatch("申请部门", form);
  const file_type = Form.useWatch("文件申请类型", form);
  const file_level = Form.useWatch("文件级别", form);
  const file_code1 = Form.useWatch("文件编号", form);
  const file_code2 = Form.useWatch("更改后文件编号", form);
  const file_code3 = Form.useWatch("外来文件编号", form);
  const default_form_data = {
    公司: "宁夏创盛新材料股份有限公司",
    文件申请类型: "新增",
    申请时间: dayjs().format(timeFormat),
    申请人: person,
    申请原因: "",
    申请部门: department,
    紧急程度: "",
    内外部: "",
    发放需求: [],
    评审部门: [],
    会签部门: [],
    查看部门: [],
  };
  const FormObj = {
    新增: AddFormDataItems,
    更改: UpdateFormDataItems,
    接收外来文件: ReceiveFormDataItems,
    作废: CancelFormDataItems,
  };

  const addFormNumbers = (list) => {
    const fileCode = file_code1 || file_code2 || file_code3;
    if (!fileCode) {
      message.warning("请填写文件编号");
      return [];
    }
    // 根据文件编号判断是哪一类
    let lenCode = fileCode.split("-").length;
    if (lenCode === 3) {
      return list.map((item, index) => {
        const serialNumber = (index + 1).toString().padStart(2, "0");
        const formNumber = `${fileCode}-BD/${serialNumber}`;
        return {
          ...item,
          表单编号: formNumber,
        };
      });
    } else {
      return list.map((item, index) => {
        const serialNumber = (index + 1).toString().padStart(3, "0");
        const formNumber = `${fileCode}-BD-${serialNumber}`;
        return {
          ...item,
          表单编号: formNumber,
        };
      });
    }
  };
  const applyCode = async () => {
    if (fileList.length === 0) {
      message.warning("请上传文件");
      return;
    }
    const values = form.getFieldsValue();
    createFileCode(
      values,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          const { 文件编号 = "" } = data;
          form.setFieldsValue({ 文件编号 });
        } else {
          message.error(msg);
        }
      },
      () => {}
    );
  };
  const FileForm = (
    <>
      <Col span={12}>
        <Form.Item label="文件上传">
          <FileUpload
            listType="text"
            fileList={fileList}
            setFileList={setFileList}
          />
        </Form.Item>
      </Col>
      {file_type === "新增" && (
        <Col span={12}>
          <Button type="primary" onClick={applyCode}>
            申请文件编号
          </Button>
        </Col>
      )}
      {/* <Col span={12}>
        <Form.Item label="四级文件上传(非必传)">
          <FileUpload
            maxCount={null}
            listType="text"
            fileList={file4List}
            setFileList={setFile4List}
          />
        </Form.Item>
      </Col> */}
      <Col span={24}>
        <RelatedFormTable
          tb_data={file4List}
          setTbData={setFile4List}
          addFormNumbers={addFormNumbers}
        />
      </Col>
      <Col span={12}>
        <Form.Item label="附件上传">
          <FileUpload
            listType="text"
            maxCount={10}
            fileList={fujList}
            setFileList={setFujList}
          />
        </Form.Item>
      </Col>
    </>
  );

  const FafangForm = (
    <Col span={24}>
      <Form.Item
        label="发放需求"
        name="发放需求"
        rules={[{ required: true }]}
        {...ComputeFormCol(3)}
      >
        <Form.List name="发放需求">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={10} style={{ marginBottom: 8 }}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "部门"]}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="选择部门"
                        options={selectList2Option(DEPARTMENT_LIST)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      {...restField}
                      name={[name, "份数"]}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="选择份数"
                        options={selectList2Option([1, 2, 3])}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "发放格式"]}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="选择发放格式"
                        options={selectList2Option(["电子", "电子+纸质"])}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加适用范围
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
    </Col>
  );

  const HuiqianForm = (
    <Col span={24}>
      <Form.Item
        name="会签部门"
        label="会签部门"
        rules={[{ required: true }]}
        {...ComputeFormCol(3)}
      >
        <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
      </Form.Item>
    </Col>
  );

  const ChakanForm = (
    <Col span={24}>
      <Form.Item
        name="查看部门"
        label="查看部门"
        rules={[{ required: true }]}
        {...ComputeFormCol(3)}
      >
        <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
      </Form.Item>
    </Col>
  );

  const ShenpiForm = (
    <>
      <Col span={24}>
        <Form.Item
          name="评审部门"
          label="评审部门"
          rules={[{ required: true }]}
          {...ComputeFormCol(3)}
        >
          <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name="查看部门"
          label="查看部门"
          rules={[{ required: true }]}
          {...ComputeFormCol(3)}
        >
          <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
        </Form.Item>
      </Col>
    </>
  );

  // const searchFileList = () => {
  //   qmsDccGetFileList(
  //     (res) => {
  //       const { code, msg, data } = res.data;
  //       if (code === 0) {
  //         const { file_list } = data;
  //         setFilenameList(file_list);
  //       } else {
  //         setFilenameList([]);
  //       }
  //     },
  //     () => {
  //       setFilenameList([]);
  //     }
  //   );
  // };

  const submit = async () => {
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
    values["流程单号"] = id || "";
    if (fileList.length === 0 && file_type !== "作废") {
      message.warning("请上传文件");
      return;
    }
    const formData = new FormData();

    // 获取原始文件对象并转换为二进制
    if (file_type !== "作废") {
      const fileBlob = new Blob([fileList[0].originFileObj], {
        type: fileList[0].type,
      });
      formData.append("file", fileBlob, fileList[0].name);
    }
    const temp_related_form = [];
    if (file4List && file4List.length > 0) {
      file4List.forEach((item, index) => {
        const { file, ...rest } = item;
        temp_related_form.push(rest);
        if (file) {
          const fileBlob = new Blob([file.originFileObj], {
            type: file.type,
          });
          formData.append("file4", fileBlob, file.name);
        }
      });
    }
    const temp_fujList = [];
    if (fujList && fujList.length > 0) {
      fujList.forEach((file) => {
        if (file.originFileObj) {
          const fileBlob = new Blob([file.originFileObj], {
            type: file.type,
          });
          formData.append("attachment", fileBlob, file.name);
        }
        temp_fujList.push(file.name);
      });
    }
    values["四级文件列表"] = temp_related_form;
    values["附件"] = temp_fujList;
    formData.append("request_data", JSON.stringify(values)); 
    setLoad(true);
    dccSubmitAndStartApproval(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
          if (id) {
            reFresh();
          } else {
            setProcessId(data);
          }
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("提交失败");
      }
    );
  };
  const initFileForm = (val) => {
    setFileList([]);
    setFile4List([]);
    if (id) {
      form.setFieldsValue(review_data);
    } else {
      form.setFieldsValue({
        ...FormObj[val]?.reduce((acc, item) => {
          if (item.type === "multi_select") {
            acc[item.name] = [];
          } else if (item.type === "time") {
            acc[item.name] = dayjs().format(timeFormat);
          } else if (item.type === "date") {
            acc[item.name] = dayjs().format(dateFormat);
          } else {
            acc[item.name] = "";
          }
          return acc;
        }, {}),
      });
    }
    if (file_jump) {
      form.setFieldsValue(file_jump);
      let temp_file4List = (file_jump?.["四级文件信息"] || []).map((item) => ({
        key: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        表单名称: item?.四级文件 || "",
        表单编号: item?.表单编号 || "",
        版本: item?.版本 || "",
      }));
      let temp_fjList = (file_jump?.["附件信息"] || []).map((item, _) => ({
        uid: _,
        name: item?.附件 || "",
        status: "done",
        ...item,
      }));
      setFile4List(temp_file4List);
      setFujList(temp_fjList);
    }
  };

  useEffect(() => {
    if (fileList.length > 0) {
      if (file_type === "更改") {
        form.setFieldValue("更改后文件名称", fileList[0].name);
      } else if (file_type === "接收外来文件") {
        form.setFieldValue("外来文件名称", fileList[0].name);
      } else if (file_type === "作废") {
        form.setFieldValue("需作废文件名称", fileList[0].name);
      } else {
        form.setFieldValue("文件名称", fileList[0].name);
      }
    }
  }, [fileList]);
  useEffect(() => {
    if (file_type) {
      // 设置对应的初始化列表
      initFileForm(file_type);
    }
  }, [file_type]);

  useEffect(() => {
    form.setFieldsValue(review_data);
  }, [review_data]);
  useEffect(() => {}, []);

  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">发起申请</div>
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(6)}
          disabled={disabled}
        >
          <Flex vertical gap={16}>
            <Row gutter={[16, 16]}>
              {CommonFormDataItems.map((item) => (
                <Col span={12} key={item.name}>
                  <GenerateFormItem item={item} />
                </Col>
              ))}
              <Divider style={{ margin: "5px 0" }} />
              {file_type === "新增" && (
                <>
                  {AddFormDataItems.map((item) => (
                    <Col span={12} key={item.name}>
                      <GenerateFormItem item={item} />
                    </Col>
                  ))}
                  {FileForm}
                  <Divider style={{ margin: "5px 0" }} />
                  {FafangForm}
                  {!(
                    file_level === "单点教育" ||
                    (file_level === "指导书" &&
                      ["质量管理部", "设备动力科"].includes(departMent))
                  ) && HuiqianForm}
                  {ChakanForm}
                </>
              )}
              {file_type === "更改" && (
                <>
                  {UpdateFormDataItems.map((item) => {
                    if (item.name === "更改前文件名称") {
                      item["component"] = (
                        <AutoComplete
                          placeholder="请选择文件"
                          options={filename_list?.map((e) => ({
                            label: e["文件名"],
                            value: e["文件名"],
                          }))}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(val) => {
                            // 触发自动填入
                            const selectedFile = filename_list?.find(
                              (item) => item["文件名"] === val
                            );
                            if (selectedFile) {
                              // 将找到的数据填充到表单中
                              form.setFieldsValue({
                                更改前文件编号: selectedFile["文件编号"],
                                更改前文件版本: selectedFile["文件版本"],
                                更改后文件编号: selectedFile["文件编号"],
                                更改后文件版本: incrementVersion(
                                  selectedFile["文件版本"]
                                ),
                              });
                            }
                          }}
                        />
                      );
                    }
                    return (
                      <Col span={12} key={item.name}>
                        <GenerateFormItem item={item} />
                      </Col>
                    );
                  })}
                  {FileForm}
                  <Divider style={{ margin: "5px 0" }} />
                  {FafangForm}
                  {file_level !== "单点教育" && HuiqianForm}
                  {ChakanForm}
                </>
              )}
              {file_type === "作废" && (
                <>
                  {CancelFormDataItems.map((item) => {
                    if (item.name === "需作废文件名称") {
                      item["component"] = (
                        <AutoComplete
                          placeholder="请选择文件"
                          options={filename_list?.map((e) => ({
                            label: e["文件名"],
                            value: e["文件名"],
                          }))}
                          showSearch
                          onChange={(val) => {
                            // 触发自动填入
                            const selectedFile = filename_list?.find(
                              (item) => item["文件名"] === val
                            );
                            if (selectedFile) {
                              // 将找到的数据填充到表单中
                              form.setFieldsValue({
                                需作废文件编号: selectedFile["文件编号"],
                                需作废文件版本: selectedFile["文件版本"],
                              });
                            }
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        />
                      );
                    }
                    return (
                      <Col span={12} key={item.name}>
                        <GenerateFormItem item={item} />
                      </Col>
                    );
                  })}
                </>
              )}
              {file_type === "接收外来文件" && (
                <>
                  {ReceiveFormDataItems.map((item) => (
                    <Col span={12} key={item.name}>
                      <GenerateFormItem item={item} />
                    </Col>
                  ))}
                  {FileForm}
                  <Divider style={{ margin: "5px 0" }} />
                  {ShenpiForm}
                </>
              )}
            </Row>
            <Flex justify="end">
              <Button type="primary" onClick={submit}>
                提交
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Flex>
  );
}

export default DccShenQing;
