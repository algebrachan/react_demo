import {
    AutoComplete,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import { addTpmOptions, insertShutdownInfomations, insertTpmInfomations } from "../../../../../apis/tpm_api";
import { useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";


const MyAutoComplete = ({ opt = [], label = "" }) => {
    const [options, setOptions] = useState([]);
    const [name, setName] = useState("");
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        if (name === "") {
            return;
        }
        let str = name.toUpperCase();
        if (options.includes(str)) {
            message.warning("请勿添加重复元素");
            setName("");
        } else {
            // 请求后端
            addTpmOptions(
                { name: label, value: str },
                (res) => {
                    const { code, msg, data } = res.data;
                    if (code === 0 && data) {
                        setOptions([...options, str]);
                        setName("");
                        message.success("添加成功");
                    } else {
                        message.error(msg);
                    }
                },
                () => {
                    message.error("网络异常");
                }
            );
        }
    };
    useEffect(() => {
        if (opt && opt.length > 0) {
            setOptions(opt);
        }
    }, [opt]);
    return (
        <Form.Item label={label} name={label} rules={[{ required: true }]}>
            <AutoComplete
                placeholder="请输入"
                options={selectList2Option(options)}
                filterOption={(inputValue, option) =>
                    option &&
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <Divider
                            style={{
                                margin: "8px 0",
                            }}
                        />
                        <Space
                            style={{
                                padding: "0 8px 4px",
                            }}
                        >
                            <Input
                                placeholder="新增参数"
                                value={name}
                                onChange={onNameChange}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button
                                type="text"
                                icon={<PlusOutlined />}
                                style={{ padding: 5 }}
                                onClick={addItem}
                            >
                                新增
                            </Button>
                        </Space>
                    </>
                )}
            />
        </Form.Item>
    );
};


export const TingjiForm = ({ onHide, requestData }) => {
    const tpm_opt = useSelector((state) => state.mng.tpm_opt);
    const [form] = Form.useForm();
    const submit = async () => {
        let val = await form
            .validateFields()
            .then((res) => res)
            .catch((err) => {
                const { errorFields } = err;
                let err_list = errorFields.map((e) => e.errors);
                message.warning(err_list.join("\n"));
                return false;
            });
        if (val) {
            insertShutdownInfomations(
                { op: 0, data: val },
                (res) => {
                    const { code, data, msg } = res.data;
                    if (code === 0 && data) {
                        message.success("提交成功");
                        form.resetFields();
                        requestData();
                        // onHide()
                    } else {
                        message.error(msg);
                    }
                },
                () => {
                    message.error("提交失败");
                }
            );
        }
    };
    return (
        <Card
            title="停机录入"
            style={{
                width: "100%",
            }}
            size="small"
        >
            <Form
                form={form}
                {...ComputeFormCol(10)}
                initialValues={{
                    日期: dayjs().format("YYYY-MM-DD"),
                    工序: "",
                    机台: "",
                    班次: "",
                    类别: "",
                    停机原因: "",
                    处理方法: "",
                    停机时间: "",
                    影响产量数: "",
                    部门: "",
                    备注: "",
                    提交人: "",
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Form.Item
                            label="日期"
                            name="日期"
                            getValueProps={(value) => {
                                return {
                                    value: value && dayjs(value),
                                };
                            }}
                            normalize={(value) => value && dayjs(value).format(dateFormat)}
                            rules={[{ required: true }]}
                        >
                            <DatePicker allowClear={false} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="工序" opt={tpm_opt["工序"]} />
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="机台" opt={tpm_opt["机台"]} />
                    </Col>
                    <Col span={4}>
                        <Form.Item label="班次" name="班次" rules={[{ required: true }]}>
                            <Select options={selectList2Option(tpm_opt['班次'])} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="类别" opt={tpm_opt["类别"]} />
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="停机原因" opt={tpm_opt["停机原因"]} />
                    </Col>
                    <Col span={4}>
                        <Form.Item label="处理方法" name="处理方法" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="停机时间(H)" name="停机时间" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="影响产量数" name="影响产量数" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="部门" opt={tpm_opt["部门"]} />
                    </Col>
                    <Col span={4}>
                        <Form.Item label="备注" name="备注">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="提交人" name="提交人" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Space size={30}>
                            <Button type="primary" onClick={submit}>
                                提交
                            </Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button onClick={onHide}>收起</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export const TpmForm = ({ onHide, requestData }) => {
    const [form] = Form.useForm();
    const tpm_opt = useSelector((state) => state.mng.tpm_opt);
    const submit = async () => {
        let val = await form
            .validateFields()
            .then((res) => res)
            .catch((err) => {
                const { errorFields } = err;
                let err_list = errorFields.map((e) => e.errors);
                message.warning(err_list.join("\n"));
                return false;
            });
        if (val) {
            insertTpmInfomations(
                { op: 0, data: val },
                (res) => {
                    const { code, data, msg } = res.data;
                    if (code === 0 && data) {
                        message.success("提交成功");
                        form.resetFields();
                        requestData();
                    } else {
                        message.error(msg);
                    }
                },
                () => {
                    message.error("提交失败");
                }
            );
        }
    };
    return (
        <Card
            title="TPM录入"
            style={{
                width: "100%",
            }}
            size="small"
        >
            <Form
                form={form}
                {...ComputeFormCol(10)}
                initialValues={{
                    卫生: "",
                    定制定位: "",
                    老化破损: "",
                    安全: "",
                    生锈腐蚀: "",
                    跑冒滴漏: "",
                    设备维护: "",
                    质量改善: "",
                    成本: "",
                    日期: dayjs().format(dateFormat),
                    部门: "",
                    工序: "",
                    提交人: "",
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Form.Item
                            label="日期"
                            name="日期"
                            getValueProps={(value) => {
                                return {
                                    value: value && dayjs(value),
                                };
                            }}
                            normalize={(value) => value && dayjs(value).format(dateFormat)}
                        >
                            <DatePicker allowClear={false} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    {[
                        "卫生",
                        "定制定位",
                        "老化破损",
                        "安全",
                        "生锈腐蚀",
                        "跑冒滴漏",
                        "设备维护",
                        "质量改善",
                        "成本",
                    ].map((item, _) => {
                        return (
                            <Col span={4} key={_}>
                                <Form.Item label={item} name={item} >
                                    <Input />
                                </Form.Item>
                            </Col>
                        );
                    })}
                    <Col span={4}>
                        <MyAutoComplete label="部门" opt={tpm_opt["部门"]} />
                    </Col>
                    <Col span={4}>
                        <MyAutoComplete label="工序" opt={tpm_opt["工序"]} />
                    </Col>
                    <Col span={4}>
                        <Form.Item label="提交人" name="提交人" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Space size={30}>
                            <Button type="primary" onClick={submit}>
                                提交
                            </Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button onClick={onHide}>收起</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};
