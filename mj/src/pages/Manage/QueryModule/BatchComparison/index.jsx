import React, { useEffect, useState } from "react";
import { getSearchList } from "../../../../apis/anls_api";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Form, DatePicker, Select, Space, Button, Spin, Table } from "antd";
import dayjs from "dayjs";
import { selectList2Option } from "../../../../utils/string";
import { getBatchTable } from "../../../../apis/search_api";
const { RangePicker } = DatePicker;
const default_query_form = {
  起止时间: [
    dayjs().subtract(1, "month").format("YYYY-MM"),
    dayjs().format("YYYY-MM"),
  ],
  图号: "",
};

const CommonTable = ({ tb_load = false, tb_data = [], tb_head = [] }) => {
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
  const generateColumns = () => {
    let columns = tb_head.map((e, _) => {
      let col = {
        // width: 100,
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      width: 80,
      title: "序号",
      dataIndex: "key",
      key: "key",
      render: (x) => x + 1,
    });
    return columns;
  };
  return (
    <Table
      bordered
      loading={tb_load}
      size="small"
      columns={generateColumns()}
      dataSource={tb_data}
      scroll={{
        x: "max-content",
      }}
      pagination={pagination()}
    />
  );
};

function BatchComparison() {
  const [query_form] = Form.useForm();
  const [option_obj, setOptionObj] = useState({});
  const [tb_data, setTbData] = useState({});
  const [tb_load, setTbLoad] = useState(false);

  const requestData = () => {
    const { 起止时间 = [], 图号 = "" } = query_form.getFieldsValue();
    let val = {
      start_date: 起止时间[0],
      end_date: 起止时间[1],
      figure_number: 图号,
    };
    setTbLoad(true);
    getBatchTable(
      val,
      (res) => {
        setTbLoad(false);
        const { code, header_stats, head_data, table_data, table_stats } =
          res.data;
        setTbData({
          header_stats,
          head_data,
          table_data,
          table_stats,
        });
      },
      () => {
        setTbLoad(false);
        setTbData({});
      }
    );
  };
  const initOption = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 图号 = [] } = data;
          let val = {
            图号: 图号[0] ? 图号[0] : "",
          };
          query_form.setFieldsValue(val);
          setOptionObj(data);
        } else {
          setOptionObj({});
        }
      },
      () => {
        setOptionObj({});
      }
    );
  };
  useEffect(() => {
    if (Object.keys(option_obj).length > 0) requestData();
  }, [option_obj]);
  useEffect(() => {
    initOption();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "过程批次"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
        >
          <Form.Item
            label="起止时间"
            name="起止时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format("YYYY-MM"))
            }
          >
            <RangePicker
              style={{ width: 330 }}
              allowClear={false}
              format={"YYYY-MM"}
            />
          </Form.Item>
          <Form.Item label="图号" name="图号">
            <Select
              showSearch
              options={selectList2Option(option_obj["图号"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Space size={20}>
            <Button type="primary" onClick={requestData} loading={tb_load}>
              查询
            </Button>
          </Space>
        </Form>
        <CommonTable
          tb_data={tb_data["table_stats"]}
          tb_head={tb_data["header_stats"]}
          tb_load={tb_load}
        />
        <CommonTable
          tb_data={tb_data["table_data"]}
          tb_head={tb_data["head_data"]}
          tb_load={tb_load}
        />
        {/* <GeneralCard name="">
              <Table
                bordered
                loading={tb_load}
                size="small"
                columns={generateColumns()}
                dataSource={tb_data}
                scroll={{
                  x: "max-content",
                }}
                pagination={pagination()}
              />
            </GeneralCard> */}
      </div>
    </div>
  );
}

export default BatchComparison;
