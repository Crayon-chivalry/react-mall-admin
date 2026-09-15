import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Divider,
  Image,
  Timeline,
  Select,
  App,
  type FormInstance,
} from "antd";

import { shopApi } from "@/api/shopApi";
import type { OrderItem } from "@/api/types";
import { formatLocalTime } from "@/utils/date";
import styles from "./index.module.scss";
import { createStatusTagRenderer, defineStatusOptions } from "@/utils/status";
import { expressList } from "../components/OrderShipModal";
import PageHeader from "@/components/PageHeader";
import AddressCascader from "@/components/AddressCascader";

const paymentMethods: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信支付",
};

// 类型列表配置
const statusList = defineStatusOptions<OrderItem["status"]>([
  { label: "待付款", value: "pending", color: "red" },
  { label: "待发货", value: "paid", color: "green" },
  { label: "已发货", value: "shipped", color: "warning" },
  { label: "已完成", value: "completed" },
]);
const renderStatusTag = createStatusTagRenderer(statusList);

const OrderDetails = () => {
  const { message } = App.useApp();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const [order, setOrder] = useState<OrderItem | null>(null);

  // 获取订单
  const getDetails = async () => {
    const { data: res } = await shopApi.orderDetails(Number(id));
    const data = res.data;
    const formValues = {
      ...data,
      address: [data.province, data.city, data.district].filter(Boolean),
      createdAt: formatLocalTime(data.createdAt, "datetime"),
      paidAt: data.paidAt ? formatLocalTime(data.paidAt, "datetime") : "-",
      paymentType: paymentMethods[data.paymentType] || "-",
    };
    setOrder(formValues);
    form.setFieldsValue(formValues);
  };

  // 提交
  const onFinish = async (values: any) => {
    if (!order?.id) {
      message.error("订单不存在");
      return;
    }
    const { address, ...restValues } = values;
    const { data: res } = await shopApi.updateOrder(order.id, {
      ...restValues,
      province: address?.[0] ?? "",
      city: address?.[1] ?? "",
      district: address?.[2] ?? "",
    });
    message.success(res.message);
    // 如果状态为待付款，且填写了物流信息，则重新获取数据
    if (
      order.status === "paid" &&
      restValues.expressCompany &&
      restValues.shippingNo
    ) {
      getDetails();
    }
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  return (
    <div className="column-gap">
      <PageHeader title="订单详情" showBack>
        <Button
          type="primary"
          size="large"
          onClick={() => formRef?.current?.submit()}
        >
          保存订单
        </Button>
      </PageHeader>

      <Form form={form} layout="vertical" ref={formRef} onFinish={onFinish}>
        <div className="column-gap">
          {/* 基本信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>
              基本信息
              {order && renderStatusTag(order.status)}
            </div>
            <Divider />
            <Form.Item<OrderItem> label="订单号">{order?.orderNo}</Form.Item>
            <Form.Item<OrderItem> label="下单时间">
              {order?.createdAt}
            </Form.Item>
            <Form.Item<OrderItem> label="付款时间">{order?.paidAt}</Form.Item>
            <Form.Item<OrderItem> label="付款方式">
              {order?.paymentType}
            </Form.Item>
            <Form.Item<OrderItem> label="总金额">
              {order?.totalAmount}
            </Form.Item>
            <Form.Item<OrderItem> label="备注" name="remark">
              <Input size="large" placeholder="订单备注，可不填" />
            </Form.Item>
          </div>

          {/* 商品 */}
          <div className="app-card">
            <div className={styles["card-title"]}>商品信息</div>
            <div className={styles["products"]}>
              {order?.items.map((item) => (
                <div key={item.id} className={styles["product-item"]}>
                  <Image width={80} src={item.productCover} />
                  <div className={styles["content"]}>
                    <div className={styles["name-row"]}>
                      <div className={styles["name"]}>{item.productName}</div>
                      <span className={styles["quantity"]}>
                        x{item.quantity}
                      </span>
                    </div>
                    <div className={styles["label"]}>
                      {item.skuTitle || "无规格"}
                    </div>
                    <div className={styles["meta"]}>
                      <span className={styles["price"]}>￥{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 收货信息 */}
          <div className="app-card">
            <div className={styles["card-title"]}>收货信息</div>
            <Divider />
            <Form.Item<OrderItem> label="收货人" name="receiverName">
              <Input size="large" placeholder="请输入收货人" />
            </Form.Item>
            <Form.Item<OrderItem> label="手机号码" name="receiverPhone">
              <Input size="large" placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item label="地址" name="address">
              <AddressCascader />
            </Form.Item>
            <Form.Item<OrderItem> label="详细地址" name="detailAddress">
              <Input size="large" placeholder="请输入详细地址" />
            </Form.Item>
          </div>

          {/* 物流信息 */}
          {order?.status !== "pending" && (
            <div className="app-card">
              <div className={styles["card-title"]}>物流信息</div>
              <Divider />
              <Form.Item<OrderItem> label="快递公司" name="expressCompany">
                {/* <Input size="large" placeholder="请输入收货人" /> */}
                <Select
                  size="large"
                  fieldNames={{ value: "label" }}
                  options={expressList}
                  placeholder="请选择快递公司"
                />
              </Form.Item>
              <Form.Item<OrderItem> label="快递单号" name="shippingNo">
                <Input size="large" placeholder="请输入快递单号" />
              </Form.Item>
              <Timeline
                items={[
                  {
                    children: "Create a services site 2015-09-01",
                  },
                  {
                    children: "Solve initial network problems 2015-09-01",
                  },
                  {
                    children: "Technical testing 2015-09-01",
                  },
                  {
                    children: "Network problems being solved 2015-09-01",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Form>

      <Button type="primary" block size="large" onClick={() => formRef?.current?.submit()}>
        保存订单
      </Button>
    </div>
  );
};

export default OrderDetails;
