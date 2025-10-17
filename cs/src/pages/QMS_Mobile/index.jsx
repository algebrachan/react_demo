import {Tabs} from "antd";
import styles from './style/index.module.less';
import FenCengShenHe from '@/pages/Manage/QMS/FenCengShenHe'
import ShipmentInspection from "@/pages/Manage/QMS/QualityInspection/ShipmentInspection/index.jsx";
import InspectionReport from "@/pages/Manage/QMS/QualityInspection/InspectionReport/index.jsx";

const QMS_Mobile = () => {
  const items = [
    {key: '1', label: '分层审核', children: <FenCengShenHe isMobile />},
    {key: '2', label: '质量检验', children: <ShipmentInspection isMobile />},
    {key: '3', label: '进料检验', children: <InspectionReport isMobile />},
  ]
  return <Tabs className={styles['qms_mobile']} defaultActiveKey="1" items={items}></Tabs>
}
export default QMS_Mobile