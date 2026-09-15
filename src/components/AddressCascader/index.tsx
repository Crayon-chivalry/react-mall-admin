import { Cascader } from "antd";

import areaOptionsData from "@/assets/json/areas.json";

type AreaOption = {
  value: string;
  label: string;
  children?: AreaOption[];
};

const areaOptions = areaOptionsData as AreaOption[];

const matchOption = (option: AreaOption, target: string) => {
  return option.value === target || option.label === target;
};

const findValuePath = (nodes: AreaOption[], target: string[]): string[] | undefined => {
  if (target.length === 0) {
    return undefined;
  }

  for (const node of nodes) {
    if (!matchOption(node, target[0])) {
      continue;
    }

    if (target.length === 1) {
      return [node.value];
    }

    const childPath = node.children
      ? findValuePath(node.children, target.slice(1))
      : undefined;

    if (childPath) {
      return [node.value, ...childPath];
    }
  }

  return undefined;
};

const findLabelPath = (nodes: AreaOption[], target: string[]): string[] | undefined => {
  if (target.length === 0) {
    return undefined;
  }

  for (const node of nodes) {
    if (node.value !== target[0]) {
      continue;
    }

    if (target.length === 1) {
      return [node.label];
    }

    const childPath = node.children
      ? findLabelPath(node.children, target.slice(1))
      : undefined;

    if (childPath) {
      return [node.label, ...childPath];
    }
  }

  return undefined;
};

interface AddressCascaderProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  size?: "large" | "middle" | "small";
  allowClear?: boolean;
  disabled?: boolean;
}

const AddressCascader = ({
  value,
  onChange,
  placeholder = "请选择省/市/区",
  size = "large",
  allowClear = true,
  disabled = false,
}: AddressCascaderProps) => {
  const normalizedValue = value && value.length ? findValuePath(areaOptions, value) : undefined;

  return (
    <Cascader
      options={areaOptions}
      value={normalizedValue}
      onChange={(nextValue) => {
        const labels = nextValue ? findLabelPath(areaOptions, nextValue as string[]) : [];
        onChange?.(labels ?? []);
      }}
      placeholder={placeholder}
      size={size}
      showSearch
      allowClear={allowClear}
      disabled={disabled}
    />
  );
};

export default AddressCascader;
