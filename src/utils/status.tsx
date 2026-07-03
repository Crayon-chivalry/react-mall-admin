import { Tag } from "antd";

type StatusOption<T> = {
  label: string;
  value: T;
  color?: string;
};

export function createStatusTagRenderer<T>(
  options: ReadonlyArray<StatusOption<T>>,
  fallback?: { label?: string; color?: string }
) {
  return function renderStatusTag(status: T) {
    const item = options.find((option) => option.value === status);
    const color = item?.color ?? fallback?.color ?? "default";
    const label = item?.label ?? fallback?.label ?? "未知";

    return <Tag color={color}>{label}</Tag>;
  };
}
