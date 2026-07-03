import { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Form, Input, Button, App, Switch } from "antd";

import type { RolesItem } from "@/api/types";
import { rbacApi } from "@/api/rbacApi";

export interface RolesFormRef {
  showDrawer: (item?: RolesItem) => void;
}

type RolesFormProps = {
  onSuccess?: (item?: RolesItem) => void;
};

const { TextArea } = Input;
// 表单验证规则
const rules = {
  code: [{ required: true, message: "请输入角色编码" }],
  name: [{ required: true, message: "请输入名称" }],
  description: [{ required: true, message: "请输入描述" }],
};

const RolesForm = forwardRef<RolesFormRef, RolesFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<RolesItem>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RolesItem | null>(null);
  const { onSuccess } = props;

  // 打开抽屉
  const showDrawer = async (item?: RolesItem) => {
    setEditingItem(item ?? null);
    if (item) {
      form.setFieldsValue({...item});
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 提交
  const onFinish = async (values: RolesItem) => {
    const { data: res } = editingItem
      ? await rbacApi.updateRole(editingItem.id, values)
      : await await rbacApi.createRole(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer
      title={editingItem ? "编辑角色" : "添加角色"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item<RolesItem> label="角色名称" name="name" rules={rules.name}>
          <Input size="large" placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item<RolesItem> label="角色编码" name="code" rules={rules.code}>
          <Input size="large" placeholder="请输入角色编码" />
        </Form.Item>
        <Form.Item<RolesItem>
          label="角色描述"
          name="description"
          rules={rules.description}
        >
          <TextArea rows={2} placeholder="请输入角色描述" />
        </Form.Item>
        <Form.Item<RolesItem> label="启用" name="isEnabled" valuePropName="checked">
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

export default RolesForm;
