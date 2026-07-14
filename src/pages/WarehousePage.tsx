import React, { useState, useMemo } from 'react';
import { useBeadStore } from '../store/useBeadStore';
import { getColorHex, getColorSeries } from '../utils/parser';
import { Search, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const WarehousePage: React.FC = () => {
  const { beads, searchTerm, setSearchTerm, addBeads, updateBead, deleteBead } = useBeadStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBead, setNewBead] = useState({ colorCode: '', colorName: '', quantity: 100 });
  const [editData, setEditData] = useState({ colorCode: '', colorName: '', quantity: 0 });

  const filteredBeads = useMemo(() => {
    if (!searchTerm.trim()) return beads;
    const term = searchTerm.toLowerCase();
    return beads.filter(bead =>
      bead.colorCode.toLowerCase().includes(term) ||
      (bead.colorName && bead.colorName.toLowerCase().includes(term))
    );
  }, [beads, searchTerm]);

  const totalBeads = beads.reduce((sum, bead) => sum + bead.quantity, 0);
  const totalColors = beads.length;

  const handleAddBead = () => {
    if (newBead.colorCode.trim()) {
      addBeads([{
        colorCode: newBead.colorCode.toUpperCase(),
        colorName: newBead.colorName || undefined,
        quantity: newBead.quantity,
      }]);
      setNewBead({ colorCode: '', colorName: '', quantity: 100 });
      setShowAddModal(false);
    }
  };

  const handleStartEdit = (bead: typeof beads[0]) => {
    setEditingId(bead.id);
    setEditData({
      colorCode: bead.colorCode,
      colorName: bead.colorName || '',
      quantity: bead.quantity,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateBead(id, {
      colorCode: editData.colorCode.toUpperCase(),
      colorName: editData.colorName || undefined,
      quantity: editData.quantity,
    });
    setEditingId(null);
  };

  const convertToGrams = (quantity: number): number => {
    return (quantity / 1000) * 10;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📦</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
            我的拼豆仓库
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
              {totalColors}
            </div>
            <div className="text-sm text-light">种颜色</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--secondary)' }}>
              {totalBeads}
            </div>
            <div className="text-sm text-light">颗豆子</div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索色号或颜色名称..."
            className="input-field pl-12"
          />
        </div>

        {filteredBeads.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🐱</div>
            <p className="text-light mb-2">还没有豆子哦</p>
            <p className="text-sm text-light">快去录入你的拼豆库存吧</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBeads.map((bead) => {
              const colorHex = getColorHex(bead.colorCode, bead.colorName);
              const series = getColorSeries(bead.colorCode);

              if (editingId === bead.id) {
                return (
                  <div
                    key={bead.id}
                    className="card p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editData.colorCode}
                          onChange={(e) => setEditData({ ...editData, colorCode: e.target.value })}
                          className="input-field text-sm mb-1"
                        />
                        <input
                          type="text"
                          value={editData.colorName}
                          onChange={(e) => setEditData({ ...editData, colorName: e.target.value })}
                          className="input-field text-sm mb-2"
                          placeholder="颜色名称"
                        />
                        <input
                          type="number"
                          value={editData.quantity}
                          onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })}
                          className="input-field text-sm w-32"
                          min="0"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleSaveEdit(bead.id)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: '#FFEBEE' }}
                        >
                          <X className="w-5 h-5" style={{ color: '#FF8A80' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={bead.id}
                  className="card flex items-center gap-4 transition-all duration-300 hover:shadow-xl"
                >
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorHex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>
                        {bead.colorCode}
                      </span>
                      <span className="tag tag-primary">{series}</span>
                    </div>
                    {bead.colorName && (
                      <div className="text-sm text-light mb-1">{bead.colorName}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl" style={{ color: 'var(--secondary)' }}>
                        {bead.quantity}
                      </span>
                      <span className="text-sm text-light">颗</span>
                      <span className="text-xs text-light">({convertToGrams(bead.quantity)}g)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleStartEdit(bead)}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <Edit2 className="w-5 h-5" style={{ color: 'var(--text-main)' }} />
                    </button>
                    <button
                      onClick={() => deleteBead(bead.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: '#FFEBEE' }}
                    >
                      <Trash2 className="w-5 h-5" style={{ color: '#FF8A80' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus className="w-7 h-7 text-white" />
        </button>

        {showAddModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="card w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-main)' }}>
                新增拼豆色号
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newBead.colorCode}
                  onChange={(e) => setNewBead({ ...newBead, colorCode: e.target.value })}
                  placeholder="色号 (如: A01, P12)"
                  className="input-field"
                />
                <input
                  type="text"
                  value={newBead.colorName}
                  onChange={(e) => setNewBead({ ...newBead, colorName: e.target.value })}
                  placeholder="颜色名称 (可选)"
                  className="input-field"
                />
                <input
                  type="number"
                  value={newBead.quantity}
                  onChange={(e) => setNewBead({ ...newBead, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="数量 (颗)"
                  className="input-field"
                  min="0"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleAddBead}
                  className="btn-primary flex-1"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousePage;