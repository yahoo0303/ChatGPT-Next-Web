export const APP_NAME = "M档阅读器";
export const APP_DESCRIPTION = "面向档案资料和长篇文本的沉浸式阅读体验原型。";
export const DEFAULT_LOCALE = "zh-CN";

export const HOME_ROUTE = "/";
export const READER_ROUTE = "/reader";

export const NAVIGATION_ITEMS = [
  { href: HOME_ROUTE, label: "首页" },
  { href: READER_ROUTE, label: "阅读器" }
] as const;

export type NavigationItem = (typeof NAVIGATION_ITEMS)[number];

export const HOME_INTRO =
  "M档阅读器旨在以档案袋的形式呈现多源资料，强调时间顺序、批注与上下文关联。当前版本聚焦于搭建基础布局与主题，以支持后续模块化开发。";
