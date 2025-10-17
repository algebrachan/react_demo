import React, { useState, useEffect } from "react";
import { ExportOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Select, Space, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TpmDetailsForm } from "./Form";
import { TpmDetailsTable } from "./Table";
import dayjs from "dayjs";
import { dateFormat, selectList2Option } from "../../../../utils/string";
import { downloadTpmDetails, getTpmDetails, getTpmDetailsOptitons } from "../../../../apis/tpm_api";
import { setCommonParam } from "../../mngSlice";
import { downloadFile } from "../../../../utils/obj";
const { RangePicker } = DatePicker;

function TpmDetailsInput() {
  const [query_form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tpm_details_opt = useSelector((state) => state.mng.tpm_details_opt);
  const [isTpm, setIsTpm] = useState(true);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);

  const requestData = () => {
    setTbLoad(true);
    let val = query_form.getFieldsValue();
    getTpmDetails(
      val,
      (res) => {
        setTbLoad(false);
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData(data_list);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
      }
    );
  };
  const download = () => {
    let val = query_form.getFieldsValue();
    downloadTpmDetails(
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

  useEffect(() => {
    if (Object.keys(tpm_details_opt).length > 0) {
      requestData();
    }
  }, [tpm_details_opt]);
  const initOpt = () => {
    getTpmDetailsOptitons((res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        dispatch(
          setCommonParam({ param_name: "tpm_details_opt", param_val: data })
        );
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
          日期: [
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
          name="日期"
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
            options={selectList2Option(tpm_details_opt["部门"])}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item name="工序" label="工序">
          <Select
            mode="multiple"
            maxTagCount="responsive"
            allowClear
            placeholder="全部"
            options={selectList2Option(tpm_details_opt["工序"])}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Space size={10}>
          <Button
            type="primary"
            onClick={() => {
              requestData();
            }}
          >
            搜索
          </Button>
          <Button type="primary" onClick={() => setIsTpm(true)}>
            TPM明细录入
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
      {isTpm && (
        <TpmDetailsForm
          onHide={() => setIsTpm(false)}
          requestData={requestData}
        />
      )}
      <Spin spinning={tb_load}>
        <TpmDetailsTable data={tb_data} requestData={requestData}/>
      </Spin>
    </Flex>
  );
}

export default TpmDetailsInput;
