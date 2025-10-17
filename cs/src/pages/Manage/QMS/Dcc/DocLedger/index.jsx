import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import { dateFormat, selectList2OptionAll } from "../../../../../utils/string";
import { useNavigate } from "react-router-dom";
import {
  qmsDccFileUrl,
  qmsDccGetFileList,
  qmsDccGetFilesUrl,
  qmsDccUploadTrainingRecords,
} from "../../../../../apis/nc_review_router";
import { FileUpload } from "../../../../../utils/obj";
import { DEPARTMENT_LIST, FILE_RANK } from "../Bpm/common";
import { getSession } from "../../../../../utils/storage";
const { RangePicker } = DatePicker;

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

const CTRL_LIST = ["11004024"];
const PreviewModal = ({
  open = false,
  onCancel = () => {},
  data = [],
  ctrl = false,
}) => {
  const [ctrl_name, setCtrlName] = useState("");
  const [tb_data, setTbData] = useState([]);
  const columns = [
    // {
    //   title: "序号",
    //   dataIndex: "key",
    //   key: "key",
    //   width: 60,
    //   render: (_, __, index) => index + 1,
    // },
    {
      title: "文件名",
      dataIndex: "文件名",
      key: "文件名",
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size={20}>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => window.open(record["文件预览路径"], "_blank")}
          >
            预览
          </Button>
          {(!ctrl || CTRL_LIST.includes(ctrl_name)) && (
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                window.open(record["文件下载路径"], "_blank");
              }}
            >
              下载
            </Button>
          )}
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (open) {
      const tb_temp = data.map((item, index) => ({ ...item, key: index + 1 }));
      setTbData(tb_temp);
    } else {
      setTbData([]);
    }
  }, [data, open]);
  useEffect(() => {
    const user_str = getSession("user_info");
    const { username = "" } = JSON.parse(user_str);
    setCtrlName(username);
  }, []);
  return (
    <Modal
      title="文件预览"
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      width={600}
    >
      <Table
        bordered
        size="small"
        columns={columns}
        pagination={false}
        dataSource={tb_data}
      />
    </Modal>
  );
};
const UploadFileModal = ({
  open = false,
  onCancel = () => {},
  data = {},
  requestData = () => {},
}) => {
  const [file_list, setFileList] = useState([]);
  const [load, setLoad] = useState(false);

  const handleOk = async () => {
    if (file_list.length === 0) return message.error("请上传文件");
    const formData = new FormData();
    const values = { _id: data["_id"] };
    formData.append("request_data", JSON.stringify(values));
    file_list.forEach((file, index) => {
      const fileBlob = new Blob([file.originFileObj], {
        type: file.type,
      });
      // 使用带索引的键名，避免覆盖
      formData.append("files", fileBlob, file.name);
    });
    setLoad(true);
    qmsDccUploadTrainingRecords(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          onCancel();
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    if (open) {
    }
  }, [open]);
  return (
    <Modal
      title="培训记录上传"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={400}
    >
      <Spin spinning={load}>
        <FileUpload
          fileList={file_list}
          setFileList={setFileList}
          maxCount={10}
          listType="txt"
          accept=".pdf,image/*"
        />
      </Spin>
    </Modal>
  );
};

function DocLedger() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState();
  const [tb_load, setTbLoad] = useState(false);
  const [file_preview, setFilePreview] = useState([]);
  const [is_preview, setIsPreview] = useState(false);
  const [ctrl, setCtrl] = useState(false);
  const [is_upload, setIsUpload] = useState(false);
  const [cur_data, setCurData] = useState({});
  const query = () => {
    const val = form.getFieldsValue();
    setTbLoad(true);
    qmsDccGetFileList(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { file_list } = data;
          setTbData(file_list);
        } else {
          setTbData([]);
          message.error(msg);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  const handleScan = (file_list = []) => {
    if (file_list.length === 0) return message.warning("没有文件");
    qmsDccGetFilesUrl(
      { file_list },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list = [] } = data;
          setFilePreview(data_list);
          setIsPreview(true);
        } else {
          message.error(msg);
        }
      },
      () => {}
    );
  };
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "流程单号",
      dataIndex: "流程单号",
      key: "流程单号",
      width: 100,
      render: (x) => (
        <Button
          type="link"
          onClick={() =>
            navigate("/mng/qms_dcc/bpm", {
              state: { 流程单号: x },
            })
          }
        >
          {x}
        </Button>
      ),
    },
    ...[
      "文件名称",
      "文件编号",
      "归档部门",
      "归档人",
      "生效日期",
      "有效/废止",
      "备注",
    ].map((x) => ({
      title: x,
      dataIndex: x,
      key: x,
    })),
    {
      title: "版本",
      dataIndex: "版本",
      key: "版本",
      render: (x) => x && x[1],
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 160,
      render: (record) => (
        <Space>
          <Button
            onClick={() => {
              const {
                文件名称: 文件名 = "",
                文件预览路径 = "",
                文件下载路径 = "",
                附件信息 = [],
              } = record;
              const file_list = [
                { 文件名, 文件预览路径, 文件下载路径 },
                ...附件信息.map((x) => ({
                  文件名: x.附件,
                  文件预览路径: x.文件下载路径,
                  文件下载路径: x.文件下载路径,
                })),
              ];
              setCtrl(true);
              handleScan(file_list);
            }}
          >
            查看
          </Button>
          <Button
            onClick={() =>
              navigate("/mng/qms_dcc/bpm", {
                state: {
                  单号: "",
                  file_jump: {
                    文件申请类型: "更改",
                    四级文件信息: record["四级文件信息"],
                    附件信息: record["附件信息"],
                    文件职能: record["文件职能"],
                    文件级别: record["文件级别"],
                    归档部门: record["归档部门"],
                    保密等级: record["保密等级"],
                    更改前文件名称: record["文件名称"],
                    更改前文件编号: record["文件编号"],
                    更改前文件版本: record["版本"],
                    更改后文件编号: record["文件编号"],
                    更改后文件版本: incrementVersion(record["版本"]),
                  },
                },
              })
            }
          >
            升级
          </Button>
          <Button
            danger
            onClick={() =>
              navigate("/mng/qms_dcc/bpm", {
                state: {
                  单号: "",
                  file_jump: {
                    文件申请类型: "作废",
                    文件职能: record["文件职能"],
                    文件级别: record["文件级别"],
                    保密等级: record["保密等级"],
                    需作废文件名称: record["文件名称"],
                    需作废文件编号: record["文件编号"],
                    需作废文件版本: record["版本"],
                  },
                },
              })
            }
          >
            作废
          </Button>
        </Space>
      ),
    },
    {
      title: "培训记录",
      key: "培训记录",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          {record["培训记录"].length > 0 ? (
            <Button
              onClick={() => {
                setCtrl(false);
                handleScan(record["培训记录"] || []);
              }}
            >
              查看
            </Button>
          ) : (
            <Button
              onClick={() => {
                setCurData(record);
                setIsUpload(true);
              }}
            >
              上传文件
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const expandColumns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...["四级文件", "表单编号", "版本"].map((x) => ({
      title: x,
      dataIndex: x,
      key: x,
      width: 100,
    })),
    {
      title: "操作",
      key: "opt",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              const {
                四级文件 = "",
                文件预览路径 = "",
                文件下载路径 = "",
              } = record;
              const file_list = [
                { 文件名: 四级文件, 文件预览路径, 文件下载路径 },
              ];
              setCtrl(false);
              handleScan(file_list);
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];
  const expandable = {
    expandedRowRender: (record) => (
      <Table
        rowKey="表单编号"
        size="small"
        bordered
        columns={expandColumns}
        dataSource={record["四级文件信息"] || []}
        pagination={false}
      />
    ),
    rowExpandable: (record) => record.四级文件信息.length > 0,
  };

  useEffect(() => {
    query();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "DCC", "文件管理"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form
            layout="inline"
            form={form}
            initialValues={{
              快捷检索: 1,
              时间: [
                dayjs().subtract(1, "month").format(dateFormat),
                dayjs().format(dateFormat),
              ],
              关键字: "",
              归档部门: "全部",
              文件级别: "全部",
            }}
          >
            <Flex gap={16}>
              <Form.Item label="快捷检索" name="快捷检索">
                <Select
                  style={{ width: 100 }}
                  options={[
                    { label: "一月", value: 1 },
                    { label: "三月", value: 3 },
                    { label: "半年", value: 6 },
                    { label: "一年", value: 12 },
                  ]}
                  onChange={(val) => {
                    form.setFieldsValue({
                      时间: [
                        dayjs().subtract(val, "month").format(dateFormat),
                        dayjs().format(dateFormat),
                      ],
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="关键字" name="关键字">
                <Input />
              </Form.Item>
              <Form.Item label="归档部门" name="归档部门">
                <Select
                  style={{ width: 160 }}
                  options={selectList2OptionAll(DEPARTMENT_LIST)}
                />
              </Form.Item>
              <Form.Item label="文件级别" name="文件级别">
                <Select
                  style={{ width: 160 }}
                  options={selectList2OptionAll(FILE_RANK)}
                />
              </Form.Item>
              <Form.Item
                label="时间"
                name="时间"
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
              <Button type="primary" onClick={query}>
                查询
              </Button>
            </Flex>
          </Form>
          <Table
            rowKey="_id"
            bordered
            loading={tb_load}
            size="small"
            columns={columns}
            dataSource={tb_data}
            expandable={expandable}
            scroll={{
              x: "max-content",
            }}
            pagination={pagination}
          />
        </Flex>
        <PreviewModal
          open={is_preview}
          onCancel={() => setIsPreview(false)}
          data={file_preview}
          ctrl={ctrl}
        />
        <UploadFileModal
          requestData={query}
          open={is_upload}
          onCancel={() => setIsUpload(false)}
          data={cur_data}
        />
        {/* <div contentEditable="true">可编辑内容区域</div> */}
      </div>
    </div>
  );
}

export default DocLedger;
