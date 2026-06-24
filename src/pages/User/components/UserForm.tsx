import { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Form, Input, Button, Switch, App } from "antd";

import UploadImages from "@/components/UploadImages";
import { type UserItem } from "@/api/types";
import styles from "../index.module.scss";
import { userApi } from "@/api/userApi";

export interface UserFormRef {
  showDrawer: (item?: UserItem) => void;
}

type UserFormProps = {
  onSuccess?: (item: UserItem) => void;
};

// 表单验证规则
const rules = {
  avatar: [{ required: true, message: "请上传头像" }],
  phone: [{ required: true, message: "请输入标题" }],
  nickname: [{ required: true, message: "请输入姓名" }],
  password: [{ required: true, message: "请输入登录密码" }],
  payPassword: [{ required: true, message: "请输入支付密码" }],
};

const UserForm = forwardRef<UserFormRef, UserFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<UserItem>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserItem | null>(null);
  const { onSuccess } = props;

  // 打开抽屉
  const showDrawer = (item?: UserItem) => {
    setEditingItem(item ?? null);
    if (item) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 1 });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 提交
  const onFinish = async (values: UserItem) => {
    const { data: res } = editingItem
      ? await userApi.update(editingItem.userId, values)
      : await userApi.add(values);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer title={editingItem ? "编辑用户" : "添加用户"} onClose={onClose} open={open}>
      <Form
        form={form}
        layout="vertical"
        className={styles["form"]}
        onFinish={onFinish}
      >
        <Form.Item<UserItem> label="头像" name="avatar" rules={rules.avatar}>
          <UploadImages
            initialUrls={editingItem?.avatar ? [editingItem.avatar] : []}
            onUploadSuccess={(urls) => {
              form.setFieldsValue({ avatar: urls[0] });
            }}
          />
        </Form.Item>
        <Form.Item<UserItem> label="手机号" name="phone" rules={rules.phone}>
          <Input size="large" placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item<UserItem>
          label="姓名"
          name="nickname"
          rules={rules.nickname}
        >
          <Input size="large" placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item<UserItem>
          label="登录密码"
          name="password"
          rules={editingItem ? [] : rules.password}
        >
          <Input size="large" type="password" placeholder="请输入登录密码" />
        </Form.Item>
        <Form.Item<UserItem>
          label="支付密码"
          name="payPassword"
          rules={editingItem ? [] : rules.payPassword}
        >
          <Input size="large" type="password" placeholder="请输入支付密码" />
        </Form.Item>
        <Form.Item<UserItem>
          label="状态"
          name="status"
          valuePropName="checked"
          getValueProps={(value) => ({ checked: value === 1 })}
          getValueFromEvent={(checked) => (checked ? 1 : 2)}
        >
          <Switch checkedChildren="正常" unCheckedChildren="冻结" />
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

export default UserForm;
