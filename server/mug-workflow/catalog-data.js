export const DEFAULT_CATEGORY_ID = "meta-mug";

export const CATALOG_DATA = [
  {
    id: "meta-mug",
    name: "META保温杯",
    mode: "single",
    imageSize: "1584x1056",
    printAreas: [
      {
        key: "main",
        label: "主体区域",
        widthMm: 240,
        heightMm: 132,
        aspectText: "240:132",
      },
    ],
    styles: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
    masks: {
      single: "mask.png",
    },
  },
  {
    id: "swag-mug",
    name: "SWAG保温杯",
    mode: "single",
    imageSize: "1664x928",
    printAreas: [
      {
        key: "main",
        label: "主体区域",
        widthMm: 209,
        heightMm: 120,
        aspectText: "209:120",
      },
    ],
    styles: ["1.png"],
    masks: {
      single: "mask.png",
    },
  },
  {
    id: "rainbow-mug",
    name: "彩虹保温杯",
    mode: "split",
    imageSize: "1664x928",
    printAreas: [
      {
        key: "top",
        label: "上方窄条区域",
        widthMm: 250.3,
        heightMm: 16,
        aspectText: "250.3:16",
      },
      {
        key: "bottom",
        label: "下方主区域",
        widthMm: 250.3,
        heightMm: 72,
        aspectText: "250.3:72",
      },
    ],
    styles: ["1.png", "2.png", "3.png", "4.png"],
    masks: {
      top: "mask-top.png",
      bottom: "mask-bottom.png",
    },
  },
];
