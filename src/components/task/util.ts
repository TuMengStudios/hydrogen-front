import { post } from "@/api/request";
import { Fold, Ignore, Property, PropertyItem } from "./types";
import { ElMessage } from "element-plus";
import qs from "qs";

const parserProperty = async (plainText: string, sep: string): Promise<Property> => {
  let obj;
  try {
    obj = JSON.parse(plainText);
  } catch (err) {
    ElMessage({ message: `${err}`, type: "error" });
  }
  let req = {
    sep: sep,
    plain_text: obj,
  };
  let res = await post<Property>("/debug/property", req);
  return res.data;
};

// joinKey
export const joinKey = (pre_key: string, curr_name: string, sep: string): string => {
  if (pre_key === "") {
    return curr_name;
  } else {
    return `${pre_key}${sep}${curr_name}`;
  }
};

export const computeKey = (item: PropertyItem, pre_key: string, sep: string): string[] => {
  let res: string[] = [];
  if (!item) {
    return res;
  }
  // res.add(joinKey(pre_key, item.node_name, sep));
  res.push(joinKey(pre_key, item.node_name, sep));
  let new_key = joinKey(pre_key, item.node_name, sep);
  for (let node of item.props) {
    let sub = computeKey(node, new_key, sep);
    for (let val of sub) {
      // res.add(val);
      res.push(val);
    }
  }

  return res;
};

export const computeIgnore = (item: PropertyItem, pre_key: string, sep: string): string[] => {
  let res: string[] = [];
  if (!item) {
    return res;
  }

  if (item.op && item.op === Ignore) {
    res.push(joinKey(pre_key, item.node_name, sep));
    return res;
  }

  let new_key = joinKey(pre_key, item.node_name, sep);

  for (let node of item.props) {
    let sub = computeIgnore(node, new_key, sep);
    for (let v of sub) {
      res.push(v);
    }
  }
  return res;
};

export const computeFold = (item: PropertyItem, pre_key: string, sep: string): string[] => {
  let res: string[] = [];
  if (!item) {
    return res;
  }
  if (item.op && item.op === Fold) {
    res.push(joinKey(pre_key, item.node_name, sep));
    return res;
  }
  let new_key = joinKey(pre_key, item.node_name, sep);

  for (let node of item.props) {
    let sub = computeFold(node, new_key, sep);
    for (let v of sub) {
      res.push(v);
    }
  }

  return res;
};

const fetchTopics = async (params: string) => {
  let res = await post("/fetch/kafka/topics", { paras: params });
  if (res.err_no !== 10000) {
    ElMessage({ message: res.err_msg, type: "error" });
    return;
  }
  return res.data;
};
