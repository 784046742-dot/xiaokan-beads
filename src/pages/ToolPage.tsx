import React, { useState, useEffect } from 'react';
import { useBeadStore } from '../store/useBeadStore';
import { parseBeadText, getColorHex, getColorSeries } from '../utils/parser';
import { ParsedBead } from '../types/bead';
import { FileText, Image, Trash2, Plus, Save, Upload, Download } from 'lucide-react';

interface ToolPageProps {
  onNavigate: (page: string) => void;
}

const ToolPage: React.FC<ToolPageProps> = ({ onNavigate }) => {
  const { currentToolTab, setCurrentToolTab, beads, addBeads, addDesign } = useBeadStore();
  const [inputText, setInputText] = useState('');
  const [parsedBeads, setParsedBeads] = useState<ParsedBead[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBeads, setImageBeads] = useState<ParsedBead[]>([]);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [designName, setDesignName] = useState('');

  useEffect(() => {
    if (inputText.trim()) {
      const parsed = parseBeadText(inputText);
      setParsedBeads(parsed);
    } else {
      setParsedBeads([]);
    }
  }, [inputText]);

  const convertToGrams = (quantity: number): number => {
    return (quantity / 1000) * 10;
  };

  const getStockStatus = (colorCode: string, needed: number) => {
    const stock = beads.find(b => b.colorCode === colorCode);
    if (!stock) return { status: 'none', available: 0, needed };
    const available = stock.quantity;
    if (available >= needed) return { status: 'enough', available, needed };
    return { status: 'short', available, needed: needed - available };
  };

  const handleAddToWarehouse = (beadsToAdd: ParsedBead[]) => {
    addBeads(beadsToAdd);
    onNavigate('warehouse');
  };

  const handleSaveDesign = () => {
    const beadsToSave = currentToolTab === 'text' ? parsedBeads : imageBeads;
    if (designName.trim() && beadsToSave.length > 0) {
      addDesign({ name: designName.trim(), beads: beadsToSave, thumbnail: imagePreview });
      setShowDesignModal(false);
      setDesignName('');
      onNavigate('designs');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setImagePreview(preview);
        simulateImageRecognition(preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateImageRecognition = (imageUrl: string) => {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 100, 100);
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const pixels = imageData.data;
        const colorMap = new Map<string, number>();

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const colorKey = `${r},${g},${b}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);

        const colorSeries = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const recognizedBeads: ParsedBead[] = sortedColors.map(([color, count], index) => ({
          colorCode: `${colorSeries[index]}${String(index + 1).padStart(2, '0')}`,
          colorName: `识别色${index + 1}`,
          quantity: Math.floor(count / 20),
        }));

        setImageBeads(recognizedBeads);
      }
    };
    img.src = imageUrl;
  };

  const handleExportMissing = (beadsList: ParsedBead[]) => {
    const missing = beadsList
      .map(bead => {
        const status = getStockStatus(bead.colorCode, bead.quantity);
        if (status.status === 'short' || status.status === 'none') {
          return `${bead.colorCode} ${bead.colorName || ''} ${status.needed}颗`;
        }
        return null;
      })
      .filter(Boolean);

    if (missing.length > 0) {
      const blob = new Blob([missing.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '缺色清单.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const updateBeadQuantity = (index: number, quantity: number, list: ParsedBead[], setter: React.Dispatch<React.SetStateAction<ParsedBead[]>>) => {
    const newList = [...list];
    newList[index] = { ...newList[index], quantity };
    setter(newList);
  };

  const updateBeadCode = (index: number, code: string, list: ParsedBead[], setter: React.Dispatch<React.SetStateAction<ParsedBead[]>>) => {
    const newList = [...list];
    newList[index] = { ...newList[index], colorCode: code.toUpperCase() };
    setter(newList);
  };

  const addNewBead = (list: ParsedBead[], setter: React.Dispatch<React.SetStateAction<ParsedBead[]>>) => {
    setter([...list, { colorCode: '', colorName: '', quantity: 100 }]);
  };

  const removeBead = (index: number, list: ParsedBead[], setter: React.Dispatch<React.SetStateAction<ParsedBead[]>>) => {
    setter(list.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🐱</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
            拼豆图纸色号快速统计工具
          </h1>
        </div>

        <div className="flex rounded-2xl p-1 mb-6" style={{ backgroundColor: 'var(--secondary)' }}>
          <button
            onClick={() => setCurrentToolTab('text')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              currentToolTab === 'text' ? 'bg-white shadow-md' : ''
            }`}
          >
            <FileText className="w-5 h-5" />
            文字解析
          </button>
          <button
            onClick={() => setCurrentToolTab('image')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              currentToolTab === 'image' ? 'bg-white shadow-md' : ''
            }`}
          >
            <Image className="w-5 h-5" />
            图片识别
          </button>
        </div>

        {currentToolTab === 'text' && (
          <div className="card mb-6 fade-in-up">
            <label className="block mb-2 font-medium" style={{ color: 'var(--text-main)' }}>
              粘贴图纸文字清单
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="P12 红色 100&#10;A02 蓝色 200&#10;Q01 温变 150&#10;一行一条记录..."
              className="input-field h-40 resize-none"
            />
            <button
              onClick={() => setInputText('')}
              className="mt-2 text-sm text-light flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              清空文本
            </button>
          </div>
        )}

        {currentToolTab === 'image' && (
          <div className="card mb-6 fade-in-up">
            <label className="block mb-2 font-medium" style={{ color: 'var(--text-main)' }}>
              上传像素图纸/拼豆图纸照片
            </label>
            <div
              className="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-[var(--primary)]"
              style={{ borderColor: 'var(--secondary)' }}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-contain rounded-xl"
                />
              ) : (
                <div>
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-light">点击上传图纸图片</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {(parsedBeads.length > 0 || imageBeads.length > 0) && (
          <div className="card mb-6 fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: 'var(--text-main)' }}>
                识别结果
                <span className="ml-2 text-sm font-normal text-light">
                  ({currentToolTab === 'text' ? parsedBeads.length : imageBeads.length}种颜色)
                </span>
              </h3>
              <button
                onClick={() => addNewBead(currentToolTab === 'text' ? parsedBeads : imageBeads, currentToolTab === 'text' ? setParsedBeads : setImageBeads)}
                className="btn-secondary text-sm px-3 py-1 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                新增
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              {(currentToolTab === 'text' ? parsedBeads : imageBeads).map((bead, index) => {
                const colorHex = getColorHex(bead.colorCode, bead.colorName);
                const series = getColorSeries(bead.colorCode);
                const stockStatus = getStockStatus(bead.colorCode, bead.quantity);

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-base)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colorHex }}
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={bead.colorCode}
                        onChange={(e) => updateBeadCode(index, e.target.value, currentToolTab === 'text' ? parsedBeads : imageBeads, currentToolTab === 'text' ? setParsedBeads : setImageBeads)}
                        className="input-field text-sm py-1 px-2 mb-1"
                        placeholder="色号"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={bead.quantity}
                          onChange={(e) => updateBeadQuantity(index, parseInt(e.target.value) || 0, currentToolTab === 'text' ? parsedBeads : imageBeads, currentToolTab === 'text' ? setParsedBeads : setImageBeads)}
                          className="input-field text-sm py-1 px-2 w-20"
                          min="0"
                        />
                        <span className="text-xs text-light">颗</span>
                        <span className="text-xs text-light">({convertToGrams(bead.quantity)}g)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="tag tag-primary">{series}</span>
                        {stockStatus.status === 'enough' && (
                          <span className="tag tag-success">库存充足</span>
                        )}
                        {stockStatus.status === 'short' && (
                          <span className="tag tag-warning">差{stockStatus.needed}颗</span>
                        )}
                        {stockStatus.status === 'none' && (
                          <span className="tag tag-warning">无库存</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBead(index, currentToolTab === 'text' ? parsedBeads : imageBeads, currentToolTab === 'text' ? setParsedBeads : setImageBeads)}
                      className="p-2 rounded-full hover:bg-red-100 transition-colors"
                      style={{ backgroundColor: '#FFEBEE' }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#FF8A80' }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(parsedBeads.length > 0 || imageBeads.length > 0) && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAddToWarehouse(currentToolTab === 'text' ? parsedBeads : imageBeads)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              同步至仓库
            </button>
            <button
              onClick={() => setShowDesignModal(true)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              保存图纸
            </button>
            {currentToolTab === 'image' && (
              <button
                onClick={() => handleExportMissing(imageBeads)}
                className="btn-outline flex items-center justify-center gap-2 col-span-2"
              >
                <Download className="w-5 h-5" />
                导出缺色清单
              </button>
            )}
          </div>
        )}

        {showDesignModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDesignModal(false)}
          >
            <div
              className="card w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-main)' }}>
                保存图纸记录
              </h3>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="输入图纸名称"
                className="input-field mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDesignModal(false)}
                  className="btn-outline flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDesign}
                  className="btn-primary flex-1"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPage;