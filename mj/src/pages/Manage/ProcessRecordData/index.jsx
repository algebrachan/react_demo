import React, { useState } from "react";
import { MyBreadcrumb } from "../../../components/CommonCard";
import {
  Button,
  Form,
  Tag,
  DatePicker,
  Select,
  Flex,
  Modal,
  Checkbox,
  Input,
  Table,
} from "antd";
import dayjs from "dayjs";
import {
  dateFormat,
  selectList2Option,
  selectList2OptionAll,
} from "../../../utils/string";
import {
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import {
  exportRongrongData,
  getRongrongLotnumbers,
  searchRongrongData,
} from "../../../apis/search_api";
import { message } from "antd";

const MACHINE_LIST = ["11", "12", "13", "14", "15"];
const BATCH_NUMBERS = [
  "BAT001",
  "BAT002",
  "BAT003",
  "BAT004",
  "BAT005",
  "BAT006",
  "BAT007",
];

const BatchModal = ({
  open = false,
  handleOk,
  onCancel,
  selected_list = [],
  batch_list = [],
}) => {
  const [form] = Form.useForm();
  const [opt_list, setOptList] = useState([]);
  const onOk = () => {
    const { 批号 = [] } = form.getFieldsValue();
    handleOk(批号);
  };
  const filterParam = () => {
    const { ipt } = form.getFieldsValue();
    const filteredList = batch_list.filter((item) =>
      // 假设过滤条件为特征名包含param_ipt（不区分大小写）
      item.toLowerCase().includes(ipt.toLowerCase())
    );
    setOptList(filteredList); // 更新表格数据
  };
  useEffect(() => {
    if (open) {
      setOptList(batch_list);
      form.setFieldsValue({ ipt: "", 批号: selected_list });
    }
  }, [open]);
  return (
    <Modal
      title="批号筛选"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={400}
      footer={[
        <Button
          type="link"
          key="selectAll"
          onClick={() => form.setFieldsValue({ 批号: opt_list })}
        >
          全部选择
        </Button>,
        <Button
          key="clear"
          type="link"
          danger
          onClick={() => form.setFieldsValue({ 批号: [] })}
        >
          清空选择
        </Button>,
        <Button key="ok" type="primary" onClick={onOk}>
          确认
        </Button>,
      ]}
    >
      <Form form={form} initialValues={{ ipt: "", 批号: [] }}>
        <Flex vertical gap={16}>
          <Form.Item name="ipt">
            <Input.Search placeholder="请输入参数" onSearch={filterParam} />
          </Form.Item>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <Form.Item name="批号">
              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                options={selectList2Option(opt_list)}
              />
            </Form.Item>
          </div>
        </Flex>
      </Form>
    </Modal>
  );
};

function ProcessRecordData() {
  const [form] = Form.useForm();
  const f_time = Form.useWatch("时间范围", form);
  const f_machine = Form.useWatch("机台", form);
  const [is_modal, setIsModal] = useState(false);
  const [batch_list, setBatchList] = useState([]);
  const [batch_spin, setBatchSpin] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [col, setCol] = useState([]);
  const [tb_data, setTbData] = useState([]);
  const [tb_spin, setTbSpin] = useState(false);
  const [tb_total, setTbTotal] = useState(0);
  const [exp_spin, setExpSpin] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const pagination = {
    current: cur,
    pageSize: page_size,
    position: ["bottomCenter"],
    total: tb_total,
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: (page, pageSize) => {
      setCur(page);
      setPageSize(pageSize);
      query(page, pageSize);
    },
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...col.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    })),
  ];

  const handleOk = (arr) => {
    setSelectedBatches(arr);
    setIsModal(false);
  };
  const query = async (page, size) => {
    const values = form.getFieldsValue();
    values["批号"] = selectedBatches;
    values["page"] = page;
    values["size"] = size;
    setTbSpin(true);
    searchRongrongData(
      values,
      (res) => {
        setTbSpin(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { columns, total } = data;
          setTbData(data["data"] || []);
          setCol(columns);
          setTbTotal(total);
        } else {
          setTbData([]);
          setCol([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbSpin(false);
        setTbData([]);
        setCol([]);
        setTbTotal(0);
      }
    );
  };
  const exportData = () => {
    const values = form.getFieldsValue();
    values["批号"] = selectedBatches;
    setExpSpin(true);
    exportRongrongData(
      values,
      (res) => {
        setExpSpin(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { url = "" } = data;
          Modal.confirm({
            title: "跳转提醒",
            content: `打开链接: ${url}`,
            onOk: () => {
              window.open(url, "_blank");
            },
            okText: "确认",
          });
        } else {
          message.error(msg);
        }
      },
      () => {
        setExpSpin(false);
        message.error("导出失败");
      }
    );
  };
  const getBatchList = () => {
    const { 时间范围, 机台 } = form.getFieldsValue();
    setSelectedBatches([]);
    setBatchSpin(true);
    getRongrongLotnumbers(
      { 时间范围, 机台 },
      (res) => {
        setBatchSpin(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { lotnumbers = [] } = data;
          setBatchList(lotnumbers);
        } else {
          setBatchList([]);
        }
      },
      () => {
        setBatchSpin(false);
        setBatchList([]);
      }
    );
  };

  useEffect(() => {
    if (f_time && f_machine) {
      getBatchList();
    }
  }, [f_time, f_machine]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "加工记录数据管理"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={form}
          initialValues={{
            时间范围: [
              dayjs().subtract(7, "day").format(dateFormat),
              dayjs().format(dateFormat),
            ],
            机台: "11",
          }}
        >
          <Flex gap={20}>
            <Form.Item
              label="时间范围"
              name="时间范围"
              getValueProps={(value) => {
                return {
                  value: value && value.map((e) => dayjs(e)),
                };
              }}
              normalize={(value) =>
                value && value.map((e) => dayjs(e).format(dateFormat))
              }
            >
              <DatePicker.RangePicker
                allowClear={false}
                format={dateFormat}
                style={{ width: 240 }}
                placeholder={["开始日期", "结束日期"]}
              />
            </Form.Item>
            <Form.Item label="机台" name="机台">
              <Select
                options={selectList2OptionAll(MACHINE_LIST)}
                style={{ width: 100 }}
              />
            </Form.Item>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsModal(true)}
              loading={batch_spin}
            >
              批号筛选
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                setCur(1);
                query(1, page_size);
              }}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                setSelectedBatches([]);
                form.resetFields();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportData}
              loading={exp_spin}
            >
              导出数据
            </Button>
          </Flex>
        </Form>
        <Flex wrap gap={8}>
          {selectedBatches.length > 0 ? (
            selectedBatches.map((batch) => (
              <Tag
                key={batch}
                closable
                onClose={() => {
                  setSelectedBatches(
                    selectedBatches.filter((item) => item !== batch)
                  );
                }}
                color="blue"
              >
                {batch}
              </Tag>
            ))
          ) : (
            <span style={{ color: "#999" }}>未选择任何批号</span>
          )}
        </Flex>
        <Table
          rowKey="id"
          loading={tb_spin}
          size="small"
          columns={columns}
          dataSource={tb_data}
          bordered
          scroll={{
            x: "max-content",
          }}
          pagination={pagination}
        />
      </div>
      <BatchModal
        open={is_modal}
        handleOk={handleOk}
        onCancel={() => setIsModal(false)}
        selected_list={selectedBatches}
        batch_list={batch_list}
      />
    </div>
  );
}

export default ProcessRecordData;
