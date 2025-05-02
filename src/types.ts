export interface TreeDataItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  openIcon?: React.ReactNode;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
  draggable?: boolean;
  droppable?: boolean;
}
