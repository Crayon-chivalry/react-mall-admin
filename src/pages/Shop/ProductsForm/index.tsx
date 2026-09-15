import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Divider,
  Flex,
  Switch,
  InputNumber,
  type FormInstance,
  App,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import type { ProductItem, CategoriesItem, SkuItem } from "@/api/types";
import { shopApi } from "@/api/shopApi";
import PageHeader from "@/components/PageHeader";
import UploadImages from "@/components/UploadImages";
import RichEditor from "@/components/RichEditor";
import SkuForm from "../components/SkuForm";

const rules = {
  name: [{ required: true, message: "请输入商品名称" }],
  categoryId: [{ required: true, message: "请选择商品类目" }],
  images: [{ required: true, message: "至少上传一张主图" }],
  price: [{ required: true, message: "请输入商品价格" }],
  stock: [{ required: true, message: "请输入商品库存" }],
};

const EMPTY_SKU: SkuItem = {
  title: "",
  specs: [{ name: "", value: "" }],
  price: "",
  stock: 0,
  cover: "",
  isDefault: false,
};

// 保留后端需要的字段，过滤 sort/createdAt 等；id 用于编辑时匹配已有规格原地更新
const cleanSku = ({
  id,
  title,
  specs,
  price,
  stock,
  cover,
  isDefault,
}: SkuItem) => ({
  id,
  title,
  specs,
  price,
  stock,
  cover,
  isDefault,
});

// 校验多规格数据完整性，返回错误提示；null 表示通过
const validateSkus = (skus: SkuItem[]): string | null => {
  if (!skus.length) return "请至少添加一条规格";
  for (let i = 0; i < skus.length; i++) {
    const sku = skus[i];
    const no = i + 1;
    if (!sku.title?.trim()) return `第 ${no} 条规格尚未填写「规格名称」`;
    const price = Number(sku.price);
    if (
      sku.price === "" ||
      sku.price == null ||
      Number.isNaN(price) ||
      price <= 0
    )
      return `第 ${no} 条规格尚未填写有效「价格」`;
    const stock = Number(sku.stock);
    if (sku.stock == null || Number.isNaN(stock) || stock < 0)
      return `第 ${no} 条规格尚未填写有效「库存」`;
    const validSpecs = (sku.specs ?? []).filter(
      (s) => s?.name?.trim() && s?.value?.trim(),
    );
    if (!validSpecs.length)
      return `第 ${no} 条规格尚未填写「规格项」（规格名/规格值至少填一组）`;
  }
  return null;
};

const ProductsForm = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { message } = App.useApp();
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const [categoriesList, setCategoriesList] = useState<CategoriesItem[]>([]);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const specType = Form.useWatch("specType", form) ?? "single";
  const [skus, setSkus] = useState<SkuItem[]>([
    { ...EMPTY_SKU, isDefault: true },
  ]);

  const getCategoriesList = async () => {
    const { data: res } = await shopApi.categoriesParent(2);
    setCategoriesList(res.data);
  };

  const getGoodsDetail = async () => {
    const { data: res } = await shopApi.product(id as unknown as number);
    setEditingItem(res.data);
    form.setFieldsValue({ ...res.data, categoryId: res.data.category.id });
    // 无论单/多规格都加载真实 SKU（带 id），避免编辑/切换规格时使用无 id 的空规格导致后端误判新建
    if (res.data.skus?.length) {
      setSkus(res.data.skus.map(cleanSku));
    }
  };

  const onFinish = async (values: ProductItem) => {
    if (specType === "multi") {
      const err = validateSkus(skus);
      if (err) {
        message.warning(err);
        return;
      }
    }
    const payload = {
      ...values,
      ...(specType === "multi" ? { skus: skus.map(cleanSku) } : {}),
    };
    const { data: res } = editingItem
      ? await shopApi.updateProduct(editingItem.id, payload)
      : await shopApi.addProduct(payload);
    message.success(res.message);
  };

  useEffect(() => {
    getCategoriesList();
    if (id) getGoodsDetail();
    else form.setFieldValue("specType", "single");
  }, []);

  return (
    <div className="column-gap">
      <PageHeader title={id ? "编辑商品" : "新增商品"} showBack>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => formRef?.current?.submit()}
        >
          保存商品
        </Button>
      </PageHeader>
      <Form form={form} layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item<ProductItem> name="specType" hidden>
          <Input />
        </Form.Item>
        <div className="column-gap">
          {/* 基本信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>基本信息</div>
            <Divider />
            <Form.Item<ProductItem>
              label="商品名称"
              name="name"
              rules={rules.name}
            >
              <Input size="large" placeholder="请输入名称" />
            </Form.Item>
            <Form.Item<ProductItem>
              label="商品类目"
              name="categoryId"
              rules={rules.categoryId}
            >
              <Select
                options={categoriesList}
                fieldNames={{ label: "name", value: "id" }}
                placeholder="请选择商品类目"
                size="large"
              />
            </Form.Item>
            <Form.Item<ProductItem> label="商品描述" name="description">
              <Input size="large" placeholder="请输入商品描述" />
            </Form.Item>
          </div>

          {/* 销售信息 */}
          <div className="app-card">
            <Flex justify="space-between">
              <div className={styles["card-title"]}>销售信息</div>
              <Flex gap="small" align="center">
                <Switch
                  checked={specType === "multi"}
                  onChange={(checked) => {
                    form.setFieldValue(
                      "specType",
                      checked ? "multi" : "single",
                    );
                    if (checked) {
                      setSkus((prev) => {
                        // 已加载/已有真实规格数据时不覆盖
                        if (
                          prev.some(
                            (s) => s.id || s.title || s.price || s.stock,
                          )
                        )
                          return prev;
                        const name = form.getFieldValue("name") || "";
                        const price = form.getFieldValue("price");
                        const stock = form.getFieldValue("stock");
                        return [
                          {
                            ...EMPTY_SKU,
                            isDefault: true,
                            title: name,
                            price: price ?? "",
                            stock: stock ?? 0,
                          },
                        ];
                      });
                    }
                  }}
                />
                <div>启用多规格</div>
              </Flex>
            </Flex>
            <Divider />

            {specType === "single" ? (
              <Flex wrap gap="middle">
                <Form.Item<ProductItem>
                  label="商品价格"
                  name="price"
                  rules={rules.price}
                >
                  <InputNumber
                    stringMode
                    placeholder="请输入商品价格"
                    className={styles["input-number"]}
                  />
                </Form.Item>
                <Form.Item<ProductItem>
                  label="商品库存"
                  name="stock"
                  rules={rules.stock}
                >
                  <InputNumber
                    stringMode
                    placeholder="请输入商品库存"
                    className={styles["input-number"]}
                  />
                </Form.Item>
              </Flex>
            ) : (
              <SkuForm value={skus} onChange={setSkus} />
            )}
          </div>

          {/* 图文信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>图文信息</div>
            <Divider />
            <Form.Item<ProductItem>
              label="商品主图"
              name="images"
              rules={rules.images}
            >
              <UploadImages
                maxCount={9}
                initialUrls={editingItem?.images ?? []}
                onUploadSuccess={(urls) =>
                  form.setFieldsValue({ images: urls })
                }
              />
            </Form.Item>
            <Form.Item<ProductItem> label="商品封面图">
              <UploadImages
                initialUrls={editingItem?.cover ? [editingItem.cover] : []}
                onUploadSuccess={(urls) =>
                  form.setFieldsValue({ cover: urls[0] })
                }
              />
              <div className={styles["prompt"]}>
                可不传，封面图默认为商品主图第一张
              </div>
            </Form.Item>
            <Form.Item<ProductItem> name="detailContent" label="商品详情">
              <RichEditor />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProductsForm;
