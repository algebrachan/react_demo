import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import {
  selectList2Option,
  selectList2OptionAll,
} from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditSpecModal } from "./Modal";
import {
  deleteSpec,
  getSpecOptions,
  readSpec,
} from "../../../../apis/anls_router";

// 设备列表
function Specification() {
  const default_query_form = {
    工序: "",
    特征: "全部",
  };
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [craft, setCraft] = useState([]);
  const [feature, setFeature] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur_data, setCurData] = useState({});
  const [spec_modal, setSpecModal] = useState(false);
  const del = (record) => {
    deleteSpec(
      { id: record["id"] },
      (res) => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success("删除成功");
          requestData();
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
      "特征",
      "规格上限",
      "规格下限",
      "创建时间",
      "更新时间",
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
      key: "key",
      width: 50,
      render: (text, record, index) => index + 1,
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
              setSpecModal(true);
              setCurData({ name: "编辑", record });
            }}
          >
            修改
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
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
    };
  };
  const requestData = () => {
    const { 工序, 特征 } = form.getFieldsValue();
    setTbLoad(true);
    readSpec(
      { 工序, 特征 },
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data.length > 0) {
          setTbData(data);
        } else {
          message.error(msg);
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  const initOpt = () => {
    getSpecOptions(
      (res) => {
        const { code, data } = res.data;
        if (code === 0 && data) {
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
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 设置初始化数据
      const { search_params = {} } = query_opt;
      let c = Object.keys(search_params);
      setCraft(c);
      if (c.length > 0) {
        let f = search_params[c[0]];
        setFeature(f);
        form.setFieldsValue({
          工序: c[0],
        });
        requestData();
      }
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "spc规格配置"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
            <Form.Item label="工序" name="工序">
              <Select
                showSearch
                options={selectList2Option(craft)}
                style={{ width: 120 }}
                onChange={(val) => {
                  let f = query_opt["search_params"][val];
                  setFeature(f);
                  form.setFieldsValue({
                    特征: "全部",
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="特征" name="特征">
              <Select
                showSearch
                options={selectList2OptionAll(feature)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => requestData()}>
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCurData({ name: "新增", record: {} });
                  setSpecModal(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="id"
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
      <EditSpecModal
        open={spec_modal}
        onCancel={() => setSpecModal(false)}
        data={cur_data}
        query_opt={query_opt}
        requestData={() => requestData()}
      />
    </div>
  );
}

export default Specification;
