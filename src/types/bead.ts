export interface BeadData {
  id: string;
  colorCode: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedBead {
  colorCode: string;
  colorName?: string;
  quantity: number;
}

export interface DesignData {
  id: string;
  name: string;
  thumbnail?: string;
  beads: ParsedBead[];
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  isLoggedIn: boolean;
  username: string;
}