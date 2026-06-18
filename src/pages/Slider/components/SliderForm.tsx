import { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Form, Input, InputNumber, Button, Switch, App } from "antd";

import UploadImages from "@/components/UploadImages";
import styles from "../index.module.scss";
import { sliderApi } from "@/api/sliderApi";
import type { SliderItem } from "@/api/types";

export interface SliderFormRef {
  showDrawer: (item?: SliderItem) => void;
}

// 定义表单字段类型
type FieldType = {
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  sort: number;
  isEnabled: boolean;
};

type SliderFormProps = {
  onSuccess?: (item?: SliderItem) => void;
};

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  imageUrl: [{ required: true, message: "请上传图片" }],
};

const SliderForm = forwardRef<SliderFormRef, SliderFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FieldType>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SliderItem | null>(null);
  const { onSuccess } = props;

  // 打开抽屉
  const showDrawer = (item?: SliderItem) => {
    setEditingItem(item ?? null);
    if (item) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
      form.setFieldsValue({ sort: 1, isEnabled: true });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 提交
  const onFinish = async (values: FieldType) => {
    const { data: res } = editingItem
      ? await sliderApi.update(editingItem.id, values)
      : await sliderApi.add(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer
      title={editingItem ? "编辑轮播图" : "添加轮播图"}
      onClose={onClose}
      open={open}
    >
      <Form
        form={form}
        layout="vertical"
        className={styles["form"]}
        initialValues={{sort: 1, isEnabled: true}}
        onFinish={onFinish}
      >
        <Form.Item<FieldType> label="标题" name="title" rules={rules.title}>
          <Input size="large" placeholder="请输入标题" />
        </Form.Item>
        <Form.Item<FieldType>
          label="图片"
          name="imageUrl"
          rules={rules.imageUrl}
        >
          <UploadImages
            initialUrls={editingItem?.imageUrl ? [editingItem.imageUrl] : []}
            onUploadSuccess={(urls) => {
              form.setFieldsValue({ imageUrl: urls[0] });
            }}
          />
        </Form.Item>
        <Form.Item<FieldType> label="排序权重" name="sort">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item<FieldType> label="启用" name="isEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item<FieldType> label="链接" name="linkUrl">
          <Input size="large" placeholder="请输入跳转链接" />
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

export default SliderForm;
