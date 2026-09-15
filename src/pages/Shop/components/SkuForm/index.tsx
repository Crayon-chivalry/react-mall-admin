import { Button, Card, Flex, Input, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import type { SkuItem } from "@/api/types";
import UploadImages from "@/components/UploadImages";
import styles from "./index.module.scss";

const EMPTY_SKU: SkuItem = {
  title: "",
  specs: [{ name: "", value: "" }],
  price: "",
  stock: 0,
  cover: "",
  isDefault: false,
};

interface SkuFormProps {
  value?: SkuItem[];
  onChange?: (skus: SkuItem[]) => void;
}

const SkuForm = ({ value = [], onChange }: SkuFormProps) => {
  const update = (newSkus: SkuItem[]) => onChange?.(newSkus);

  const updateSku = (index: number, field: keyof SkuItem, val: any) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: val };
    update(next);
  };

  const updateSpec = (skuIdx: number, specIdx: number, field: "name" | "value", val: string) => {
    const next = [...value];
    const specs = [...next[skuIdx].specs];
    specs[specIdx] = { ...specs[specIdx], [field]: val };
    next[skuIdx] = { ...next[skuIdx], specs };
    update(next);
  };

  const addSpec = (skuIdx: number) => {
    const next = [...value];
    next[skuIdx] = { ...next[skuIdx], specs: [...next[skuIdx].specs, { name: "", value: "" }] };
    update(next);
  };

  const removeSpec = (skuIdx: number, specIdx: number) => {
    const next = [...value];
    next[skuIdx] = { ...next[skuIdx], specs: next[skuIdx].specs.filter((_, i) => i !== specIdx) };
    update(next);
  };

  return (
    <div className={styles["sku-list"]}>
      {value.map((sku, skuIdx) => (
        <Card
          key={skuIdx}
          size="small"
          className={styles["sku-card"]}
          title={<span className={styles["sku-card-title"]}>规格 {skuIdx + 1}</span>}
          extra={
            value.length > 1 && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => update(value.filter((_, i) => i !== skuIdx))}
              >
                删除
              </Button>
            )
          }
        >
          {/* 基本信息 */}
          <Flex vertical gap={16}>
            <div>
              <div className={styles["field-label"]}>规格名称</div>
              <Input
                placeholder="如：红色-XL"
                value={sku.title}
                onChange={(e) => updateSku(skuIdx, "title", e.target.value)}
              />
            </div>

            <Flex gap={16}>
              <div style={{ flex: 1 }}>
                <div className={styles["field-label"]}>价格</div>
                <InputNumber
                  stringMode
                  placeholder="请输入价格"
                  value={sku.price}
                  onChange={(v) => updateSku(skuIdx, "price", v)}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles["field-label"]}>库存</div>
                <InputNumber
                  placeholder="请输入库存"
                  value={sku.stock}
                  onChange={(v) => updateSku(skuIdx, "stock", v)}
                  style={{ width: "100%" }}
                />
              </div>
            </Flex>

            <div>
              <div className={styles["field-label"]}>规格封面图</div>
              <UploadImages
                initialUrls={sku.cover ? [sku.cover] : []}
                onUploadSuccess={(urls) => updateSku(skuIdx, "cover", urls[0] || "")}
              />
            </div>
          </Flex>

          {/* 规格项 */}
          <div className={styles["spec-list"]}>
            <div className={styles["spec-header"]}>
              <span className={styles["field-label"]} style={{ marginBottom: 0 }}>规格项</span>
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => addSpec(skuIdx)}
              >
                添加
              </Button>
            </div>
            <Flex vertical gap={8}>
              {sku.specs.map((spec, specIdx) => (
                <Flex key={specIdx} gap={8} align="middle">
                  <Input
                    className={styles["spec-name"]}
                    placeholder="规格名"
                    value={spec.name}
                    onChange={(e) => updateSpec(skuIdx, specIdx, "name", e.target.value)}
                  />
                  <Input
                    style={{ flex: 1 }}
                    placeholder="规格值"
                    value={spec.value}
                    onChange={(e) => updateSpec(skuIdx, specIdx, "value", e.target.value)}
                  />
                  {sku.specs.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeSpec(skuIdx, specIdx)}
                    />
                  )}
                </Flex>
              ))}
            </Flex>
          </div>
        </Card>
      ))}

      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={() => update([...value, { ...EMPTY_SKU }])}
      >
        添加规格
      </Button>
    </div>
  );
};

export default SkuForm;
