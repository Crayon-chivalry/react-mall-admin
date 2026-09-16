import { useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  App,
  type FormInstance,
} from "antd";

import { shopApi } from "@/api/shopApi";

interface ShipModalProps {
  id: number | null | undefined
  open: boolean
  onSuccess?: (item?: ShipParams) => void;
  onCancel?: () => void;
}

interface ShipParams {
  expressCompany: string;
  shippingNo: string;
}

// 表单验证规则
const rules = {
  expressCompany: [{ required: true, message: "请输入快递公司" }],
  shippingNo: [{ required: true, message: "请输入快递单号" }],
};

export const expressList = [
  { label: "顺丰快递" },
  { label: "中通快递" },
  { label: "圆通快递" },
  { label: "韵达快递" },
  { label: "极兔速递" },
];

const OrderShipModal = ({open, id, onCancel, onSuccess}: ShipModalProps) => {
  const { message } = App.useApp();
  const formRef = useRef<FormInstance | null>(null)

  // 确认发货
  const onFinish = async (values: ShipParams) => {
    if(!id) {
      message.error("请选择订单");
      return
    }
    const { data: res } = await shopApi.orderShip(id, values)
    message.success(res.message);
    onSuccess?.(res.data);
    onCancel?.();
  };

  useEffect(() => {
    formRef.current?.resetFields()
  }, [open])

  return (
    <Modal
      title="发货"
      footer={null}
      open={open}
      onCancel={onCancel}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item<ShipParams>
          label="快递公司"
          name="expressCompany"
          rules={rules.expressCompany}
        >
          <Select
            size="large"
            fieldNames={{ value: "label" }}
            options={expressList}
            placeholder="请选择快递公司"
          />
        </Form.Item>
        <Form.Item<ShipParams>
          label="快递单号"
          name="shippingNo"
          rules={rules.shippingNo}
        >
          <Input size="large" placeholder="请输入快递单号" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            确认发货
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderShipModal;
