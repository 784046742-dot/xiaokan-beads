import { BeadData, DesignData } from '../types/bead';

const BEADS_KEY = 'beads_inventory';
const DESIGNS_KEY = 'bead_designs';

export const loadBeads = (): BeadData[] => {
  try {
    const data = localStorage.getItem(BEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载豆子数据失败:', error);
    return [];
  }
};

export const saveBeads = (beads: BeadData[]): void => {
  try {
    localStorage.setItem(BEADS_KEY, JSON.stringify(beads));
  } catch (error) {
    console.error('保存豆子数据失败:', error);
  }
};

export const loadDesigns = (): DesignData[] => {
  try {
    const data = localStorage.getItem(DESIGNS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载图纸数据失败:', error);
    return [];
  }
};

export const saveDesigns = (designs: DesignData[]): void => {
  try {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
  } catch (error) {
    console.error('保存图纸数据失败:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const mergeBeads = (existingBeads: BeadData[], newBeads: BeadData[]): BeadData[] => {
  const beadMap = new Map<string, BeadData>();

  existingBeads.forEach(bead => {
    beadMap.set(bead.colorCode, { ...bead });
  });

  newBeads.forEach(newBead => {
    const existing = beadMap.get(newBead.colorCode);
    if (existing) {
      existing.quantity += newBead.quantity;
      existing.updatedAt = new Date().toISOString();
    } else {
      beadMap.set(newBead.colorCode, newBead);
    }
  });

  return Array.from(beadMap.values());
};