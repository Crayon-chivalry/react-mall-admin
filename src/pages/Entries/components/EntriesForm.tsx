import { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Form, Input, Button, Switch, App } from "antd";

import UploadImages from "@/components/UploadImages";
import type { EntriesItem } from "@/api/types";
import { contentApi } from "@/api/contentApi";

export interface EntriesFormRef {
  showDrawer: (item?: EntriesItem) => void;
}

type EntriesFormProps = {
  onSuccess?: (item: EntriesItem) => void;
};

// 表单验证规则
const rules = {
  iconUrl: [{ required: true, message: "请上传图标" }],
  title: [{ required: true, message: "请输入标题" }],
  linkUrl: [{ required: true, message: "请输入跳转链接" }],
};

const EntriesForm = forwardRef<EntriesFormRef, EntriesFormProps>(
  (props, ref) => {
    const { message } = App.useApp();
    const [form] = Form.useForm<EntriesItem>();
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EntriesItem | null>(null);
    const { onSuccess } = props;

    // 打开抽屉
    const showDrawer = (item?: EntriesItem) => {
      setEditingItem(item ?? null);
      if (item) {
        form.setFieldsValue({ ...item });
      } else {
        form.resetFields();
        form.setFieldsValue({ isEnabled: true });
      }
      setOpen(true);
    };

    // 关闭抽屉
    const onClose = () => {
      form.resetFields();
      setOpen(false);
    };

    // 提交
    const onFinish = async (values: EntriesItem) => {
      console.log(editingItem?.id)
      const { data: res } = editingItem
        ? await contentApi.entriesUpdate(editingItem.id, values)
        : await contentApi.entriesAdd(values);
      message.success(res.message);
      onSuccess?.(res.data);
      onClose();
    };

    useImperativeHandle(ref, () => ({
      showDrawer,
    }));

    return (
      <Drawer
        title={editingItem ? "编辑入口" : "新增入口"}
        onClose={onClose}
        open={open}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item<EntriesItem>
            label="图标"
            name="iconUrl"
            rules={rules.iconUrl}
          >
            <UploadImages
              initialUrls={editingItem?.iconUrl ? [editingItem.iconUrl] : []}
              onUploadSuccess={(urls) => {
                form.setFieldsValue({ iconUrl: urls[0] });
              }}
            />
          </Form.Item>
          <Form.Item<EntriesItem> label="标题" name="title" rules={rules.title}>
            <Input size="large" placeholder="请输入标题" />
          </Form.Item>
          <Form.Item<EntriesItem>
            label="跳转链接"
            name="linkUrl"
            rules={rules.linkUrl}
          >
            <Input size="large" placeholder="请输入跳转链接" />
          </Form.Item>
          <Form.Item<EntriesItem>
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
  },
);

export default EntriesForm;
