import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";

import { Form, Input, Button, App } from "antd";
import { QrcodeOutlined, KeyOutlined } from '@ant-design/icons';

import { userApi } from "@/api/userApi";
import styles from "./index.module.scss";

// 表单验证规则
const rules = {
  phone: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
};

// 定义表单字段类型
type FieldType = {
  phone: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate()
  const { signIn } = useUserStore()
  const { message } = App.useApp();

  // 确认登录
  const onFinish = async (values: FieldType) => {
    const { data: res } = await userApi.login(values);
    const loginData = res.data
    message.success(res.message);
    signIn(loginData.accessToken, loginData.user)
    navigate('/')
  };

  return (
    <div className={styles["page"]}>
      <div className={styles["card-wrap"]}>
        <div className={styles["card-bg"]} />
        <div className={styles["card"]}>
          <div className={styles["card-top"]}>
            <div className={styles["card-title"]}>欢迎回来</div>
            <div className={styles["card-label"]}>请输入您的凭据以访问后台系统</div>
          </div>

          {/* 表单 */}
          <Form
            layout="vertical"
            className={styles["form"]}
            onFinish={onFinish}
          >
            <Form.Item<FieldType>
              label="账号"
              name="phone"
              rules={rules.phone}
            >
              <Input size="large" placeholder="请输入账号" />
            </Form.Item>
            <Form.Item<FieldType>
              label="登录密码"
              name="password"
              rules={rules.password}
            >
              <Input.Password size="large" placeholder="请输入登录密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" htmlType="submit">
                确认登录
              </Button>
            </Form.Item>
          </Form>

          {/* 快捷登录 */}
          <div className={styles["fast"]}>
            <div className={styles["fast-title"]}>快捷安全登录</div>
            <div className={styles["fast-btns"]}>
              <div className={styles["fast-btn"]}>
                <QrcodeOutlined />
                扫码登录
              </div>
              <div className={styles["fast-btn"]}>
                <KeyOutlined />
                电子密钥
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
