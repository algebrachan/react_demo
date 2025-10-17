import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import dayjs from "dayjs";
import { selectList2Option, dateFormat } from "../../../../utils/string";
import {
  DatePicker,
  Form,
  Select,
  Input,
  Space,
  Button,
  message,
  Table,
  Flex,
} from "antd";
import { spotCheckDatas, spotUserLotList } from "../../../../apis/search_api";
const { RangePicker } = DatePicker;

const default_query_form = {
  起止时间: [
    dayjs().subtract(30, "day").format(dateFormat),
    dayjs().format(dateFormat),
  ],
  提交人: "",
  流水号: "",
};

function InspectionRecord() {
  const [query_form] = Form.useForm();
  const [ipt_load, setIptLoad] = useState(false);
  const [option_obj, setOptionObj] = useState({});
  const [user, setUser] = useState([]);
  const [serial, setSerial] = useState([]);
  const [tb_head, setTbHead] = useState([]);
  const [tb_data1, setTbData1] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const getOpts = () => {
    const { 起止时间 = [] } = query_form.getFieldsValue();
    let val = {
      start_date: 起止时间[0],
      end_date: 起止时间[1],
    };
    setIptLoad(true);
    query_form.setFieldsValue({ 提交人: "", 流水号: "" });
    spotUserLotList(
      val,
      (res) => {
        const { options, code } = res.data;
        setIptLoad(false);
        if (code === "success") {
          let 提交人 = Object.keys(options);
          setUser(提交人);
          setOptionObj(options);
        } else {
          setUser([]);
          setOptionObj({});
        }
      },
      () => {
        setIptLoad(false);
        setUser([]);
        setOptionObj({});
      }
    );
  };
  const requestData = () => {
    const { 流水号 = "" } = query_form.getFieldsValue();
    if (!流水号) {
      message.warning("请选择流水号");
      return;
    }
    setTbLoad(true);
    spotCheckDatas(
      { spot_lot: 流水号 },
      (res) => {
        setTbLoad(false);
        const {
          code,
          bodyData = [],
          headData = [],
          history_data = [],
        } = res.data;
        if (code === "success") {
          message.success("查询成功");
          setTbHead(headData);
          setTbData1(bodyData);
          setTbData2(history_data);
        } else {
          setTbHead([]);
          setTbData1([]);
          message.error("查询失败");
        }
      },
      () => {
        setTbLoad(false);
        setTbHead([]);
        setTbData1([]);
        message.error("网络异常");
      }
    );
  };
  const pagination1 = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data1.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 100,
    };
  };
  const pagination2 = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data2.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 100,
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
      width: 50,
      title: "序号",
      dataIndex: "key",
      key: "key",
      render: (x) => x + 1,
    });
    return columns;
  };
  useEffect(() => {
    getOpts();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "巡检记录"]} />
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
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker
              onChange={() => getOpts()}
              style={{ width: 240 }}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="提交人" name="提交人">
            <Select
              loading={ipt_load}
              showSearch
              onChange={(val) => {
                setSerial(option_obj[val]);
                query_form.setFieldsValue({
                  流水号: option_obj[val][0] ? option_obj[val][0] : "",
                });
              }}
              options={selectList2Option(user)}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="流水号" name="流水号">
            <Select
              loading={ipt_load}
              showSearch
              options={selectList2Option(serial)}
              style={{ width: 250 }}
            />
          </Form.Item>
          <Space size={20}>
            <Button type="primary" loading={tb_load} onClick={requestData}>
              查询
            </Button>
          </Space>
        </Form>
        <GeneralCard name="巡检记录表">
          <Flex vertical>
            <Table
              bordered
              size="small"
              loading={tb_load}
              columns={generateColumns()}
              dataSource={tb_data1}
              scroll={{
                x: "max-content",
              }}
              pagination={pagination1()}
              style={{ padding: 10 }}
            />
            <Table
              bordered
              size="small"
              loading={tb_load}
              columns={generateColumns()}
              dataSource={tb_data2}
              scroll={{
                x: "max-content",
              }}
              pagination={pagination2()}
              style={{ padding: 10 }}
            />
          </Flex>
        </GeneralCard>
      </div>
    </div>
  );
}

export default InspectionRecord;
