import React, { useEffect, useState } from "react";
import { Layout, Menu, Input, Space } from "antd";
import { Link, Outlet } from "react-router-dom";
import {
  ControlOutlined,
  FormOutlined,
  FundOutlined,
  HomeOutlined,
  LineChartOutlined,
  SearchOutlined,
  SettingFilled,
} from "@ant-design/icons";
import "./mng.less";
import { Logout, User } from "../AuthMngSys/Comp";
import { getSession } from "../../utils/storage";
import { AgentButton } from "../../components/AiAgent";
const { Header, Content, Footer } = Layout;

const getItem = (key, name, link, icon, children) => {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={link}>{name}</Link> : name,
    // label: link ? (
    //   <span onClick={() => window.open(link, "_blank")}>{name}</span>
    // ) : (
    //   name
    // ),
  };
};
const default_menu = [
  getItem("0", "首页", "/mng/home", <HomeOutlined />),
  getItem("1", "SPC分析", null, <LineChartOutlined />, [
    getItem("1-1", "SPC", "/mng/spc", null),
    getItem("1-5", "SPC定期分析", "/mng/period_spc", null),
    getItem("1-7", "SPC来料分析", "/mng/lailiao_spc", null),
    getItem("1-8", "SPC受入检查", "/mng/srjc_spc", null),
    getItem("1-9", "控制线管理", "/mng/spc_ctrl_line", null),
    getItem("1-2", "异常处理", "/mng/err_handle", null),
    // getItem("1-2", "告警处理", "/mng/alarm", null),
    getItem("1-3", "SPC规则", "/mng/rule_maintain", null),
    getItem("1-4", "规格维护", "/mng/specific_maintain", null),
    getItem("1-6", "SPC文件上传", "/mng/spc_file_upload", null),
    getItem("1-10", "点检SPC", "/mng/spc_data_visualization", null),
    // getItem("1-6", "控制图配置", "control_config", null),
  ]),
  getItem("2", "熔融机过程分析", null, <FundOutlined />, [
    getItem("2-1", "单过程分析", "/mng/sigle_process_analysis", null),
    getItem("2-2", "多过程分析", "/mng/multi_process_analysis", null),
    getItem("2-3", "电流过程分析", "/mng/progress_current", null),
    getItem("2-4", "批次真空压力管控", "/mng/vacuum_pressure", null),
    getItem("2-5", "模具出水温度", "/mng/water_out_temp", null),
    getItem("2-6", "相关性分析", "/mng/correlation_analysis", null),
    getItem("2-7", "品类分析", "/mng/category_analysis", null),
    getItem("2-8", "品质追溯", "/mng/quality_trace", null),
    getItem("2-9", "熔融工艺参数", "/mng/melt_process_param", null),
  ]),
  getItem("3", "派工", "/mng/dispatch_work", <ControlOutlined />),
  getItem("4", "FDC分析", null, <LineChartOutlined />, [
    getItem("4-1", "FDC", "/mng/fdc", null),
    getItem("4-2", "多过程分析", "/mng/fdc_mult", null),
    getItem("4-3", "设备管理", "/mng/fdc_dev_list", null),
    getItem("4-4", "参数管理", "/mng/fdc_param_list", null),
    getItem("4-5", "异常规则", "/mng/fdc_err_rules", null),
    getItem("4-6", "异常详情", "/mng/fdc_err_details", null),
  ]),
  getItem("5", "熔融监控录入", "/melting_monitor_input", <FormOutlined />),
  getItem("6", "录入模块", null, <FormOutlined />, [
    getItem("6-1", "TPM停机录入", "/input_module_tpm", null),
    getItem("6-2", "TPM明细录入", "/input_module_detail_tpm", null),
    getItem("6-3", "来料数据录入(手动)", "/input_module_incoming_data", null),
    getItem("6-4", "石英砂管理", "/mng/sand_management_system", null),
  ]),
  getItem("7", "查询模块", null, <SearchOutlined />, [
    getItem("7-1", "生产进度查询", "/mng/produce_query", null),
    getItem("7-2", "熔融监控查询", "/mng/melting_query", null),
    getItem("7-3", "来料数据查询", "/mng/material_query", null),
    getItem("7-4", "巡检记录", "/mng/inspection_record", null),
    getItem("7-5", "过程批次对比", "/mng/batch_comparison", null),
    getItem("7-6", "来料IQC查询", "/mng/iqc_query", null),
    getItem("7-7", "加工记录数据管理", "/mng/process_record_data", null),
    getItem("7-8", "生产条件对比", "/mng/production_condition", null),
  ]),
  getItem("8", "RMS", null, null, [
    getItem("8-1", "配方管理", "/mng/rms/recipe", null),
    getItem("8-2", "配置管理", "/mng/rms/config", null),
    getItem("8-3", "图号管理", "/mng/rms/crucible/figure-code", null),
    getItem("8-4", "型号管理", "/mng/rms/crucible/model", null),
    getItem("8-5", "模具管理", "/mng/rms/crucible/mold", null),
    getItem("8-6", "烘烤冷却", "/mng/rms/crucible/colding_recipe", null),
    getItem(
      "8-7",
      "石英砂",
      "/mng/rms/crucible/quartz_sand_recipe_management",
      null
    ),
    getItem("8-8", "清洗", "/mng/rms/crucible/washing_recipe", null),
    getItem("8-9", "熔融方案", "/mng/rms/melting_scheme", null),
    getItem("8-10", "制造条件表", "/mng/rms/condition_table", null),
  ]),
  // getItem("5", "设备性能评估", "equipment"),
  // getItem("6", "质量数据分析", "quality_anls"),
  getItem("9", "权限管理", "/mng/auth_mng_sys", <SettingFilled />),
];
const generateTree = (arr) => {
  const tree = [];
  const itemMap = new Map();
  const filteredArr = arr.filter((item) => item.visible === "显示");
  const menu_list = filteredArr.map((e) => ({
    key: e.permission_id,
    label:
      e.menu_type === "菜单" ? (
        <Link to={e.path}>{e.permission_name}</Link>
      ) : (
        e.permission_name
      ),
    pid: e.parent_permission_id,
    order_num: e.order_num,
  }));
  for (const item of menu_list) {
    itemMap.set(item.key, item);
  }

  for (const item of menu_list) {
    const parent = itemMap.get(item.pid);
    // 如果是父节点
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
      parent.children.sort((a, b) => a.order_num - b.order_num);
    } else {
      tree.push(item);
    }
  }
  return tree;
};

function Manage() {
  const [ipt, setIpt] = useState("");
  const [menu, setMenu] = useState([]);
  const user_str = getSession("user_info");

  const onSearch = (e) => {
    console.log(ipt);
  };
  useEffect(() => {
    // 判断是什么角色
    console.log("mng", user_str);
    if (user_str) {
      const { role_ids = [] } = JSON.parse(user_str);
      if (role_ids.includes(0)) {
        //如果角色是0(超管)
        setMenu(default_menu);
      } else {
        const permissions_str = getSession("permissions");
        if (permissions_str) {
          let val = JSON.parse(permissions_str);
          // 根据 list 生成树形结构
          const tree_list = generateTree(val);
          if (tree_list.length > 0) {
            const menu = tree_list[0].children;
            setMenu(menu);
          }
        }
      }
    }
  }, [user_str]);
  return (
    <div className="manage_root">
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "100vw",
            position: "fixed",
            zIndex: 10,
          }}
          className="manage_header"
        >
          <div className="mng_logo" />
          <div className="mng_title">{window.sys_name}</div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={menu}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
          <Input
            placeholder="请输入想要搜索的内容"
            onPressEnter={onSearch}
            value={ipt}
            onChange={(e) => setIpt(e.target.value)}
            style={{
              width: 200,
              marginRight: 14,
              background: "transparent",
            }}
          />
          <Space size={2} style={{ marginRight: 10 }}>
            <div className="mng_alert" title="提醒" />
            <div className="mng_msg" title="消息" />
            <User />
            <Logout />
          </Space>
        </Header>
        <Content
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 48,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          JSG | 300316
        </Footer>
      </Layout>
      {/* 新增对话机器人 */}
      {/* <AgentButton /> */}
    </div>
  );
}

export default Manage;
