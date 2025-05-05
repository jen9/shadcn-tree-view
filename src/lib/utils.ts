import { TreeDataItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flattenTree(items: TreeDataItem[]): TreeDataItem[] {
  return items
    .map((item: TreeDataItem) => [
      item,
      ...(item.children ? flattenTree(item.children) : []),
    ])
    .reduce((acc, val) => acc.concat(val), []);
}
