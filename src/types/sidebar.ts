export type SidebarItem = {
  title: string;
  path?: string;
  num: number;
  children?: SidebarItem[];
}