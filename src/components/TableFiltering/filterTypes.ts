import { Dayjs } from "dayjs";

export type FilterValue = string | number | Dayjs | undefined
export type FormValues = Record<string, FilterValue>

export interface BaseFilterItem {
  label: string;
  name: string;
  placeholder: string;
}

export interface InputFilterItem extends BaseFilterItem {
  type: "input",
  defaultValue?: string;
}

export interface SelectFilterItem extends BaseFilterItem {
  type: "select";
  options: Array<{ label: string; value: string | number }>;
  defaultValue?: string | number;
}

export interface DateFilterItem extends BaseFilterItem {
  type: "date",
  defaultValue?: Dayjs
}

export type FilterItem = InputFilterItem | SelectFilterItem | DateFilterItem