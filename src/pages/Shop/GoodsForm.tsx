import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Divider,
  Flex,
  Switch,
  InputNumber,
  App
} from "antd";
import { PlusOutlined, RiseOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import type { GoodsItem, CategoriesItem } from "@/api/types";
import { categoriesApi } from "@/api/categoriesApi";
import { goodsApi } from "@/api/goodsApi";
import PageHeader from "@/components/PageHeader";
import UploadImages from "@/components/UploadImages";
import RichEditor from "@/components/RichEditor";

const rules = {
  name: [{ required: true, message: "请输入商品名称" }],
  categoryId: [{ required: true, message: "请选择商品类目" }],
  images: [{ required: true, message: "至少上传一张主图" }],
  price: [{ required: true, message: "请输入商品价格" }],
  stock: [{ required: true, message: "请输入商品库存" }],
};

const GoodsForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [categoriesList, setCategoriesList] = useState<CategoriesItem[]>([]);
  const [editingItem, setEditingItem] = useState<GoodsItem | null>(null);

  // 获取二级分类
  const getCategoriesList = async () => {
    const { data: res } = await categoriesApi.parentList(2);
    setCategoriesList(res.data);
  };

  const onFinish = async (values: GoodsItem) => {
    console.log(values);
    const { data: res } = editingItem
      ? await goodsApi.update(editingItem.id, values)
      : await goodsApi.add(values);
    message.success(res.message);
  };

  useEffect(() => {
    getCategoriesList();
  }, []);

  return (
    <div className="column-gap">
      {/* 顶部标题栏 */}
      <PageHeader title="新增商品">
        <Button type="primary" size="large" icon={<PlusOutlined />}>
          保存商品
        </Button>
      </PageHeader>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="column-gap">
          {/* 基本信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>基本信息</div>
            <Divider />
            <Form.Item<GoodsItem>
              label="商品名称"
              name="name"
              rules={rules.name}
            >
              <Input size="large" placeholder="请输入名称" />
            </Form.Item>
            <Form.Item<GoodsItem>
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
            <Form.Item<GoodsItem> label="商品描述" name="description">
              <Input size="large" placeholder="请输入商品描述" />
            </Form.Item>
          </div>

          {/* 销售信息 / 规格 */}
          <div className="app-card">
            <Flex justify="space-between">
              <div className={styles["card-title"]}>销售信息</div>
              <Flex gap="small">
                <Switch defaultChecked />
                <div>启用多规格</div>
              </Flex>
            </Flex>
            <Divider />
            <Flex wrap gap="middle">
              <Form.Item<GoodsItem>
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
              <Form.Item<GoodsItem>
                label="商品库存"
                name="stock"
                rules={rules.stock}
              >
                <InputNumber
                  stringMode
                  placeholder="请输入商品价格"
                  className={styles["input-number"]}
                />
              </Form.Item>
            </Flex>
          </div>

          {/* 图文信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>图文信息</div>
            <Divider />
            <Form.Item<GoodsItem>
              label="商品主图"
              name="images"
              rules={rules.images}
            >
              <UploadImages
                initialUrls={editingItem?.images ? editingItem.images : []}
                onUploadSuccess={(urls) => {
                  form.setFieldsValue({ images: urls });
                }}
              />
            </Form.Item>
            <Form.Item<GoodsItem> label="商品封面图">
              <UploadImages
                initialUrls={editingItem?.cover ? [editingItem.cover] : []}
                onUploadSuccess={(urls) => {
                  form.setFieldsValue({ cover: urls[0] });
                }}
              />
              <div className={styles["prompt"]}>
                可不传，封面图默认为商品主图第一张
              </div>
            </Form.Item>
            <Form.Item<GoodsItem> name="detailContent" label="商品详情">
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

export default GoodsForm;
