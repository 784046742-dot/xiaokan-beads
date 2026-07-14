import { ParsedBead } from '../types/bead';

// 色系分类定义
export const COLOR_SERIES = {
  // 普通色系：A, B, C, D, E, F, G, H, M
  NORMAL: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M'],
  // Q系列：温变色系
  Q_SERIES: ['Q'],
  // R系列：果冻色系
  R_SERIES: ['R'],
  // Y系列：夜光色系
  Y_SERIES: ['Y'],
  // Z系列：紫外线变色
  Z_SERIES: ['Z'],
} as const;

// 检测色号属于哪个系列
export const getColorSeries = (colorCode: string): string => {
  const firstChar = colorCode.charAt(0).toUpperCase();

  if (COLOR_SERIES.Q_SERIES.includes(firstChar as any)) return 'Q系列-温变色';
  if (COLOR_SERIES.R_SERIES.includes(firstChar as any)) return 'R系列-果冻色';
  if (COLOR_SERIES.Y_SERIES.includes(firstChar as any)) return 'Y系列-夜光色';
  if (COLOR_SERIES.Z_SERIES.includes(firstChar as any)) return 'Z系列-紫外线变色';
  if (COLOR_SERIES.NORMAL.includes(firstChar as any)) return '普通色系';

  return '未知系列';
};

// 判断是否为透明色
export const isTransparentColor = (colorName: string): boolean => {
  const transparentKeywords = ['透明', '透', 'clear', 'clear透明'];
  return transparentKeywords.some(keyword => colorName.toLowerCase().includes(keyword.toLowerCase()));
};

// 检测冲突 - 透明 + 普通色系 = 冲突
export const detectConflict = (colorCode: string, colorName?: string): { hasConflict: boolean; message: string } => {
  const series = getColorSeries(colorCode);
  const isTransparent = colorName ? isTransparentColor(colorName) : false;

  // 如果是透明色但属于普通色系
  if (isTransparent && series === '普通色系') {
    return {
      hasConflict: true,
      message: `检测到冲突：${colorCode} 是透明色，但普通色系(A/B/C/D/E/F/G/H/M)通常不是透明的。这个颜色可能被分类错误。`
    };
  }

  return { hasConflict: false, message: '' };
};

// 常见颜色映射表（扩展版）
const COLOR_MAP: Record<string, string> = {
  // A系列 - 红色系
  'A01': '#FF0000', 'A1': '#FF0000', 'A05': '#DC143C', 'A5': '#DC143C',
  'A02': '#FF6B6B', 'A2': '#FF6B6B', 'A06': '#FF1493', 'A6': '#FF1493',

  // B系列 - 橙色系
  'B01': '#FF8C00', 'B1': '#FF8C00', 'B02': '#FFA500', 'B2': '#FFA500',

  // C系列 - 黄色系
  'C01': '#FFD700', 'C1': '#FFD700', 'C02': '#FFFF00', 'C2': '#FFFF00',

  // D系列 - 绿色系
  'D01': '#00FF00', 'D1': '#00FF00', 'D02': '#32CD32', 'D2': '#32CD32',

  // E系列 - 蓝色系
  'E01': '#0000FF', 'E1': '#0000FF', 'E02': '#87CEEB', 'E2': '#87CEEB',

  // F系列 - 紫色系
  'F01': '#800080', 'F1': '#800080', 'F02': '#EE82EE', 'F2': '#EE82EE',

  // G系列 - 棕色系
  'G01': '#8B4513', 'G1': '#8B4513', 'G02': '#D2691E', 'G2': '#D2691E',

  // H系列 - 粉色系
  'H01': '#FFB6C1', 'H1': '#FFB6C1', 'H02': '#FF69B4', 'H2': '#FF69B4',

  // M系列 - 黑白灰
  'M01': '#000000', 'M1': '#000000', 'M02': '#FFFFFF', 'M2': '#FFFFFF',
  'M03': '#808080', 'M3': '#808080',

  // P系列（保持兼容性）
  'P01': '#FF0000', 'P1': '#FF0000', 'P02': '#FF6B6B', 'P2': '#FF6B6B',
  'P03': '#DC143C', 'P3': '#DC143C', 'P04': '#FFB6C1', 'P4': '#FFB6C1',

  // Q系列 - 温变色（渐变色）
  'Q01': '#FF6B6B', 'Q1': '#FF6B6B', 'Q02': '#87CEEB', 'Q2': '#87CEEB',
  'Q03': '#98D8C8', 'Q3': '#98D8C8', 'Q04': '#FFE4B5', 'Q4': '#FFE4B5',

  // R系列 - 果冻色（半透明鲜艳色）
  'R01': '#FF6B6B', 'R1': '#FF6B6B', 'R02': '#87CEEB', 'R2': '#87CEEB',
  'R03': '#98D8C8', 'R3': '#98D8C8', 'R04': '#DDA0DD', 'R4': '#DDA0DD',

  // Y系列 - 夜光色（荧光色）
  'Y01': '#ADFF2F', 'Y1': '#ADFF2F', 'Y02': '#00FF00', 'Y2': '#00FF00',
  'Y03': '#FFFF00', 'Y3': '#FFFF00', 'Y04': '#FF6B6B', 'Y4': '#FF6B6B',

  // Z系列 - 紫外线变色
  'Z01': '#E6E6FA', 'Z1': '#E6E6FA', 'Z02': '#D8BFD8', 'Z2': '#D8BFD8',
  'Z03': '#DDA0DD', 'Z3': '#DDA0DD', 'Z04': '#EE82EE', 'Z4': '#EE82EE',

  // 透明色
  '透明': '#F0F8FF', '透': '#F0F8FF',
};

// 根据色号或颜色名称获取十六进制颜色
export const getColorHex = (colorCode: string, colorName?: string): string => {
  // 标准化色号
  const normalizedCode = colorCode.toUpperCase();

  // 先尝试匹配色号（处理无前缀的情况，如 "12" -> "A12"）
  if (COLOR_MAP[normalizedCode]) {
    return COLOR_MAP[normalizedCode];
  }

  // 如果色号只是数字，尝试匹配 A 系列
  if (/^\d+$/.test(normalizedCode)) {
    const withA = `A${normalizedCode}`;
    if (COLOR_MAP[withA]) {
      return COLOR_MAP[withA];
    }
  }

  // 再尝试匹配颜色名称
  if (colorName && COLOR_MAP[colorName]) {
    return COLOR_MAP[colorName];
  }

  // 根据系列返回默认颜色
  const series = getColorSeries(colorCode);
  switch (series) {
    case 'Q系列-温变色':
      return '#E8E8E8'; // 浅灰
    case 'R系列-果冻色':
      return '#FFE4E1'; // 浅粉
    case 'Y系列-夜光色':
      return '#ADFF2F'; // 荧光绿
    case 'Z系列-紫外线变色':
      return '#E6E6FA'; // 浅紫
    default:
      return '#98D8C8'; // 默认薄荷绿
  }
};

// 解析单行文本 - 智能识别字母+数字色号
const parseLine = (line: string): ParsedBead | null => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  // 正则表达式：匹配字母开头+数字组合（如 P12、A2、Q1、R2 等）
  // 支持的格式：
  // - P12-红色-100
  // - P12 红色 100
  // - A2 红色 50
  // - 红色 P12 100
  // - P12 100
  // - P12-100

  // 格式1: 色号-颜色名-数量（如 P12-红色-100）
  let match = trimmedLine.match(/^([A-Za-z]\d+)\s*[-:]\s*([^\d-]+?)\s*[-:]\s*(\d+)/);
  if (match) {
    return {
      colorCode: match[1].toUpperCase(),
      colorName: match[2].trim(),
      quantity: parseInt(match[3], 10),
    };
  }

  // 格式2: 色号 颜色名 数量（如 P12 红色 100）
  match = trimmedLine.match(/^([A-Za-z]\d+)\s+([^\d\s]+?)\s+(\d+)/);
  if (match) {
    return {
      colorCode: match[1].toUpperCase(),
      colorName: match[2].trim(),
      quantity: parseInt(match[3], 10),
    };
  }

  // 格式3: 色号 数量（如 P12 100）
  match = trimmedLine.match(/^([A-Za-z]\d+)\s+(\d+)$/);
  if (match) {
    return {
      colorCode: match[1].toUpperCase(),
      quantity: parseInt(match[2], 10),
    };
  }

  // 格式4: 颜色名 色号 数量（如 红色 P12 100）
  match = trimmedLine.match(/^([^\d\s]+?)\s+([A-Za-z]\d+)\s+(\d+)/);
  if (match) {
    return {
      colorCode: match[2].toUpperCase(),
      colorName: match[1].trim(),
      quantity: parseInt(match[3], 10),
    };
  }

  // 格式5: 色号-数量（如 P12-100）
  match = trimmedLine.match(/^([A-Za-z]\d+)\s*[-]\s*(\d+)$/);
  if (match) {
    return {
      colorCode: match[1].toUpperCase(),
      quantity: parseInt(match[2], 10),
    };
  }

  // 格式6: 纯数字色号（自动归为A系列，如 12 -> A12）
  match = trimmedLine.match(/^(\d+)\s+([^\d\s]+?)\s+(\d+)/);
  if (match) {
    return {
      colorCode: `A${match[1]}`,
      colorName: match[2].trim(),
      quantity: parseInt(match[3], 10),
    };
  }

  // 格式7: 纯数字色号-数量（如 12 100 -> A12）
  match = trimmedLine.match(/^(\d+)\s+(\d+)$/);
  if (match) {
    return {
      colorCode: `A${match[1]}`,
      quantity: parseInt(match[2], 10),
    };
  }

  // 格式8: 逗号分隔（P12, 红色, 100）
  match = trimmedLine.match(/^([A-Za-z]\d+)\s*,\s*([^\d,]+?)\s*,\s*(\d+)/);
  if (match) {
    return {
      colorCode: match[1].toUpperCase(),
      colorName: match[2].trim(),
      quantity: parseInt(match[3], 10),
    };
  }

  return null;
};

// 解析多行文本
export const parseBeadText = (text: string): ParsedBead[] => {
  const lines = text.split('\n');
  const results: ParsedBead[] = [];

  lines.forEach(line => {
    const parsed = parseLine(line);
    if (parsed) {
      results.push(parsed);
    }
  });

  return results;
};