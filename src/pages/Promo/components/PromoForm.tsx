import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Switch,
  Radio,
  Flex,
  Space,
  App,
  type RadioChangeEvent,
} from "antd";

import UploadImages from "@/components/UploadImages";
import type { PromoItem, PromoImageItem } from "@/api/types";
import { contentApi } from "@/api/contentApi";

export interface PromoFormRef {
  showDrawer: (item?: PromoItem, role?: string) => void;
}

interface PromoFormProps {
  onSuccess?: (item: PromoItem) => void;
}

type LayoutType = "single" | "double" | "triple";

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  layoutType: [{ required: true, message: "请选择布局类型" }],
  imageItems: [{ required: true, message: "请上传图片" }],
};

const PromoForm = forwardRef<PromoFormRef, PromoFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<PromoItem>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromoItem | null>(null);
  const { onSuccess } = props;
  const [maxCount, setMaxCount] = useState(1);
  const upImages = Form.useWatch("imageItems", form);
  const initialImageUrls = useMemo(
    () => editingItem?.imageItems.map((item) => item.imageUrl) ?? [],
    [editingItem],
  );

  // 打开抽屉
  const showDrawer = (item?: PromoItem) => {
    setEditingItem(item ?? null);
    if (item) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
      form.setFieldsValue({ isEnabled: true, layoutType: "single" });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  // 布局类型改变时
  const radioChange = (e: RadioChangeEvent) => {
    const type = e.target.value as LayoutType;
    const MAX_COUNT_MAP: Record<LayoutType, number> = {
      single: 1,
      double: 2,
      triple: 3,
    };
    setMaxCount(MAX_COUNT_MAP[type]);
  };

  // 提交
  const onFinish = async (values: PromoItem) => {
    const { data: res } = editingItem
      ? await contentApi.promoUpdate(editingItem.id, values)
      : await contentApi.promoAdd(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer
      title={editingItem ? "编辑广告" : "新增广告"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item<PromoItem> label="标题" name="title" rules={rules.title}>
          <Input size="large" placeholder="请输入标题" />
        </Form.Item>
        <Form.Item<PromoItem>
          label="布局类型"
          name="layoutType"
          rules={rules.layoutType}
        >
          <Radio.Group
            options={[
              { value: "single", label: "单图" },
              { value: "double", label: "双图" },
              { value: "triple", label: "三图" },
            ]}
            onChange={radioChange}
          />
        </Form.Item>
        <Form.Item<PromoItem>
          label="图片"
          name="imageItems"
          rules={rules.imageItems}
        >
          <UploadImages
            maxCount={maxCount}
            initialUrls={initialImageUrls}
            onUploadSuccess={(urls) => {
              const prevItems = form.getFieldValue("imageItems") || [];
              form.setFieldsValue({
                imageItems: urls.map((url, index) => {
                  const existing = prevItems?.find(
                    (item: PromoImageItem) => item.imageUrl === url,
                  );
                  return {
                    imageUrl: url,
                    linkUrl: existing?.linkUrl ?? "",
                    title: existing?.title ?? "",
                  };
                }),
              });
            }}
          />
        </Form.Item>
        {upImages?.length > 0 && (
          <Form.Item label="图片跳转链接">
            <Flex vertical gap="small">
              {upImages.map((item: PromoImageItem, index: number) => (
                <Space.Compact key={item.imageUrl}>
                  <Space.Addon>图片{index + 1}</Space.Addon>
                  <Input
                    size="large"
                    placeholder="请输入跳转链接,可不填"
                    value={item.linkUrl}
                    onChange={(e) => {
                      const newItems = [...upImages];
                      newItems[index] = {
                        ...newItems[index],
                        linkUrl: e.target.value,
                      };
                      form.setFieldsValue({ imageItems: newItems });
                    }}
                  />
                </Space.Compact>
              ))}
            </Flex>
          </Form.Item>
        )}
        <Form.Item<PromoItem>
          label="启用"
          name="isEnabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default PromoForm;
