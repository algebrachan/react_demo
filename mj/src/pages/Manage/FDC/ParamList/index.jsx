import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ParamModal } from "./Modal";
import {
  deletePointPosition,
  getPointSearch,
  readPointPosition,
} from "../../../../apis/fdc_api";

function ParamList() {
  const default_query_form = {
    工厂: "全部",
    车间: "全部",
    工序: "全部",
    设备: "全部",
    状态: "全部",
  };
  const [query_opt, setQueryOpt] = useState({});
  const [factory_list, setFactoryList] = useState([]);
  const [ws_list, setWsList] = useState([]);
  const [process_list, setProcessList] = useState([]);
  const [dev_list, setDevList] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [param_modal, setParamModal] = useState(false);
  const [form] = Form.useForm();
  const del = (record) => {
    deletePointPosition(
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
      "工厂",
      "车间",
      "工序",
      "设备",
      "参数名",
      "参数类型",
      "点位开始地址",
      "点位长度",
      "类型",
      "点位状态",
      "报警状态",
      "描述",
      "添加时间",
      "更新时间",
      "更新人",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "点位状态" || e === "报警状态") {
        col.render = (x) => {
          return x ? "开启" : "关闭";
        };
      }
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (x) => x + 1,
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
              setParamModal(true);
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
    const { 工厂, 车间, 工序, 设备, 状态 } = form.getFieldsValue();
    let val = {
      工厂,
      车间,
      工序,
      设备名: 设备,
      状态,
      page,
      limit: size,
    };
    setTbLoad(true);
    readPointPosition(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data, length } = res.data;
        setTbTotal(length);
        if (code === 200) {
          setTbData(data);
        } else {
          message.error(msg);
          setTbData([]);
        }
      },
      () => {
        setTbTotal(0);
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  const initOpt = () => {
    getPointSearch(
      (res) => {
        const { code, msg, data } = res.data;
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
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 默认加载3个
      let {
        工厂: f = [],
        车间: w = [],
        工序 = [],
      } = JSON.parse(JSON.stringify(query_opt));
      f.unshift("全部");
      w.unshift("全部");
      let p = 工序.map((e) => e.name);
      p.unshift("全部");
      setFactoryList(f);
      setWsList(w);
      setProcessList(p);
      setDevList(["全部"]);
      requestData(cur, page_size);
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "参数管理"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
            <Form.Item label="工厂" name="工厂">
              <Select
                options={selectList2Option(factory_list)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="车间" name="车间">
              <Select
                options={selectList2Option(ws_list)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="工序" name="工序">
              <Select
                options={selectList2Option(process_list)}
                style={{ width: 120 }}
                onChange={(val) => {
                  form.setFieldsValue({ 设备: "全部" });
                  if (val === "全部") {
                    setDevList(["全部"]);
                  } else {
                    const { 工序 = [] } = query_opt;
                    let temp = 工序.filter((e) => e.name === val);
                    if (temp.length > 0) {
                      const { dev_list = [] } = JSON.parse(
                        JSON.stringify(temp[0])
                      );
                      dev_list.unshift("全部");
                      setDevList(dev_list);
                    } else {
                      setDevList(["全部"]);
                    }
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="设备" name="设备">
              <Select
                options={selectList2Option(dev_list)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="状态" name="状态">
              <Select
                options={[
                  { label: "全部", value: "全部" },
                  { label: "开启", value: 1 },
                  { label: "关闭", value: 0 },
                ]}
                style={{ width: 120 }}
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
                  setParamModal(true);
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
      <ParamModal
        open={param_modal}
        onCancel={() => setParamModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
        opt_obj={query_opt}
      />
    </div>
  );
}

export default ParamList;
