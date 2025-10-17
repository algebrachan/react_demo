import { Button, DatePicker, Form, Select, Space, Spin } from "antd";
import dayjs from "dayjs";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { getLotId, getSearchList } from "../../../../apis/anls_api";
import {
  selectList2Option,
  selectList2OptionAll,
  timeFormat,
} from "../../../../utils/string";
import { message } from "antd";
const { RangePicker } = DatePicker;

const default_query_form = {
  时间: [
    dayjs().subtract(7, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  工厂: "",
  车间: "",
  工序: "",
  机台: [],
  图号: "",
};

export const ProgressForm = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    getFormData: getFormData,
    LotidObj: lotid_obj,
  }));
  const {
    style,
    chgDraw = () => {},
    requestData = () => {},
    query_btn = true,
  } = props;
  const [form] = Form.useForm();
  const [option_obj, setOptionObj] = useState({});
  const [lotid_obj, setLotidObj] = useState({});

  const [draw_list, setDrawList] = useState([]);
  const [draw_spin, setDrawSpin] = useState(false);

  const initOpt = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 工厂, 工序, 机台 = [], 车间, 图号 = [] } = data;
          let val = {
            工厂: 工厂[0] ? 工厂[0] : "",
            工序: 工序[0] ? 工序[0] : "",
            机台: 机台,
            车间: 车间[0] ? 车间[0] : "",
            图号: 图号[0] ? 图号[0] : "",
          };
          setDrawList(图号);
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
    const { 时间, 工厂, 车间, 工序, 机台, 图号 } = form.getFieldsValue();
    let val = {
      开始时间: 时间[0],
      结束时间: 时间[1],
      工厂,
      车间,
      工序,
      机台,
      图号,
    };
    getLotId(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { lot_list } = data;
          chgDraw(lot_list);
        } else {
          message.error(msg);
          chgDraw([]);
          // setLotidObj({});
        }
      },
      () => {
        message.error("获取编号失败");
        chgDraw([]);
      }
    );
  };

  const getFormData = () => {
    const { 时间, 工厂, 车间, 工序, 机台, 图号 = "" } = form.getFieldsValue();
    let val = {
      开始时间: 时间[0],
      结束时间: 时间[1],
      工厂,
      车间,
      工序,
      机台,
      图号,
    };
    return val;
  };
  useEffect(() => {
    if (Object.keys(option_obj).length > 0) {
      getId();
    }
  }, [option_obj]);

  useEffect(() => {
    initOpt();
  }, []);
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={default_query_form}
      style={style}
    >
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
          options={selectList2Option(option_obj["机台"])}
          mode="multiple"
          maxTagCount="responsive"
          style={{ width: 200 }}
        />
      </Form.Item>
      <Spin spinning={draw_spin}>
        <Form.Item label="图号" name="图号">
          <Select
            showSearch
            options={selectList2OptionAll(draw_list)}
            style={{ width: 160 }}
          />
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" onClick={getId}>
          搜索批号
        </Button>
      </Form.Item>
      {query_btn ? (
        <Form.Item>
          <Button type="primary" onClick={requestData}>
            绘图
          </Button>
        </Form.Item>
      ) : null}
    </Form>
  );
});
