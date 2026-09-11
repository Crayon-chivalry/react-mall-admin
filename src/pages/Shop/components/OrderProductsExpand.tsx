import { Avatar, Flex } from "antd";

import type { OrderProductItem } from "@/api/types";

const formatSpecs = (skuSpecs?: OrderProductItem["skuSpecs"]) => {
  const validSpecs = (skuSpecs || []).filter(
    (spec) => spec.name && spec.value,
  );

  return (
    validSpecs
      .map((spec) => `${spec.name}：${spec.value}`)
      .join(" / ") || "默认"
  );
};

type OrderProductsExpandProps = {
  items?: OrderProductItem[];
};

const OrderProductsExpand = ({ items }: OrderProductsExpandProps) => {
  if (!items || items.length === 0) {
    return <div style={{ padding: 16, color: "#6b7280" }}>暂无商品</div>;
  }

  return (
    <div style={{ padding: 16, background: "#f6f8fb" }}>
      {items.map((item, index) => {
        const specsText = formatSpecs(item.skuSpecs);

        return (
          <Flex
            key={item.id}
            align="center"
            gap="middle"
            style={{
              padding: "12px 0",
              borderBottom:
                index < items.length - 1 ? "1px solid #e6eaf0" : "none",
            }}
          >
            <Avatar
              size={48}
              shape="square"
              src={item.productCover || "/src/assets/images/logo.png"}
            />

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {item.productName}
              </div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>{specsText}</div>
            </div>

            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>数量</div>
              <div style={{ fontWeight: 600 }}>{item.quantity}件</div>
            </div>

            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>单价</div>
              <div style={{ fontWeight: 600 }}>￥{item.price}</div>
            </div>
          </Flex>
        );
      })}
    </div>
  );
};

export default OrderProductsExpand;
