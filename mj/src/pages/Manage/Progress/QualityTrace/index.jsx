import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Button,
  message,
  Flex,
  Table,
  Row,
  Col,
  Input,
} from "antd";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import { useDispatch } from "react-redux";
import { setCommonParam } from "../../mngSlice";
import dayjs from "dayjs";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import {
  getCrInspectionForm,
  getLotId,
  getSearchList,
} from "../../../../apis/anls_api";
import { LineChart } from "./Chart";

const { RangePicker } = DatePicker;

const default_query_form = {
  时间: [
    dayjs().subtract(15, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  工厂: "",
  车间: "",
  工序: "",
  机台: [],
  图号: "",
  坩埚编号: "",
};

// 品质追溯
function QualityTrace() {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState("");
  const dispatch = useDispatch();
  const [option_obj, setOptionObj] = useState({});
  const [lotid_obj, setLotidObj] = useState({});
  const [draw_list, setDrawList] = useState([]); // 图号
  const [fur_list, setFurList] = useState([]); // 坩埚
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const initOption = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 工厂, 工序, 机台 = [], 车间, 图号 } = data;
          let val = {
            工厂: 工厂[0] ? 工厂[0] : "",
            工序: 工序[0] ? 工序[0] : "",
            机台,
            车间: 车间[0] ? 车间[0] : "",
            图号: 图号[0] ? 图号[0] : "",
          };
          let draw_list = 图号;
          draw_list.unshift("全部")
          setDrawList(draw_list);
          form.setFieldsValue(val);
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
  const reqeustTable = (val) => {
    setTbLoad(true);
    getCrInspectionForm(
      val,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
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
  const query = () => {
    const { 时间, 工厂, 车间, 工序, 机台, 图号, 坩埚编号 } =
      form.getFieldsValue();
    if (图号 === "" || 坩埚编号 === "") {
      message.warning("图号or坩埚编号不能为空");
      return;
    }
    let val = {
      时间,
      工厂,
      车间,
      工序,
      机台,
      图号,
      坩埚编号,
    };
    reqeustTable({ 机台, 坩埚编号 });
    dispatch(
      setCommonParam({
        param_name: "quality_form",
        param_val: val,
      })
    );
    setFlag(!flag);
  };
  const columns = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
      width: 60,
      render: (x) => x + 1,
    },
    {
      title: "产品加工编号",
      key: "产品加工编号",
      dataIndex: "产品加工编号",
      width: 120,
    },
    {
      title: "外径(mm)",
      children: [
        {
          title: "D1",
          key: "D1",
          dataIndex: "D1",
          width: 60,
        },
        {
          title: "D2",
          key: "D2",
          dataIndex: "D2",
          width: 60,
        },
        {
          title: "D3",
          key: "D3",
          dataIndex: "D3",
          width: 60,
        },
      ],
    },
    {
      title: "厚度(mm)",
      children: [
        {
          title: "T1",
          key: "T1",
          dataIndex: "T1",
          width: 60,
        },
        {
          title: "T2",
          key: "T2",
          dataIndex: "T2",
          width: 60,
        },
        {
          title: "T3",
          key: "T3",
          dataIndex: "T3",
          width: 60,
        },
        {
          title: "TR",
          key: "TR",
          dataIndex: "TR",
          width: 60,
        },
        {
          title: "B",
          key: "B",
          dataIndex: "B",
          width: 60,
        },
      ],
    },
    {
      title: "透明层厚",
      children: [
        {
          title: "TT1(mm)",
          key: "TT1(mm)",
          dataIndex: "TT1(mm)",
          width: 80,
        },
      ],
    },
    {
      title: "间隙",
      children: [
        {
          title: "BG(mm)",
          key: "BG(mm)",
          dataIndex: "BG(mm)",
          width: 80,
        },
        {
          title: "RG(mm)",
          key: "RG(mm)",
          dataIndex: "RG(mm)",
          width: 80,
        },
      ],
    },
    {
      title: "微气泡",
      children: [
        {
          title: "W0",
          key: "W0",
          dataIndex: "W0",
          width: 60,
        },
        {
          title: "R0",
          key: "R0",
          dataIndex: "R0",
          width: 60,
        },
      ],
    },
    {
      title: "判定",
      key: "判定",
      dataIndex: "判定",
      width: 60,
    },
    {
      title: "备注",
      key: "备注",
      dataIndex: "备注",
      width: 100,
    },
  ];
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
  useEffect(() => {
    if (Object.keys(lotid_obj).length > 0) {
      query();
    }
  }, [lotid_obj]);
  useEffect(() => {
    initOption();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={["熔融机过程分析", "品质追溯"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form layout="inline" form={form} initialValues={default_query_form}>
            <Form.Item
              label="时间"
              name="时间"
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
            <Form.Item label="工厂" name="工厂">
              <Select
                options={selectList2Option(option_obj["工厂"])}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="车间" name="车间">
              <Select
                options={selectList2Option(option_obj["车间"])}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="工序" name="工序">
              <Select
                options={selectList2Option(option_obj["工序"])}
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
            <Form.Item label="图号" name="图号">
              <Select
                showSearch
                options={selectList2Option(draw_list)}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label="坩埚编号" name="坩埚编号">
              <Input placeholder="请输入坩埚编号"/>
            </Form.Item>
            <Button type="primary" onClick={query}>
              查询
            </Button>
          </Form>
          <GeneralCard name="石英坩埚工程检查表">
            <Table
              size="small"
              className="common_table_root of"
              loading={tb_load}
              columns={columns}
              dataSource={tb_data}
              bordered
              scroll={{
                x: "max-content",
                y: 180,
              }}
              pagination={pagination()}
            />
          </GeneralCard>
          {/* <GeneralCard name="原料数据追溯">
            <div
              style={{
                height: 150,
                width: "100%",
                textAlign: "center",
              }}
            >
              原料数据未录入
            </div>
          </GeneralCard> */}
          <GeneralCard name="过程数据追溯">
            <Row gutter={[10, 10]} style={{ padding: 10 }}>
              <Col span={8}>
                <LineChart title="模具真空压力" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="功率" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="电极开闭位置" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="电极升降位置" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="模具出水流量" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="下隔热板位置" flag={flag} tab="总览" />
              </Col>
              <Col span={8}>
                <LineChart title="A相电流偏差" flag={flag} tab="电流" />
              </Col>
              <Col span={8}>
                <LineChart title="B相电流偏差" flag={flag} tab="电流" />
              </Col>
              <Col span={8}>
                <LineChart title="C相电流偏差" flag={flag} tab="电流" />
              </Col>
              <Col span={8}>
                <LineChart title="A相电流" flag={flag} tab="电流" />
              </Col>
              <Col span={8}>
                <LineChart title="B相电流" flag={flag} tab="电流" />
              </Col>
              <Col span={8}>
                <LineChart title="C相电流" flag={flag} tab="电流" />
              </Col>
            </Row>
          </GeneralCard>
          {/* <GeneralCard name="过程数据分析">
            <div
              style={{
                height: 150,
                width: "100%",
                textAlign: "center",
              }}
            >
              数据未录入
            </div>
          </GeneralCard> */}
        </Flex>
      </div>
    </div>
  );
}

export default QualityTrace;
