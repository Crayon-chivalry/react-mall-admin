import { Col, Row } from "antd";

import styles from "./index.module.scss";

import SalesCharts from "./components/SalesCharts";
import RecentOrders from "./components/RecentOrders";
import HotGoods from "./components/HotGoods";

const totalList = [
  {
    id: 1,
    name: "总销售额",
    value: 1284590,
    icon: "/src/assets/images/sales.png",
  },
  {
    id: 2,
    name: "订单总量",
    value: 8432,
    icon: "/src/assets/images/order-num.png",
  },
  {
    id: 3,
    name: "新增用户",
    value: 1204,
    icon: "/src/assets/images/user-num.png",
  },
  {
    id: 4,
    name: "转化率",
    value: 3.4,
    icon: "/src/assets/images/conver-rate.png",
  },
];

const Dashboard = () => {
  return (
    <Row gutter={[0, 32]}>
      {/* 汇总数据 */}
      <Col span={24}>
        <Row gutter={24}>
          {totalList.map((item) => (
            <Col span={6} key={item.id}>
              <div className={styles["total-item"]}>
                <div className={styles["total-top"]}>
                  <div>{item.name}</div>
                  <img src={item.icon} className={styles["total-icon"]} />
                </div>
                <div className={styles["total-value"]}>{item.value}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={24}>
          <Col span={16}>
            {/* 销售图表 */}
            <SalesCharts />
          </Col>
          <Col span={8}>
            {/* 热门商品 */}
            <HotGoods />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {/* 最近订单 */}
        <RecentOrders />
      </Col>
    </Row>
  );
};

export default Dashboard;
