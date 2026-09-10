import { useEffect, useState } from "react";
import { Col, Row, Statistic, type StatisticProps } from "antd";
import CountUp from "react-countup";

import { statsApi } from "@/api/statsApi";
import styles from "./index.module.scss";

const CountUpComponent = (CountUp as any).default ?? CountUp;

import SalesCharts from "./components/SalesCharts";
import RecentOrders from "./components/RecentOrders";
import HotGoods from "./components/HotGoods";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUpComponent end={value as number} separator="," />
);

const Dashboard = () => {
  const [totalList, setTotalList] = useState([
    {
      id: 1,
      name: "总销售额",
      value: 0,
      icon: "/src/assets/images/sales.png",
    },
    {
      id: 2,
      name: "订单总量",
      value: 0,
      icon: "/src/assets/images/order-num.png",
    },
    {
      id: 3,
      name: "新增用户",
      value: 0,
      icon: "/src/assets/images/user-num.png",
    },
    {
      id: 4,
      name: "转化率",
      value: 3.4,
      icon: "/src/assets/images/conver-rate.png",
    },
  ]);

  // 获取总销量、订单总量、用户总量
  const getSummary = async () => {
    const { data: res } = await statsApi.summary();
    setTotalList([
      { ...totalList[0], value: res.data.totalSales },
      { ...totalList[1], value: res.data.totalOrders },
      { ...totalList[2], value: res.data.totalUsers },
      { ...totalList[3] },
    ]);
  };

  useEffect(() => {
    getSummary();
  }, []);

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
                <div className={styles["total-value"]}>
                  <Statistic
                    value={item.value}
                    formatter={formatter}
                    styles={{
                      content: {
                        fontSize: 30,
                      },
                    }}
                  />
                </div>
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
