import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Space,
  Button,
  Row,
  Col,
  Flex,
  Card,
  message,
} from "antd";
import {
  dateFormat,
  selectList2Option,
  timeFormat,
} from "../../../../utils/string";
import dayjs from "dayjs";
import { ExportOutlined } from "@ant-design/icons";
import "./tpm.less";
import { GeneralCard } from "../../../../components/CommonCard";
import { ComputeFormCol, downloadFile } from "../../../../utils/obj";
import { TingjiForm, TpmForm } from "./Form";
import { Table1, Table2, Table3, Table4 } from "./Table";
import {
  downloadTables,
  getShutdownInfomations,
  getTpmInfomations,
  getTpmOptitons,
  insertTpmInfomations,
  statisticsShutdownInfomations,
  statisticsTpmInfomations,
} from "../../../../apis/tpm_api";
import { useDispatch, useSelector } from "react-redux";
import { setCommonParam } from "../../mngSlice";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;

function TpmInput() {
  const [query_form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tpm_opt = useSelector((state) => state.mng.tpm_opt);
  const [tb_data1, setTbData1] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const [tb_data3, setTbData3] = useState([]);
  const [tb_data4, setTbData4] = useState({});
  const [isTingji, setIsTingji] = useState(false);
  const [isTpm, setIsTpm] = useState(false);
  const download = () => {
    let val = query_form.getFieldsValue();
    downloadTables(
      val,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { url } = data;
          downloadFile(url);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const requestData1 = () => {
    let val = query_form.getFieldsValue();
    getShutdownInfomations(val, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        const { data_list } = data;
        setTbData1(data_list);
      } else {
        setTbData1([]);
      }
    });
  };
  const requestData2 = () => {
    let val = query_form.getFieldsValue();
    getTpmInfomations(val, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        const { data_list } = data;
        setTbData2(data_list);
      } else {
        setTbData2([]);
      }
    });
  };
  const requestData3 = () => {
    let val = query_form.getFieldsValue();
    statisticsShutdownInfomations(val, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        const { data_list } = data;
        setTbData3(data_list);
      } else {
        setTbData3([]);
      }
    });
  };
  const requestData4 = () => {
    let val = query_form.getFieldsValue();
    statisticsTpmInfomations(val, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        setTbData4(data);
      } else {
        setTbData4({});
      }
    });
  };
  useEffect(() => {
    if (Object.keys(tpm_opt).length > 0) {
      requestData1();
      requestData2();
      requestData3();
      requestData4();
    }
  }, [tpm_opt]);
  const initOpt = () => {
    getTpmOptitons((res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        dispatch(setCommonParam({ param_name: "tpm_opt", param_val: data }));
      }
    });
  };
  useEffect(() => {
    initOpt();
  }, []);

  return (
    <Flex vertical className="tpm_input_root" gap={16}>
      <Form
        form={query_form}
        layout="inline"
        initialValues={{
          时间: [
            dayjs().subtract(30, "day").format(dateFormat),
            dayjs().format(dateFormat),
          ],
          部门: [],
          工序: [],
        }}
        style={{ marginTop: 10 }}
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
            value && value.map((e) => dayjs(e).format(dateFormat))
          }
        >
          <RangePicker allowClear={false} style={{ width: 240 }} />
        </Form.Item>
        <Form.Item name="部门" label="部门">
          <Select
            mode="multiple"
            maxTagCount="responsive"
            allowClear
            placeholder="全部"
            options={selectList2Option(tpm_opt["部门"])}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item name="工序" label="工序">
          <Select
            mode="multiple"
            maxTagCount="responsive"
            allowClear
            placeholder="全部"
            options={selectList2Option(tpm_opt["工序"])}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Space size={10}>
          <Button
            type="primary"
            onClick={() => {
              requestData1();
              requestData2();
              requestData3();
              requestData4();
            }}
          >
            搜索
          </Button>
          <Button type="primary" onClick={() => setIsTingji(true)}>
            停机录入
          </Button>
          <Button type="primary" onClick={() => setIsTpm(true)}>
            TPM录入
          </Button>
          <Button type="primary">统计</Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={download}>
            导出
          </Button>
          <Button
            onClick={() => {
              navigate("/mng");
            }}
          >
            返回
          </Button>
        </Space>
      </Form>
      {isTingji && (
        <TingjiForm
          onHide={() => setIsTingji(false)}
          requestData={requestData1}
        />
      )}
      {isTpm && (
        <TpmForm onHide={() => setIsTpm(false)} requestData={requestData2} />
      )}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Table1 data={tb_data1} />
        </Col>
        <Col span={12}>
          <Table2 data={tb_data2} />
        </Col>
        <Col span={12}>
          <Table3 data={tb_data3} />
        </Col>
        <Col span={12}>
          <Table4 data={tb_data4} />
        </Col>
      </Row>
    </Flex>
  );
}

export default TpmInput;
