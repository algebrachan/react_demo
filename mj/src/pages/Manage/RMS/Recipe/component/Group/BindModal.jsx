import React, { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../../utils/obj";
import {
  BindExtendInfo_MJ,
  GetFigurecodeenum,
  GetProductionStepEnum,
} from "../../../../../../apis/rms";
import { Select } from "antd";
const BindModal = ({ open, setOpen, docRow, refresh, gc_list = [] }) => {
  const [form] = Form.useForm();
  const [tuhao_list, setTuhaoList] = useState([]);

  const initOpt = () => {
    GetFigurecodeenum({}).then((res) => {
      const { ListData = [] } = res;
      setTuhaoList(
        ListData.map((e) => ({
          label: e["FigureCode"],
          value: e["FigureCode"],
        }))
      );
    });
  };

  useEffect(() => {
    if (open) {
      console.log("gc_list", gc_list);
      initOpt();
      const {
        RecipeFileName,
        MakeVersion,
        MakeDescribe,
        ProductionStep,
        FigureCode,
      } = docRow;
      form.setFieldsValue({
        FigureCode,
        ProductionStep,
        RecipeFileName,
        MakeVersion,
        MakeDescribe: MakeDescribe ?? "",
      });
    }
  }, [open]);
  const handleOk = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    const param = {
      recipeFileId: docRow["RecipeFileId"],
      figureCode: values["FigureCode"],
      makeVersion: values["MakeVersion"],
      makeDescribe: values["MakeDescribe"],
      productionStep: values["ProductionStep"],
    };
    BindExtendInfo_MJ(param).then((res) => {
      message.success("绑定成功");
      setOpen(false);
      refresh();
    });
  };

  return (
    <Modal
      title="配方绑定"
      open={open}
      onOk={handleOk}
      onCancel={() => setOpen(false)}
    >
      <Form form={form} {...ComputeFormCol(6)}>
        <Flex vertical gap={16}>
          <Form.Item label="配方名称" name="RecipeFileName">
            <Input placeholder="请输入配方名称" disabled />
          </Form.Item>
          <Form.Item label="配方图号" name="FigureCode">
            <Select options={tuhao_list} showSearch allowClear/>
          </Form.Item>
          <Form.Item
            label="生产过程"
            name="ProductionStep"
            rules={[{ required: true, message: "请输入生产过程" }]}
          >
            <Select
              options={gc_list.map((e) => ({
                label: e["ProductionStepName"],
                value: e["ProductionStep"],
              }))}
            />
          </Form.Item>
          <Form.Item
            label="文件版本"
            name="MakeVersion"
            rules={[{ required: true, message: "请输入文件版本" }]}
          >
            <Input placeholder="请输入文件版本" />
          </Form.Item>
          <Form.Item label="文件描述" name="MakeDescribe">
            <Input.TextArea rows={4} placeholder="请输入文件描述" />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};
export default BindModal;
