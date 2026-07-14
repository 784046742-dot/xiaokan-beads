import { create } from 'zustand';
import { BeadData, DesignData, UserState } from '../types/bead';
import { loadBeads, saveBeads, generateId, mergeBeads, loadDesigns, saveDesigns } from '../utils/storage';
import { getColorHex } from '../utils/parser';

interface BeadStore {
  beads: BeadData[];
  designs: DesignData[];
  searchTerm: string;
  isModalOpen: boolean;
  user: UserState;
  currentToolTab: 'text' | 'image';

  loadBeadsData: () => void;
  loadDesignsData: () => void;
  addBeads: (newBeads: Omit<BeadData, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateBead: (id: string, updates: Partial<BeadData>) => void;
  deleteBead: (id: string) => void;
  setSearchTerm: (term: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setCurrentToolTab: (tab: 'text' | 'image') => void;

  addDesign: (design: Omit<DesignData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDesign: (id: string, updates: Partial<DesignData>) => void;
  deleteDesign: (id: string) => void;

  login: (username: string) => void;
  logout: () => void;
}

export const useBeadStore = create<BeadStore>((set, get) => ({
  beads: [],
  designs: [],
  searchTerm: '',
  isModalOpen: false,
  user: { isLoggedIn: false, username: '' },
  currentToolTab: 'text',

  loadBeadsData: () => {
    const beads = loadBeads();
    set({ beads });
  },

  loadDesignsData: () => {
    const designs = loadDesigns();
    set({ designs });
  },

  addBeads: (newBeads) => {
    const currentTime = new Date().toISOString();
    const beadsToAdd: BeadData[] = newBeads.map(bead => ({
      ...bead,
      id: generateId(),
      colorHex: bead.colorHex || getColorHex(bead.colorCode, bead.colorName),
      createdAt: currentTime,
      updatedAt: currentTime,
    }));

    const currentBeads = get().beads;
    const mergedBeads = mergeBeads(currentBeads, beadsToAdd);

    set({ beads: mergedBeads });
    saveBeads(mergedBeads);
  },

  updateBead: (id, updates) => {
    const beads = get().beads.map(bead =>
      bead.id === id
        ? { ...bead, ...updates, updatedAt: new Date().toISOString() }
        : bead
    );

    set({ beads });
    saveBeads(beads);
  },

  deleteBead: (id) => {
    const beads = get().beads.filter(bead => bead.id !== id);
    set({ beads });
    saveBeads(beads);
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  openModal: () => {
    set({ isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false });
  },

  setCurrentToolTab: (tab) => {
    set({ currentToolTab: tab });
  },

  addDesign: (design) => {
    const currentTime = new Date().toISOString();
    const newDesign: DesignData = {
      ...design,
      id: generateId(),
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    const designs = [...get().designs, newDesign];
    set({ designs });
    saveDesigns(designs);
  },

  updateDesign: (id, updates) => {
    const designs = get().designs.map(design =>
      design.id === id
        ? { ...design, ...updates, updatedAt: new Date().toISOString() }
        : design
    );

    set({ designs });
    saveDesigns(designs);
  },

  deleteDesign: (id) => {
    const designs = get().designs.filter(design => design.id !== id);
    set({ designs });
    saveDesigns(designs);
  },

  login: (username) => {
    set({ user: { isLoggedIn: true, username } });
  },

  logout: () => {
    set({ user: { isLoggedIn: false, username: '' } });
  },
}));