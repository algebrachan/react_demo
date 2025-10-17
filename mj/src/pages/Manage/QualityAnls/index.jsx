import React, { useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Select,
  Space,
  Typography,
} from "antd";
import { selectList2Option, timeFormat } from "../../../utils/string";
import dayjs from "dayjs";
const { Text } = Typography;
const { RangePicker } = DatePicker;
function QualityAnls() {
  const [form] = Form.useForm();
  const [dev_list, setDevList] = useState(["#11", "#12", "#13", "#14"]);
  const default_query_form = {
    时间: [
      dayjs().subtract(30, "day").format(timeFormat),
      dayjs().format(timeFormat),
    ],
    工厂: "",
    车间: "",
    工序: "",
  };
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量数据分析", "熔融-质量"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
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
              <RangePicker showTime allowClear={false} style={{ width: 330 }} />
            </Form.Item>
            {["工厂", "车间", "工序"].map((e, _) => (
              <Form.Item label={e} name={e} key={_}>
                <Select
                  options={selectList2Option([])}
                  style={{ width: 150 }}
                />
              </Form.Item>
            ))}
            <Space>
              <Button type="primary">查询</Button>
            </Space>
          </Form>
          <GeneralCard name="多台设备分析">
            <div style={{ height: 400, position: "relative" }}>
              <Space style={{ position: "absolute", top: -38, right: 5 }}>
                <Text>机台号:</Text>
                <Select
                  mode="multiple"
                  maxTagCount="responsive"
                  style={{ width: 200 }}
                  options={selectList2Option(dev_list)}
                />
              </Space>
            </div>
          </GeneralCard>
          <GeneralCard name="单台设备分析">
            <div style={{ height: 400, position: "relative" }}>
              <Space style={{ position: "absolute", top: -38, right: 5 }}>
                <Text>机台号:</Text>
                <Select
                  style={{ width: 100 }}
                  options={selectList2Option(dev_list)}
                />
              </Space>
            </div>
          </GeneralCard>
        </Flex>
      </div>
    </div>
  );
}

export default QualityAnls;
