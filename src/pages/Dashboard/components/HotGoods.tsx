import { useEffect, useState } from 'react';
import { Button } from 'antd';

import { statsApi } from "@/api/statsApi";
import styles from "../index.module.scss"

interface ProductItem {
  productCover: string
  productId: number
  productName: string
  rank: number
  sales: number
}

const HotGoods = () => {
  const [list, setList] = useState<ProductItem[]>([])

  // 获取热销商品
  const getTopProducts = async () => {
    const { data: res } = await statsApi.topProducts()
    setList(res.data.list)
  }

  useEffect(() => {
    getTopProducts()
  }, [])

  return (
    <div className={styles["hot-goods"]}>
      <div className={styles["card-title"]}>畅销商品榜</div>
      <div className={styles["goods"]}>
        {list.map(item => 
          <div className={styles["goods-item"]} key={item.productId}>
          <div className={styles["goods-left"]}>
            <img src={item.productCover} className={styles["goods-cover"]} />
            <div>
              <div className={styles["goods-name"]}>{item.productName}</div>
              <div className={styles["goods-label"]}>{item.sales} 销售额</div>
            </div>
          </div>
        </div>
        )}
      </div>
      <Button block size='large'>查看全部排行榜</Button>
    </div>
  )
}

export default HotGoods