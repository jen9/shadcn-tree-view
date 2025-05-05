import React from "react";
import { flattenTree } from "@/lib/utils";
import { TreeDataItem } from "@/types";

type KeyboardNavigationProps = {
  ref: React.RefObject<HTMLDivElement>;
  data: TreeDataItem[] | TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  setExpandedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
};

const getFocusableElements = (
  container: HTMLDivElement | null
): HTMLElement[] => {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll("[data-focusable]")
  ) as HTMLElement[];
};

const findItemById = (
  items: TreeDataItem[],
  id: string | null
): TreeDataItem | undefined => {
  return items.find((item) => item?.id === id);
};

const focusAndSelectElement = (
  element: HTMLElement,
  flatDataArray: TreeDataItem[],
  handleSelectChange: (item: TreeDataItem | undefined) => void
) => {
  element?.focus();
  const elementId = element?.getAttribute("data-item-id");
  const elementItem = findItemById(flatDataArray, elementId);
  handleSelectChange(elementItem);
};

function useTreeKeyboardNavigation({
  ref,
  data,
  handleSelectChange,
  setExpandedItemIds,
}: KeyboardNavigationProps) {
  React.useEffect(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    const flatDataArray = flattenTree(dataArray);

    const handleArrowUp = (
      currentIndex: number,
      focusableElements: HTMLElement[]
    ) => {
      const elementToFocus =
        currentIndex > 0
          ? focusableElements[currentIndex - 1]
          : focusableElements[focusableElements.length - 1];
      focusAndSelectElement(elementToFocus, flatDataArray, handleSelectChange);
    };

    const handleArrowDown = (
      currentIndex: number,
      focusableElements: HTMLElement[]
    ) => {
      const elementToFocus =
        currentIndex < focusableElements.length - 1
          ? focusableElements[currentIndex + 1]
          : focusableElements[0];
      focusAndSelectElement(elementToFocus, flatDataArray, handleSelectChange);
    };

    const handleArrowLeft = (currentItem: TreeDataItem | undefined) => {
      if (currentItem) {
        setExpandedItemIds((items) =>
          items.filter((id) => id !== currentItem.id)
        );
      }
    };

    const handleArrowRight = (currentItem: TreeDataItem | undefined) => {
      if (currentItem) {
        setExpandedItemIds((items) => [...items, currentItem.id]);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (!activeElement || !ref?.current?.contains(activeElement)) return;

      const focusableElements = getFocusableElements(ref.current);
      if (!focusableElements.length) return;

      const currentIndex = focusableElements.indexOf(activeElement);
      const currentItemId = activeElement?.getAttribute("data-item-id");
      const currentItem = findItemById(flatDataArray, currentItemId);

      switch (event.key) {
        case "ArrowUp":
          handleArrowUp(currentIndex, focusableElements);
          break;
        case "ArrowDown":
          handleArrowDown(currentIndex, focusableElements);
          break;
        case "ArrowLeft":
          handleArrowLeft(currentItem);
          break;
        case "ArrowRight":
          handleArrowRight(currentItem);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, handleSelectChange, ref, setExpandedItemIds]);
}

export default useTreeKeyboardNavigation;
