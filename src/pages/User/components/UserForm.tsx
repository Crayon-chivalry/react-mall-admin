import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Drawer,
  Form,
  Input,
  Switch,
  Button,
  Tabs,
  Space,
  Avatar,
  type TabsProps,
} from "antd";

import { type UserItem } from "@/api/types";
import styles from "../index.module.scss";

export interface UserFormRef {
  showDrawer: (item: UserItem) => void;
}

// 表单验证规则
const rules = {
  phone: [{ required: true, message: "请输入标题" }],
  nickname: [{ required: true, message: "请输入姓名" }],
};

// 标签页
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "基本信息",
  },
  {
    key: "2",
    label: "账号安全",
  },
];

const UserForm = forwardRef<UserFormRef, {}>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<UserItem>();
  const [tabsKey, setTabsKey] = useState("1");
  const [password, setPassword] = useState("")
  const [payPassword, setPayPassword] = useState("")
  const avatar = form.getFieldValue("avatar") as string;

  // 打开抽屉
  const showDrawer = (item: UserItem) => {
    console.log(item);
    if (item) {
      form.setFieldsValue({ ...item });
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 标签页切换
  const tabsChange = (key: string) => {
    setTabsKey(key);
  };

  // 提交
  const onFinish = () => {};

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  return (
    <Drawer title="编辑用户信息" onClose={onClose} open={open}>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className={styles["form-tabs"]}
        onChange={tabsChange}
      />

      {/* 基本信息 */}
      {tabsKey === "1" && (
        <>
          <div className={styles["avatar-wrap"]}>
            <Avatar size={80} src={avatar} />
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{}}
            onFinish={onFinish}
          >
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
              label="状态"
              name="status"
              valuePropName="checked"
            >
              <Switch checkedChildren="正常" unCheckedChildren="冻结" />
            </Form.Item>
            <Form.Item<UserItem> label="注册时间" name="createdAt">
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {/* 账号安全 */}
      {tabsKey === "2" && (
        <Form form={form} layout="vertical">
          <Form.Item label="登录密码">
            <Space.Compact style={{ width: "100%" }}>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button type="primary">确认修改</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="支付密码">
            <Space.Compact style={{ width: "100%" }}>
              <Input
                type="password"
                value={payPassword}
                onChange={(e) => {
                  setPayPassword(e.target.value);
                }}
              />
              <Button type="primary">确认修改</Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
});

export default UserForm;
