import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createDeviceType,
  createRecipeGroup,
  createRecipeTemplate,
  readUnboundDeviceList,
  updateDeviceType,
  updateRecipeGroup,
  updateRecipeTemplate,
} from "@/apis/rms.js";
import { UploadOutlined } from "@ant-design/icons";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import MultiSelect from "@/pages/Manage/RMS/component/MultiSelect.jsx";

const GroupModal = ({
  isEdit,
  open,
  setOpen,
  refresh,
  row,
  deviceTypeList,
  deviceList,
  recipeTemplateList,
  DeliveryTypeOptions,
  getUnboundDeviceList,
  unboundDeviceIds,
}) => {
  const [recipeTemplateOptions, setRecipeTemplateOptions] = useState([]);
  const [deviceListOptions, setDeviceListOptions] = useState([]);
  const [form] = Form.useForm();
  const formItems = [
    [
      {
        span: 24,
        label: "配方组名称",
        rules: [{ required: true, message: "请输入配方组名称" }],
        name: "RecipeGroupName",
        formItem: <Input />,
      },
    ],
    [
      {
        span: 24,
        label: "设备类型",
        rules: [{ required: true, message: "请选择设备类型" }],
        name: "DeviceTypeId",
        formItem: (
          <Select
            options={deviceTypeList.map(({ Id, DisplayName }) => ({
              label: DisplayName,
              value: Id,
            }))}
          />
        ),
      },
    ],
    [
      {
        span: 24,
        label: "配方模板",
        rules: [{ required: true, message: "请选择配方模板" }],
        name: "RecipeTemplateId",
        formItem: <Select options={recipeTemplateOptions} />,
      },
    ],
    [
      {
        span: 24,
        label: "下发方式",
        rules: [{ required: true, message: "请选择下发方式" }],
        name: "DeliveryType",
        formItem: <Radio.Group options={DeliveryTypeOptions} />,
      },
    ],
    [
      {
        span: 24,
        label: "绑定设备",
        name: "DeviceIdArray",
        formItem: (
          <MultiSelect showCheckAll={true} options={deviceListOptions} />
        ),
      },
    ],
  ];
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      if (isEdit) {
        updateRecipeGroup({ ...row, ...values }).then((res) => {
          message.success(`编辑成功`);
          setOpen(false);
          refresh();
          getUnboundDeviceList();
        });
      } else {
        createRecipeGroup({ ...values }).then((res) => {
          message.success(`添加成功`);
          setOpen(false);
          refresh();
          getUnboundDeviceList();
        });
      }
    });
  };
  const handleSetRecipeTemplateOptions = (deviceTypeId) => {
    const recipeTemplateOptions = recipeTemplateList
      .filter(({ DeviceTypeId }) => deviceTypeId === DeviceTypeId)
      .map(({ TemplateId, TemplateName }) => ({
        label: TemplateName,
        value: TemplateId,
      }));
    setRecipeTemplateOptions(recipeTemplateOptions);
  };
  const handleSetDeviceListOptions = (deviceTypeId) => {
    const selfRowIds = isEdit ? row.DeviceIdArray ?? [] : [];
    const deviceListOptions = deviceList
      .filter(({ DeviceTypeId }) => deviceTypeId === DeviceTypeId)
      .filter(({ DeviceId }) =>
        [...unboundDeviceIds, ...selfRowIds].includes(DeviceId)
      )
      .map(({ DeviceId, DisplayName }) => ({
        label: DisplayName,
        value: DeviceId,
      }));
    setDeviceListOptions(deviceListOptions);
  };
  const handleValuesChange = (changedValues, allValues) => {
    const { DeviceTypeId } = changedValues;
    if (DeviceTypeId !== undefined) {
      handleSetRecipeTemplateOptions(DeviceTypeId);
      handleSetDeviceListOptions(DeviceTypeId);
      form.setFieldsValue({ DeviceIdArray: [], RecipeTemplateId: undefined });
    }
  };
  useEffect(() => {
    if (open) {
      if (isEdit) {
        const { DeviceTypeId, DeviceIdArray } = row;
        handleSetRecipeTemplateOptions(DeviceTypeId);
        handleSetDeviceListOptions(DeviceTypeId);
        form.setFieldsValue({ ...row, DeviceIdArray: DeviceIdArray ?? [] });
      } else {
        form.resetFields();
        setRecipeTemplateOptions([]);
        setDeviceListOptions([]);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`${isEdit ? "编辑配方组" : "新增配方组"}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={500}
    >
      <CustomForm
        onValuesChange={handleValuesChange}
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{ span: 7 }}
      />
    </Modal>
  );
};
export default GroupModal;
