import React, { useEffect, useState } from "react";
import { Layout, Menu, Input, Space } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FormOutlined,
  LineChartOutlined,
  SettingFilled,
  SearchOutlined,
} from "@ant-design/icons";
import "./mng.less";
import { Logout, User } from "../AuthMngSys/Comp";
import { getSession } from "../../utils/storage";
import MsgCenter from "./MngComp/msgCenter";

const { Header, Content, Footer } = Layout;
const getItem = (key, name, link, icon, children) => {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={link}>{name}</Link> : name,
  };
};
const getItem_blank = (key, name, link, icon, children) => {
  return {
    key,
    icon,
    children,
    label: link ? (
      <span onClick={() => window.open(link, "_blank")}>{name}</span>
    ) : (
      name
    ),
  };
};
const default_menu = [
  getItem("1", "SPC分析", null, <LineChartOutlined />, [
    getItem("1-1", "SPC", "/mng/spc_analysis", null),
    getItem("1-2", "SPC规格配置", "/mng/spc_analysis_spec", null),
    // getItem("1-2", "告警处理", "/mng/alarm", null),
    // getItem("1-3", "SPC规则", "/mng/rule_maintain", null),
    // getItem("1-4", "异常处理", "/mng/err_handle", null),
  ]),
  getItem("4", "FDC分析", null, <LineChartOutlined />, [
    getItem("4-1", "FDC", "/mng/fdc", null),
    getItem("4-2", "数据对比", "/mng/fdc_mult", null),
    getItem("4-8", "多过程分析(多轴)", "/mng/fdc_mult_axis", null),
    getItem("4-3", "设备管理", "/mng/fdc_dev_list", null),
    getItem("4-4", "参数管理", "/mng/fdc_param_list", null),
    getItem("4-5", "异常规则", "/mng/fdc_err_rules", null),
    getItem("4-6", "异常详情", "/mng/fdc_err_details", null),
    getItem("4-7", "坐标轴设置", "/mng/axis_set", null),
    getItem("4-9", "报警详情处理", "/mng/fdc_alarm_details", null),
  ]),
  getItem("6", "QMS", null, <FormOutlined />, [
    getItem("6-1", "质量检验", null, null, [
      getItem("6-1-1", "进料检验", "/mng/qms_inspection_report", null),
      getItem("6-1-2", "过程检验", "/mng/qms_process_inspection", null),
      getItem("6-1-3", "过程检验整改", "/mng/qms_process_inspection_zg", null),
      getItem("6-1-4", "成品检验", "/mng/qms_product_inspection", null),
      getItem("6-1-5", "出货检验", "/mng/qms_shipment_inspection", null),
      getItem("6-1-6", "委外检验", "/mng/qms_wei_wai_song_jian", null),
      getItem("6-1-7", "质量数据查询", "/mng/quality_query", null),
      getItem("6-1-8", "质量数据上传", "/mng/quality_data_upload", null),
    ]),
    getItem("6-2", "不合格处置", "/mng/qms_reviewnoproduct", null),
    getItem("6-3", "变更管理", "/mng/qms_change", null),
    getItem("6-4", "LOP", "/mng/lop", null),
    getItem("6-5", "DCC", null, null, [
      getItem("6-5-0", "文件管理", "/mng/qms_dcc_ledger", null),
      getItem("6-5-1", "流程管理", "/mng/qms_dcc", null),
    ]),
    getItem("6-6", "检测设备管理", "/mng/qms_measure_tools", null),
    getItem("6-7", "标准管理", "/mng/qms_standard_mng", null),
    getItem("6-8", "客诉管理", "/mng/qms_customer_complaint", null),
    getItem("6-9", "分层审核", null, null, [
      getItem("6-9-0", "分层审核", "/mng/qms_fen_ceng_shen_he", null),
      getItem("6-9-1", "统计分析", "/mng/qms_fen_ceng_shen_he_tongji", null),
    ]),
    getItem("6-10", "审核管理", null, null, [
      getItem("6-10-0", "方案管理", "/mng/qms_scheme_management", null),
      getItem("6-10-1", "体系内审", "/mng/qms_system_audit", null),
      getItem("6-10-2", "产品审核", "/mng/qms_product_audit", null),
      getItem("6-16", "管理评审", "/mng/qms_guanlipingshen/gp_main", null),
      getItem("6-18", "过程审核", "/mng/qms_guochengshenhe", null),
      // getItem("6-10-3", "过程审核", "/mng/qms_process_audit", null)
    ]),
    getItem("6-11", "项目质量管理", "/mng/qms_project_quality", null),
    getItem("6-12", "成本质量", "/mng/qms_cost_quality", null),
    getItem("6-14", "QMS看板", "/mng/qms_quality_inspection_board", null),
    getItem("6-15", "质量预警", "/mng/qms_zhiliangyujing", null),
    getItem("6-17", "质量追溯", "/mng/qms_quality_trace", null),
  ]),
  getItem("8", "SPC派工", null, <FormOutlined />, [
    getItem(
      "8-1",
      "加工异常数据",
      "/mng/spc_dispatch_process_alarm_data",
      null
    ),
    getItem("8-2", "任务模型", "/mng/spc_dispatch_task_model", null),
    getItem("8-3", "任务派发", "/mng/spc_dispatch_task_assignment", null),
    getItem("8-4", "派工", "/mng/spc_dispatch_qms", null),
    getItem("8-5", "配置", "/mng/spc_dispatch_config", null),
  ]),
  // getItem("9", "相关性分析", "/mng/xiang_guan_xi", <FormOutlined />),
  getItem("10", "权限管理", "/mng/auth_mng_sys", <SettingFilled />),
  getItem("11", "系统管理", null, <SettingFilled />, [
    getItem("11-1", "员工管理", "/mng/system_employee", null),
    getItem("11-2", "部门管理", "/mng/system_dept", null),
  ]),
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
      parent.children.sort((a, b) => a.order_num - b.order_num); // 新增排序
    } else {
      tree.push(item);
    }
  }
  return tree;
};

function Manage() {
  const [ipt, setIpt] = useState("");
  const [menu, setMenu] = useState([]);
  const onSearch = (e) => {
    console.log(ipt);
  };
  useEffect(() => {
    setMenu(default_menu);
    // 判断是什么角色
    // const user_str = getSession("user_info");
    // if (user_str) {
    //   const { role_ids = [] } = JSON.parse(user_str);
    //   if (role_ids.includes(0)) {
    //     //如果角色是0(超管)
    //     setMenu(default_menu);
    //   } else {
    //     const permissions_str = getSession("permissions");
    //     if (permissions_str) {
    //       let val = JSON.parse(permissions_str);
    //       // 根据 list 生成树形结构
    //       const tree_list = generateTree(val);
    //       if (tree_list.length > 0) {
    //         const menu = tree_list[0].children;
    //         setMenu(menu);
    //       }
    //     }
    //   }
    // }
  }, []);
  return (
    <div className="manage_root">
      <Layout style={{ height: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
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
            <MsgCenter />
            <User />
            <Logout />
          </Space>
        </Header>
        <Content
          style={{
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            flex: "none",
          }}
        >
          JSG | 300316
        </Footer>
      </Layout>
    </div>
  );
}

export default Manage;
