import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { axisSearchCondition, delAxisRange, getAxisRange } from "../../../../apis/fdc_api";
import { Button, Flex, Form, message, Popconfirm, Select, Space, Table } from "antd";
import { selectList2Option, selectList2OptionAll } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditAxisModal } from "./Modal";

function AxisSet() {
  const [query_opt, setQueryOpt] = useState({});
  const [axis_modal,setAxisModal] = useState(false);
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [form] = Form.useForm();
  const initOpt = () => {
    axisSearchCondition(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 200 && data) {
          setQueryOpt(data);
        } else {
          setQueryOpt({});
        }
      },
      () => {
        setQueryOpt({});
      }
    );
  };
  const del = (record) => {
    delAxisRange(
      { id: record["id"] },
      (res) => {
        const { code, msg } = res.data;
        if (code === 200) {
          message.success("删除成功");
          requestData(cur, page_size);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络错误");
      }
    );
  };
  const generateColumns = () => {
    let columns = [
      "工序",
      "参数",
      "上限",'下限','更新时间'
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      fixed: "right",
      render: (record) => (
        <Space>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setAxisModal(true);
              setCurData({ name: "编辑", record });
            }}
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
  const pagination = () => {
    return {
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
        requestData(page, pageSize);
        // 请求数据
      },
    };
  };
  const requestData = (page, size) => {
    let val = form.getFieldsValue();
    val['page'] = page
    val['limit'] = size
    console.log(val)
    setTbLoad(true);
    getAxisRange(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data, length } = res.data;
        if (code === 200 && data) {
          setTbData(data);
          setTbTotal(length);
        } else {
          message.error(msg);
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    initOpt();
    requestData(cur, page_size)
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "坐标轴设置"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form
            form={form}
            initialValues={{ 工序: "全部", 参数: "全部" }}
            layout="inline"
          >
            <Form.Item label="工序" name="工序" rules={[{ required: true }]}>
              <Select
                options={selectList2OptionAll(query_opt["工序"])}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label="参数" name="参数" rules={[{ required: true }]}>
              <Select
                showSearch
                options={selectList2OptionAll(query_opt["参数"])}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() => requestData(cur, page_size)}
              >
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCurData({ name: "新增", record: {} });
                  setAxisModal(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form>
          <Table
            loading={tb_load}
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
          />
        </Flex>
      </div>
      <EditAxisModal
        open={axis_modal}
        onCancel={() => setAxisModal(false)}
        data={cur_data}
        query_opt={query_opt}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default AxisSet;
