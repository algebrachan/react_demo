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
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { EditModal } from "./Modal";
import {
  deleteSpecifications,
  getSpcSpecification,
  getSpcSpecificationOptions,
} from "../../../../apis/spc_api";

const default_query_form = {
  图号: "全部",
  参数: "全部",
  控制图: "全部",
  报警等级: "全部",
};

function SpecificMaintain() {
  const [form] = Form.useForm();
  const [origin_opt, setOriginOpt] = useState({});
  const [query_opt, setQueryOpt] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [edit_modal, setEditModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const del = (record) => {
    const { id = "" } = record;
    deleteSpecifications(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          requestData(cur, page_size);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const generateColumns = () => {
    let columns = [
      "图号",
      "参数",
      "控制图",
      "usl",
      "ucl",
      "cl",
      "lcl",
      "lsl",
      "状态",
      "类型",
      "报警等级",
      "更新时间",
      "更新人",
      "说明",
      "备注",
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
      render: (x) => x + 1,
    });
    columns.push({
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 150,
      render: (record) => (
        <Space>
          {/* <Button style={{ padding: 0 }} type="link" icon={<EyeOutlined />}>
            查看
          </Button> */}
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setCurData({ name: "编辑", record });
              setEditModal(true);
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
    val["skip"] = page - 1;
    val["limit"] = size;
    setTbLoad(true);
    getSpcSpecification(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list, total } = data;
          setTbData(data_list);
          setTbTotal(total);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setTbTotal(0);
      }
    );
  };
  const initOpt = () => {
    getSpcSpecificationOptions(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setOriginOpt(data);
          const {
            参数 = [],
            图号 = [],
            报警等级 = [],
            控制图 = [],
          } = JSON.parse(JSON.stringify(data));
          参数.unshift("全部");
          图号.unshift("全部");
          报警等级.unshift("全部");
          控制图.unshift("全部");
          setQueryOpt({ 参数, 图号, 报警等级, 控制图 });
          // 设置form
        } else {
          setOriginOpt({});
          setQueryOpt({});
        }
      },
      () => {
        setOriginOpt({});
        setQueryOpt({});
      }
    );
  };
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      requestData(cur, page_size);
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "规格维护"]} />
      <div className="content_root">
        <Flex gap={10} vertical>
          <Form
            form={form}
            initialValues={default_query_form}
            layout="inline"
            style={{ padding: 10 }}
          >
            {["图号", "参数", "控制图", "报警等级"].map((e, _) => (
              <Form.Item name={e} label={e} key={_}>
                <Select
                  showSearch={e === "图号"}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 150 }}
                />
              </Form.Item>
            ))}
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
                  setEditModal(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form>
          <Table
            loading={tb_load}
            bordered
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            pagination={pagination()}
            scroll={{
              x: "max-content",
            }}
          />
        </Flex>
      </div>
      <EditModal
        open={edit_modal}
        data={cur_data}
        query_opt={origin_opt}
        onCancel={() => setEditModal(false)}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default SpecificMaintain;
