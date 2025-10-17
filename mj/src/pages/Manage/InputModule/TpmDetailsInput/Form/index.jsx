import {
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Upload,
  Image,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import {
  addTpmDetails,
  addTpmDetailsOptions,
  insertTpmInfomations,
} from "../../../../../apis/tpm_api";
import { useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
const { TextArea } = Input;

export const ImageUpload = ({ fileList = [], setFileList = () => {} }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPeviewImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPeviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);
  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/*"
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file) => {
          // 对图片的大小做限制
          if (file.size > 1024 * 1024*10) {
            message.error("图片大小不能超过10MB");
            return false;
          }
          // 生成临时的url链接
          let imageUrl = URL.createObjectURL(file);
          setImageUrl(imageUrl);
          file.url = imageUrl;
          setFileList([file]);
          return false; // 阻止自动上传
        }}
        onRemove={(file) => {
          setFileList([]);
          setImageUrl(null);
        }}
        onPreview={handlePreview}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPeviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export const MyAutoComplete = ({ opt = [], label = "" }) => {
  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    if (name === "") {
      return;
    }
    let str = name.toUpperCase();
    if (options.includes(str)) {
      message.warning("请勿添加重复元素");
      setName("");
    } else {
      // 请求后端
      addTpmDetailsOptions(
        { name: label, value: str },
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            setOptions([...options, str]);
            setName("");
            message.success("添加成功");
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
  useEffect(() => {
    if (opt && opt.length > 0) {
      setOptions(opt);
    }
  }, [opt]);
  return (
    <Form.Item label={label} name={label} rules={[{ required: true }]}>
      <AutoComplete
        placeholder="请输入"
        options={selectList2Option(options)}
        filterOption={(inputValue, option) =>
          option &&
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider
              style={{
                margin: "8px 0",
              }}
            />
            <Space
              style={{
                padding: "0 8px 4px",
              }}
            >
              <Input
                placeholder="新增参数"
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button
                type="text"
                icon={<PlusOutlined />}
                style={{ padding: 5 }}
                onClick={addItem}
              >
                新增
              </Button>
            </Space>
          </>
        )}
      />
    </Form.Item>
  );
};

export const TpmDetailsForm = ({ onHide, requestData }) => {
  const [form] = Form.useForm();
  const tpm_details_opt = useSelector((state) => state.mng.tpm_details_opt);
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [btn_load,setBtnLoad] = useState(false)

  const reset = () => {
    form.resetFields();
    setFileList1([]);
    setFileList2([]);
  };
  const submit = async () => {
    const formData = new FormData();
    let val = await form.validateFields();
    formData.append("details", JSON.stringify(val));
    fileList1.length > 0 && formData.append("image_1", fileList1[0]);
    fileList2.length > 0 && formData.append("image_2", fileList2[0]);
    setBtnLoad(true)

    addTpmDetails(
      formData,
      (res) => {
        const { data, code, msg } = res.data;
        setBtnLoad(false)
        if (code === 0 && data) {
          message.success("提交成功");
          requestData()
          reset();
        } else {
          message.error(msg);
        }
      },
      () => {
        setBtnLoad(false)
        message.error("网络异常");
      }
    );
  };
  return (
    <Card
      title="TPM明细录入"
      style={{
        width: "100%",
      }}
      size="small"
    >
      <Form
        form={form}
        {...ComputeFormCol(8)}
        initialValues={{
          日期: dayjs().format(dateFormat),
          部门: "",
          工序: "",
          机台: "",
          类别: "",
          描述: "",
          整改措施: "",
          整改日期: dayjs().format(dateFormat),
          提交人: "",
          是否完成: "",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <Form.Item
              label="日期"
              name="日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            >
              <DatePicker allowClear={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <MyAutoComplete label="部门" opt={tpm_details_opt["部门"]} />
          </Col>
          <Col span={4}>
            <MyAutoComplete label="工序" opt={tpm_details_opt["工序"]} />
          </Col>
          <Col span={4}>
            <MyAutoComplete label="机台" opt={tpm_details_opt["机台"]} />
          </Col>
          <Col span={4}>
            <MyAutoComplete label="类别" opt={tpm_details_opt["类别"]} />
          </Col>
          <Col span={4}>
            <Form.Item label="描述" name="描述" rules={[{ required: true }]}>
              <TextArea autoSize />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="照片">
              <ImageUpload fileList={fileList1} setFileList={setFileList1} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="整改措施"
              name="整改措施"
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="整改照片">
              <ImageUpload fileList={fileList2} setFileList={setFileList2} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="整改日期"
              name="整改日期"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            >
              <DatePicker allowClear={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="提交人"
              name="提交人"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="是否完成"
              name="是否完成"
              rules={[{ required: true }]}
            >
              <Select
                options={selectList2Option(tpm_details_opt["是否完成"])}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Space size={30}>
              <Button type="primary" onClick={submit} loading={btn_load}>
                提交
              </Button>
              <Button onClick={reset}>重置</Button>
              <Button onClick={onHide}>收起</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
