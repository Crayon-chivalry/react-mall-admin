import { useEffect, useState } from "react";
import { Col, Row, Statistic, type StatisticProps } from "antd";
import CountUp from "react-countup";

import { statsApi } from "@/api/statsApi";
import styles from "./index.module.scss";

const CountUpComponent = (CountUp as any).default ?? CountUp;

import SalesCharts from "./components/SalesCharts";
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
    <Row gutter={[0, { xs: 16, sm: 16, md: 24, xl: 32 }]}>
      {/* 汇总数据 */}
      <Col span={24}>
        <Row
          gutter={[
            { xs: 8, sm: 12, md: 16, lg: 24 },
            { xs: 8, sm: 12, md: 16, lg: 24 },
          ]}
        >
          {totalList.map((item) => (
            <Col xs={24} md={12} lg={6} key={item.id}>
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
        <Row
          gutter={[
            { xs: 0, sm: 0, md: 16, xl: 24 },
            { xs: 16, sm: 16, md: 16, xl: 24 },
          ]}
        >
          <Col xs={24} xl={16}>
            {/* 销售图表 */}
            <SalesCharts />
          </Col>
          <Col xs={24} xl={8}>
            {/* 热门商品 */}
            <HotGoods />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
