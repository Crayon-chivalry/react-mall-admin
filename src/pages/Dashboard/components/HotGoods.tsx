import { Statistic, Button } from 'antd';

import styles from "../index.module.scss"

const HotGoods = () => {
  return (
    <div className={styles["hot-goods"]}>
      <div className={styles["card-title"]}>畅销商品榜</div>
      <div className={styles["goods"]}>
        <div className={styles["goods-item"]}>
          <div className={styles["goods-left"]}>
            <img src="/src/assets/images/goods-cover.png" className={styles["goods-cover"]} />
            <div>
              <div className={styles["goods-name"]}>商品名称</div>
              <div className={styles["goods-label"]}>2143销售额</div>
            </div>
          </div>
          <Statistic value={112893} prefix="￥" valueStyle={{color: "#934600", fontSize: "14px"}} />
        </div>
      </div>
      <Button block size='large'>查看全部排行榜</Button>
    </div>
  )
}

export default HotGoods