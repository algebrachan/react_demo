import React, { useEffect, useState } from "react";
import {
  Form,
  Tabs,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  message,
  Input,
} from "antd";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { LineChart } from "./Chart";
import { useDispatch } from "react-redux";
import { setCommonParam } from "../../mngSlice";
import dayjs from "dayjs";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import { getLotId, getSearchList } from "../../../../apis/anls_api";
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

function SingleProcessAnalysis() {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState("");
  const dispatch = useDispatch();
  const [option_obj, setOptionObj] = useState({});
  const [lotid_obj, setLotidObj] = useState({});
  const [draw_list, setDrawList] = useState([]); // 图号
  const [fur_list, setFurList] = useState([]); // 坩埚编号
  const tabs_items = [
    {
      key: "1",
      label: "总览",
      children: (
        <Row gutter={[16, 16]} className="chart_root">
          <Col span={8}>
            <LineChart
              title_list={["模具真空压力", "真空泵运行频率"]}
              flag={flag}
              tab="总览"
            />
          </Col>
          <Col span={8}>
            <LineChart title_list={["功率"]} flag={flag} tab="总览" />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["A相电流", "B相电流", "C相电流"]}
              flag={flag}
              tab="总览"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={[
                "电极升降位置",
                "电极开闭位置",
                "电极开闭速度",
                "电极开闭状态",
                "电极升降状态",
              ]}
              flag={flag}
              tab="总览"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["模具出水流量", "模具出水温度"]}
              flag={flag}
              tab="总览"
            />
          </Col>
          <Col span={8}>
            <LineChart title_list={["下隔热板位置"]} flag={flag} tab="总览" />
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "电流",
      children: (
        <Row gutter={[16, 16]} className="chart_root">
          <Col span={8}>
            <LineChart title_list={["A相电流偏差"]} flag={flag} tab="电流" />
          </Col>
          <Col span={8}>
            <LineChart title_list={["B相电流偏差"]} flag={flag} tab="电流" />
          </Col>
          <Col span={8}>
            <LineChart title_list={["C相电流偏差"]} flag={flag} tab="电流" />
          </Col>
          <Col span={8}>
            <LineChart title_list={["A相电流"]} flag={flag} tab="电流" />
          </Col>
          <Col span={8}>
            <LineChart title_list={["B相电流"]} flag={flag} tab="电流" />
          </Col>
          <Col span={8}>
            <LineChart title_list={["C相电流"]} flag={flag} tab="电流" />
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "电极",
      children: <>电极</>,
    },
    {
      key: "4",
      label: "水流-水温",
      children: (
        <Row gutter={[16, 16]} className="chart_root">
          <Col span={8}>
            <LineChart
              title_list={["模具进出水流量"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["铜电极流量"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["下隔热板水流量"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["模具进出水温度"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["铜电极水温"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
          <Col span={8}>
            <LineChart
              title_list={["下隔热板水温"]}
              flag={flag}
              tab="水流-水温"
            />
          </Col>
        </Row>
      ),
    },
    {
      key: "5",
      label: "其他",
      children: <div>其他</div>,
    },
  ];
  const initOption = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 工厂, 工序, 机台 = [], 车间, 图号 } = data;
          let val = {
            工厂: 工厂[0] ? 工厂[0] : "",
            工序: 工序[0] ? 工序[0] : "",
            机台: 机台,
            车间: 车间[0] ? 车间[0] : "",
            图号: 图号[0] ? 图号[0] : ""
          };
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
  const getId = () => {
    const { 时间, 工厂, 车间, 工序, 机台 } = form.getFieldsValue();
    form.setFieldsValue({ 图号: "", 坩埚编号: "" });
    setDrawList([]);
    setFurList([]);
    let val = {
      开始时间: 时间[0],
      结束时间: 时间[1],
      工厂,
      车间,
      工序,
      机台,
    };
    getLotId(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          setLotidObj(data);
          let draw_list = Object.keys(data);
          let fur_list = [];
          if (draw_list.length > 0) {
            fur_list = data[draw_list[0]].map((e) => e.id);
            setFurList(fur_list);
          }
          form.setFieldsValue({
            图号: draw_list[0] ? draw_list[0] : "",
            坩埚编号: fur_list ? fur_list[0] : "",
          });
          draw_list.unshift("全部");
          setDrawList(draw_list);
        } else {
          setLotidObj({});
        }
      },
      () => {
        setLotidObj({});
      }
    );
  };
  const chgDraw = (val) => {
    let fur_list = [];
    if (val === "全部") {
      // 把所有的内容都添加进去
      Object.keys(lotid_obj).forEach((e) => {
        lotid_obj[e].forEach((_) => {
          fur_list.push(_.id);
        });
      });
    } else {
      fur_list = lotid_obj[val].map((e) => e.id);
    }
    setFurList(fur_list);
    form.setFieldsValue({ 坩埚编号: "" });
  };

  const query = () => {
    const { 时间, 工厂, 车间, 工序, 机台, 图号, 坩埚编号 } =
      form.getFieldsValue();
    if (图号 === "" || 坩埚编号 === "") {
      message.warning("图号or坩埚编号不能为空");
      return;
    }
    let val = {
      时间: 时间,
      工厂,
      车间,
      工序,
      机台,
      图号,
      坩埚编号,
    };
    dispatch(
      setCommonParam({
        param_name: "single_form",
        param_val: val,
      })
    );
    setFlag(!flag);
  };
  useEffect(() => {
    initOption();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={["熔融机过程分析", "单过程分析"]} />
      <div className="content_root">
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
              options={selectList2Option(option_obj['图号'])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="坩埚编号" name="坩埚编号">
            <Input placeholder="请输入坩埚编号" />
          </Form.Item>
          <Button type="primary" onClick={query}>
            查询
          </Button>
        </Form>
        <Tabs
          defaultActiveKey="1"
          type="card"
          items={tabs_items}
          style={{ marginTop: 16 }}
        />
      </div>
    </div>
  );
}

export default SingleProcessAnalysis;
