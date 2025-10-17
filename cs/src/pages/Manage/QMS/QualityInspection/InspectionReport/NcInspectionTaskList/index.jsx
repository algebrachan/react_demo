import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Flex,
  Space,
  message,
  Select,
  Popconfirm,
} from "antd";
import { inspectionData } from "@/apis/qms_router";
import { InspectionModal } from "../Modal";
import { useDispatch } from "react-redux";
import { setCommonParam } from "../../../../mngSlice";
import { selectList2OptionAll } from "../../../../../../utils/string";
import { GenerateFormItem } from "../../../../../../utils/obj";
import { delInspectionTask } from "../../../../../../apis/nc_review_router";
// BJ241100012510
// const headerDict = {
//   nchecknumStr: "检验主数量",
//   graphid: "物料图号",
//   usercode: "制单人",
//   dmakedate: "制单日期",
//   materialname: "物料名称",
//   orgcode: "组织编码",
//   vapplybillcode: "报检单号",
//   measdocname: "主单位",
//   fbillstatus: "nc状态",
//   orgname: "组织编码",
//   newversion: "最新版本号",
//   qualitygrade: "物料质量检验分类",
//   dreportdate: "报告日期",
//   judgeSamplePiece: "是否样件",
//   suppliername: "供应商名称",
//   measdoccode: "计量单位编码",
//   pkReportbill: "质检报告主键",
//   ncUpdate: "是否nc修改",
//   departmentName: "采购部门名称",
//   materialcode: "物料编码",
//   creationtime: "创建时间",
//   vbillcode: "质检报告号",
//   suppliercode: "供应商编码",
//   dbilldate: "到货日期",
//   departmentCode: "采购部门编码",
//   task_status: "任务状态",
//   unqualified_id: "不合格ID",
//   remarks: "备注",
//   is_return: "是否回传",
//   guideline_id: "指导书ID",
// };
const NcInspectionTaskList = () => {
  const dispatch = useDispatch();
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [is_modal, setIsModal] = useState(false);

  const loadNCList = () => {
    const values = query_form.getFieldsValue();
    setTbLoad(true);
    inspectionData(
      values,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data.length > 0) {
          setTbData(data);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };

  const isFixedHeader = (header) => {
    if (header === "报检单号") return "left";
    if (header === "不合格ID") return "right";
    return false;
  };

  const handleEdit = (row) => {
    console.log("编辑行数据:", row);
  };
  const jumpReport = (row) => {
    dispatch(
      setCommonParam({
        param_name: "qms",
        param_val: { inspection_tab: "2", inspection_code: row.vapplybillcode },
      })
    );
  };

  const colItems = [
    { title: "报检单号", dataIndex: "vapplybillcode" },
    { title: "任务状态", dataIndex: "task_status" },
    { title: "到货日期", dataIndex: "dbilldate" },
    { title: "制单日期", dataIndex: "dmakedate" },
    { title: "物料名称", dataIndex: "materialname" },
    { title: "检验主数量", dataIndex: "nchecknumStr" },
    { title: "主单位", dataIndex: "measdocname" },
    { title: "物料图号", dataIndex: "graphid" },
    { title: "物料编码", dataIndex: "materialcode" },
    { title: "供应商名称", dataIndex: "suppliername" },
    { title: "报告单号", dataIndex: "vbillcode" },
    { title: "报告日期", dataIndex: "dreportdate" },
  ];
  const queryFormItems = [
    { label: "报检单号", name: "报检单号", type: "input" },
    { label: "报告单号", name: "报告单号", type: "input" },
    { label: "物料编码", name: "物料编码", type: "input" },
    { label: "物料名称", name: "物料名称", type: "input" },
    { label: "物料图号", name: "物料图号", type: "input" },
    { label: "供应商", name: "供应商", type: "input" },
  ];
  const del = (record) => {
    const { vapplybillcode } = record;
    delInspectionTask(
      { vapplybillcode: vapplybillcode },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success("删除成功");
          loadNCList();
        }
      },
      (e) => {}
    );
  };
  const columns = [
    ...colItems.map((item) => ({
      title: item.title,
      dataIndex: item.dataIndex,
      key: item.dataIndex,
      fixed: isFixedHeader(item.title),
      width: 150,
      ellipsis: true,
      align: "center",
    })),
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => jumpReport(record)}
            style={{ padding: 10 }}
          >
            报告
          </Button>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ padding: 10 }}
          >
            回传
          </Button>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger style={{ padding: 10 }}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  useEffect(() => {
    loadNCList();
  }, []);
  return (
    <Flex vertical gap={16}>
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          报检单号: "",
          报告单号: "",
          物料编码: "",
          物料名称: "",
          物料图号: "",
          供应商: "",
          状态: "全部",
        }}
      >
        <Space>
          {queryFormItems.map((item, _) => (
            <GenerateFormItem item={item} key={_} />
          ))}
          <Form.Item label="状态" name="状态">
            <Select
              options={selectList2OptionAll(["已完成", "未完成"])}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Button type="primary" onClick={loadNCList}>
            查询
          </Button>
          <Button onClick={() => setIsModal(true)}>手动报检</Button>
        </Space>
      </Form>
      <Table
        rowKey="pkApplybill"
        loading={tb_load}
        columns={columns}
        dataSource={tb_data}
        scroll={{ x: "max-content", y: 600 }}
        bordered
        size="small"
        style={{
          fontSize: "14px",
          lineHeight: "20px",
        }}
        pagination={pagination}
      />
      <InspectionModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        requestData={loadNCList}
      />
    </Flex>
  );
};

export default NcInspectionTaskList;
