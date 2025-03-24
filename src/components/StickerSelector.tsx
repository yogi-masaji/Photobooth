"use client";

import { useState } from "react";

interface StickerSelectorProps {
  onAddSticker: (stickerId: string) => void;
  selectedStickers: Array<{ id: string; x: number; y: number; scale: number }>;
  onRemoveSticker: (index: number) => void;
  onUpdatePosition: (index: number, x: number, y: number) => void;
  onUpdateScale: (index: number, scale: number) => void;
}

const stickers = [
  { id: "heart", name: "Heart" },
  { id: "star", name: "Star" },
  { id: "smile", name: "Smile" },
  { id: "sunglasses", name: "Sunglasses" },
  { id: "crown", name: "Crown" },
  { id: "mustache", name: "Mustache" },
];

export default function StickerSelector({
  onAddSticker,
  selectedStickers,
  onRemoveSticker,
  onUpdatePosition,
  onUpdateScale,
}: StickerSelectorProps) {
  const [selectedStickerIndex, setSelectedStickerIndex] = useState<
    number | null
  >(null);

  return (
    // <div className="sticker-selector">
    //   <h3 className="section-title">Add Stickers</h3>

    //   <div className="sticker-grid">
    //     {stickers.map((sticker) => (
    //       <button
    //         key={sticker.id}
    //         className="sticker-button"
    //         onClick={() => onAddSticker(sticker.id)}
    //       >
    //         <img
    //           src={`/stickers/${sticker.id}.png`}
    //           alt={sticker.name}
    //           className="sticker-preview"
    //         />
    //         <span>{sticker.name}</span>
    //       </button>
    //     ))}
    //   </div>

    //   {selectedStickers.length > 0 && (
    //     <div className="active-stickers">
    //       <h3 className="section-title">Active Stickers</h3>

    //       <div className="sticker-list">
    //         {selectedStickers.map((sticker, index) => (
    //           <div
    //             key={index}
    //             className={`sticker-item ${
    //               selectedStickerIndex === index ? "selected" : ""
    //             }`}
    //             onClick={() => setSelectedStickerIndex(index)}
    //           >
    //             <div className="sticker-item-content">
    //               <img
    //                 src={`/stickers/${sticker.id}.png`}
    //                 alt={`Sticker ${index}`}
    //                 className="sticker-thumbnail"
    //               />
    //               <span>Sticker {index + 1}</span>
    //             </div>
    //             <button
    //               className="remove-button"
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 onRemoveSticker(index);
    //                 if (selectedStickerIndex === index) {
    //                   setSelectedStickerIndex(null);
    //                 }
    //               }}
    //             >
    //               ✕
    //             </button>
    //           </div>
    //         ))}
    //       </div>

    //       {selectedStickerIndex !== null && (
    //         <div className="sticker-controls">
    //           <div className="slider-container">
    //             <label className="slider-label">Size</label>
    //             <input
    //               type="range"
    //               min="1"
    //               max="10"
    //               step="0.1"
    //               value={selectedStickers[selectedStickerIndex].scale * 10}
    //               onChange={(e) =>
    //                 onUpdateScale(
    //                   selectedStickerIndex,
    //                   Number.parseFloat(e.target.value) / 10
    //                 )
    //               }
    //               className="slider"
    //             />
    //           </div>

    //           <div className="help-text">
    //             Drag stickers on the video preview to position them
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   )}
    // </div>
    <div>
      <h1>coming soon</h1>
    </div>
  );
}
