import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, DatePicker, Form, message, Select, Space, Table } from "antd";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import dayjs from "dayjs";
import { getSearchList } from "../../../../apis/anls_api";
import {
  getOcapWarningList,
  exportAnomalyReport,
} from "../../../../apis/ocap_api";
import "./eh.less";
import { downloadFile } from "../../../../utils/obj";
const { RangePicker } = DatePicker;

const default_query_form = {
  起止时间: [
    dayjs().subtract(2, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  图号: "全部",
  状态: "全部",
  处理方式: "全部",
  机台: [],
  特征: [],
  判异规则: [],
};

function ErrHandle() {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [option_obj, setOptionObj] = useState({
    图号: [],
    状态: [
      "全部",
      "异常预警",
      "原因分析",
      "原因分类",
      "对策提交",
      "实验验证",
      "质量确认",
      "关闭",
    ],
    处理方式: ["全部", "特采", "改型", "返工"],
    机台: [],
    特征: [],
    判异规则: [],
  });
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };
  const initOpt = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 图号: p = [], 判异规则 = [], 特征 = [], 机台 = [] } = data;
          p.unshift("全部");

          setOptionObj((pre) => ({ ...pre, 图号: p, 判异规则, 特征, 机台 }));
        } else {
          setOptionObj({});
        }
      },
      () => {
        setOptionObj({});
      }
    );
  };
  const columns = [
    {
      title: "序号",
      key: "idx",
      width: 60,
      render: (_, record, idx) => idx + 1,
    },
    {
      title: "异常批号",
      dataIndex: "异常批号",
      key: "异常批号",
      width: 160,
    },
    {
      title: "异常时间",
      dataIndex: "异常时间",
      key: "异常时间",
      width: 120,
    },
    {
      title: "图号",
      dataIndex: "图号",
      key: "图号",
      width: 120,
    },
    {
      title: "特征",
      dataIndex: "特征",
      key: "特征",
      width: 120,
    },
    {
      title: "判异规则",
      dataIndex: "判异规则",
      key: "判异规则",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "状态",
      key: "状态",
      width: 120,
    },
    {
      title: "处理用时",
      dataIndex: "处理用时",
      key: "处理用时",
      width: 120,
    },
    {
      title: "紧急程度",
      dataIndex: "紧急程度",
      key: "紧急程度",
      width: 120,
    },
    {
      title: "指定人",
      dataIndex: "指定人",
      key: "指定人",
      width: 120,
    },
    {
      title: "异常现象",
      dataIndex: "异常现象",
      key: "异常现象",
      width: 120,
    },
    {
      title: "异常原因",
      dataIndex: "异常原因",
      key: "异常原因",
      width: 120,
    },
    {
      title: "异常原因分类",
      dataIndex: "异常原因分类",
      key: "异常原因分类",
      width: 120,
    },
    {
      title: "对策",
      dataIndex: "对策",
      key: "对策",
      width: 120,
    },
    {
      title: "责任部门",
      dataIndex: "责任部门",
      key: "责任部门",
      width: 120,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 60,
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              const newWindow = window.open(
                `/mng/err_handle_ocap?id=${record._id}`,
                "_blank"
              );
            }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = () => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    getOcapWarningList(
      val,
      (res) => {
        setTbLoad(false);
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          // 过滤判异规则
          setTbData(data_list);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  const download = () => {
    let val = form.getFieldsValue();
    exportAnomalyReport(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { url } = data;
          downloadFile(url);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("导出失败");
      }
    );
  };
  useEffect(() => {
    requestData();
    initOpt();
  }, []);

  return (
    <div className="err_handle_root">
      <MyBreadcrumb items={[window.sys_name, "异常处理"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form layout="inline" form={form} initialValues={default_query_form}>
          <Form.Item
            label="起止时间"
            name="起止时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(timeFormat))
            }
          >
            <RangePicker showTime style={{ width: 330 }} allowClear={false} />
          </Form.Item>
          <Form.Item label="图号" name="图号">
            <Select
              showSearch
              options={selectList2Option(option_obj["图号"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="状态" name="状态">
            <Select
              options={selectList2Option(option_obj["状态"])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="处理方式" name="处理方式">
            <Select
              options={selectList2Option(option_obj["处理方式"])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="机台" name="机台">
            <Select
              mode="multiple"
              maxTagCount="responsive"
              options={selectList2Option(option_obj["机台"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="特征" name="特征">
            <Select
              mode="multiple"
              maxTagCount="responsive"
              options={selectList2Option(option_obj["特征"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="判异规则" name="判异规则">
            <Select
              mode="multiple"
              maxTagCount="responsive"
              options={selectList2Option(option_obj["判异规则"])}
              style={{ width: 140 }}
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={requestData}>
              查询
            </Button>
            <Button onClick={download}>下载</Button>
          </Space>
        </Form>
        <Table
          bordered
          loading={tb_load}
          size="small"
          columns={columns}
          dataSource={tb_data}
          scroll={{
            x: "max-content",
          }}
          pagination={pagination()}
        />
      </div>
    </div>
  );
}

export default ErrHandle;
