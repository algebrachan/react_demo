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
  Select,
  Checkbox,
  Typography,
  AutoComplete,
} from "antd";
import dayjs from "dayjs";
import {
  dateFormat,
  selectList2Option,
  selectList2OptionAll,
} from "../../../../utils/string";
import {
  ComputeFormCol,
  GenerateFormItem,
  ImageUpload,
} from "../../../../utils/obj";
import {
  spcGetTask,
  spcCreateCraftTask,
  commonUploadFile,
  taskOption,
} from "../../../../apis/nc_review_router";

const { RangePicker } = DatePicker;

const DispatchModal = ({
  open = false,
  data = {},
  onCancel,
  taskOpt = {},
  requestData,
}) => {
  const [tb_data, setTbData] = useState([]);

  const handleTableChange = (value, field, index) => {
    const newData = [...tb_data];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const columns = [
    { title: "晶体", key: "crystal", dataIndex: "crystal", width: 80 },
    {
      title: "检验类型",
      key: "inspection_type",
      dataIndex: "inspection_type",
      width: 80,
    },
    {
      title: "异常来源",
      key: "abnormal_source",
      dataIndex: "abnormal_source",
      width: 80,
    },
    {
      title: "任务名称",
      key: "task_name",
      dataIndex: "task_name",
      width: 160,
      render: (text, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          options={selectList2Option(taskOpt["任务名称"])}
          onChange={(val) => handleTableChange(val, "task_name", index)}
        />
      ),
    },
    {
      title: "检验分类",
      key: "inspection_classification",
      dataIndex: "inspection_classification",
      width: 120,
      render: (text, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          options={selectList2Option(taskOpt["检验分类"])}
          onChange={(val) =>
            handleTableChange(val, "inspection_classification", index)
          }
        />
      ),
    },
    {
      title: "质量分类",
      key: "quality_classification",
      dataIndex: "quality_classification",
      render: (text, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          options={selectList2Option(taskOpt["质量分类"])}
          onChange={(val) =>
            handleTableChange(val, "quality_classification", index)
          }
        />
      ),
    },
    {
      title: "质量描述",
      key: "description",
      dataIndex: "description",
      width: 160,
      render: (text, record, index) => (
        <Input.TextArea
          autoSize
          style={{ width: "100%" }}
          value={text}
          placeholder="请输入"
          onChange={(e) =>
            handleTableChange(e.target.value, "description", index)
          }
        />
      ),
    },
    {
      title: "质量图片",
      key: "img",
      dataIndex: "img",
      render: (x, record, index) => (
        <ImageUpload
          fileList={Array.isArray(record["img"]) ? record["img"] : []}
          setFileList={(fileList) => {
            const newData = [...tb_data];
            newData[index]["img"] = fileList;
            setTbData(newData);
            if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
              const formData = new FormData();
              formData.append("file", fileList[0].originFileObj);
              commonUploadFile(
                formData,
                (res) => {
                  const { code, data, msg } = res.data;
                  if (code === 0 && data) {
                    const { file_path = "" } = data;
                    const updatedData = [...tb_data];
                    updatedData[index]["file"] = file_path;
                    setTbData(updatedData);
                    message.success("文件上传成功");
                  } else {
                    message.error(msg || "文件上传失败");
                  }
                },
                () => {
                  message.error("网络异常");
                }
              );
            } else {
              const updatedData = [...tb_data];
              updatedData[index]["file"] = "";
              setTbData(updatedData);
            }
          }}
          maxCount={1}
        />
      ),
    },
    {
      title: "质量处置",
      key: "quality_disposal",
      dataIndex: "quality_disposal",
      render: (text, record, index) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          options={selectList2Option(["派发", "关闭"])}
          onChange={(val) => handleTableChange(val, "quality_disposal", index)}
        />
      ),
    },
  ];

  const handleOk = async () => {
    // 检查task_name是否为空
    const emptyTaskNameItems = tb_data.filter(
      (item) => !item.task_name || item.task_name.trim() === ""
    );
    if (emptyTaskNameItems.length > 0) {
      // 找到所有task_name为空的晶体名称
      const emptyCrystals = emptyTaskNameItems
        .map((item) => item.crystal)
        .join("、");
      message.error(
        `晶体 ${emptyCrystals} 的任务名称不能为空(任务名称在派工配置中配置)`
      );
      return; // 阻止继续执行
    }
    const param = {
      id: data["id"],
      task_items: tb_data,
      data: data["data"],
      abnormal_source: data["abnormal_source"],
    };
    spcCreateCraftTask(
      param,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("创建成功");
          onCancel();
          requestData();
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  useEffect(() => {
    if (open) {
      const temp_tb = data["abnormal_crystal"] || [];
      setTbData(
        temp_tb.map((item, _) => ({
          key: _,
          inspection_type: data["inspection_type"],
          abnormal_source: data["abnormal_source"],
          crystal: item,
          task_name: "",
          inspection_classification: "检验问题",
          quality_classification: "A",
          description: "",
          file: "",
          quality_disposal: "派发",
        }))
      );
    }
  }, [open]);

  return (
    <Modal
      title="派发工艺任务"
      open={open}
      onCancel={onCancel}
      getContainer={false}
      onOk={handleOk}
      width={1000}
    >
      <Flex vertical gap={10}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={tb_data}
          pagination={false}
        />
      </Flex>
    </Modal>
  );
};

function TaskAssignment() {
  const [form] = Form.useForm();
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [is_modal, setIsModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const [taskOpt, setTaskOpt] = useState({});
  const query = () => {
    const val = form.getFieldsValue();
    setTbLoad(true);
    spcGetTask(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setTbData(data);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
      }
    );
  };
  const initOpt = () => {
    taskOption(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setTaskOpt(data);
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
      title: "检验类型",
      dataIndex: "inspection_type",
      key: "inspection_type",
    },
    {
      title: "异常数量",
      dataIndex: "nums",
      key: "nums",
    },
    {
      title: "异常来源",
      dataIndex: "abnormal_source",
      key: "abnormal_source",
    },
    {
      title: "异常晶体",
      dataIndex: "abnormal_crystal",
      key: "abnormal_crystal",
      render: (x) => x && x.join(","),
    },
    {
      title: "是否创建派工任务",
      dataIndex: "is_create",
      key: "is_create",
      render: (x) => (x ? `是` : `否`),
    },
    {
      title: "检验派工时间",
      dataIndex: "create_at",
      key: "create_at",
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 100,
      render: (record) => (
        <>
          {!record["is_create"] && (
            <Button
              onClick={() => {
                setCurData(record);
                setIsModal(true);
              }}
            >
              派发工艺任务
            </Button>
          )}
        </>
      ),
    },
  ];
  const expandColumns = [
    { title: "晶片", dataIndex: "wafer", key: "wafer", width: 200 },
    { title: "晶体", dataIndex: "crystal", key: "crystal", width: 200 },
    { title: "检验时间", dataIndex: "dateTime", key: "dateTime", width: 200 },
    {
      title: "晶片类型",
      dataIndex: "wafer_type",
      key: "wafer_type",
      width: 200,
    },
    {
      title: "异常类型",
      key: "err_type",
      width: 400,
      render: (record) => {
        const filteredRecord = Object.entries(record)
          .filter(
            ([key]) =>
              !["wafer", "crystal", "dateTime", "wafer_type", "id"].includes(
                key
              )
          )
          .map(([k, v]) => `${k}: ${v}`)
          .join("\r\n");

        // 将过滤后的对象转换为JSON字符串并返回
        return <div style={{ whiteSpace: "pre-wrap" }}>{filteredRecord}</div>;
      },
    },
  ];
  const expandedRowRender = (record) => {
    return (
      <Table
        rowKey="id"
        size="small"
        bordered
        columns={expandColumns}
        dataSource={record["data"] || []}
        pagination={false}
      />
    );
  };

  useEffect(() => {
    initOpt();
    query();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "任务派发"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form
            layout="inline"
            form={form}
            initialValues={{
              time: [
                dayjs().subtract(1, "month").format(dateFormat),
                dayjs().format(dateFormat),
              ],
              inspection_type: "",
              crystal: "",
              abnormal_source: "",
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
              <Form.Item label="异常来源" name="abnormal_source">
                <Select
                  style={{ width: 120 }}
                  options={selectList2Option(taskOpt["异常来源"] || [])}
                />
              </Form.Item>
              <Form.Item label="检验类型" name="inspection_type">
                <Select
                  style={{ width: 120 }}
                  options={selectList2Option(taskOpt["检验类型"] || [])}
                />
              </Form.Item>
              <Form.Item label="晶体" name="crystal">
                <Input placeholder="请输入" />
              </Form.Item>
              <Button type="primary" onClick={query}>
                查询
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="id"
            bordered
            loading={tb_load}
            size="small"
            columns={columns}
            dataSource={tb_data}
            expandable={{
              expandedRowRender,
              //   expandedRowKeys: tb_data.map((e) => e.id),
              defaultExpandAllRows: true,
            }}
            scroll={{
              x: "max-content",
            }}
            pagination={pagination}
          />
        </Flex>
        <DispatchModal
          data={cur_data}
          open={is_modal}
          onCancel={() => setIsModal(false)}
          requestData={query}
          taskOpt={taskOpt}
        />
      </div>
    </div>
  );
}

export default TaskAssignment;
