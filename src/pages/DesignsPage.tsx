import React, { useState } from 'react';
import { useBeadStore } from '../store/useBeadStore';
import { getColorHex } from '../utils/parser';
import { Delete, RefreshCw, Copy, X } from 'lucide-react';

const DesignsPage: React.FC = () => {
  const { designs, deleteDesign, beads } = useBeadStore();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const getStockStatus = (colorCode: string, needed: number) => {
    const stock = beads.find(b => b.colorCode === colorCode);
    if (!stock) return { status: 'none', available: 0, needed };
    const available = stock.quantity;
    if (available >= needed) return { status: 'enough', available, needed };
    return { status: 'short', available, needed: needed - available };
  };

  const handleCopyList = (designId: string) => {
    const design = designs.find(d => d.id === designId);
    if (design) {
      const text = design.beads.map(b => `${b.colorCode} ${b.colorName || ''} ${b.quantity}颗`).join('\n');
      navigator.clipboard.writeText(text);
      setCopied(designId);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📐</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
            我的存档图纸
          </h1>
        </div>

        {designs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🐱</div>
            <p className="text-light mb-2">暂无保存的图纸</p>
            <p className="text-sm text-light">使用色号识别工具上传图纸后保存</p>
          </div>
        ) : (
          <div className="space-y-4">
            {designs.map((design) => (
              <div
                key={design.id}
                className="card transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail}
                      alt={design.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <div className="text-2xl">📐</div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1 truncate" style={{ color: 'var(--text-main)' }}>
                      {design.name}
                    </h3>
                    <p className="text-sm text-light mb-2">
                      {design.beads.length}种颜色
                    </p>
                    <p className="text-xs text-light">
                      {formatDate(design.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedDesign(design.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <RefreshCw className="w-4 h-4" style={{ color: 'var(--text-main)' }} />
                    </button>
                    <button
                      onClick={() => handleCopyList(design.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: copied === design.id ? '#B6E9D9' : 'var(--secondary)' }}
                    >
                      {copied === design.id ? (
                        <span className="text-xs">已复制</span>
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: 'var(--text-main)' }} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: '#FFEBEE' }}
                    >
                      <Delete className="w-4 h-4" style={{ color: '#FF8A80' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDesign && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDesign(null)}
          >
            <div
              className="card w-full max-w-sm max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                  {designs.find(d => d.id === selectedDesign)?.name}
                </h3>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: 'var(--secondary)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-main)' }} />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-hide">
                {designs.find(d => d.id === selectedDesign)?.beads.map((bead, index) => {
                  const colorHex = getColorHex(bead.colorCode, bead.colorName);
                  const stockStatus = getStockStatus(bead.colorCode, bead.quantity);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 border-b"
                      style={{ borderColor: 'var(--secondary)' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{bead.colorCode}</div>
                        <div className="text-xs text-light">{bead.colorName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{bead.quantity}颗</div>
                        {stockStatus.status === 'enough' && (
                          <div className="text-xs" style={{ color: '#2E7D32' }}>库存充足</div>
                        )}
                        {stockStatus.status === 'short' && (
                          <div className="text-xs text-orange">差{stockStatus.needed}颗</div>
                        )}
                        {stockStatus.status === 'none' && (
                          <div className="text-xs text-orange">无库存</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignsPage;