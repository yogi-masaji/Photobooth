"use client";

interface FrameCustomizerProps {
  frameColor: string;
  onChangeFrameColor: (color: string) => void;
  frameDecorations: Array<{ type: string; position: string }>;
  onAddDecoration: (type: string, position: string) => void;
  onRemoveDecoration: (index: number) => void;
  onClearDecorations: () => void;
}

const decorationTypes = [
  { id: "heart", name: "Heart" },
  { id: "star", name: "Star" },
  { id: "flower", name: "Flower" },
  { id: "confetti", name: "Confetti" },
  { id: "butterfly", name: "Butterfly" },
];

const positions = [
  { id: "top-left", name: "Top Left" },
  { id: "top-right", name: "Top Right" },
  { id: "bottom-left", name: "Bottom Left" },
  { id: "bottom-right", name: "Bottom Right" },
  { id: "left", name: "Left Side" },
  { id: "right", name: "Right Side" },
  { id: "random", name: "Random" },
];

const presetColors = [
  { id: "#FFE4E1", name: "Light Pink" },
  { id: "#E0FFFF", name: "Light Cyan" },
  { id: "#FAFAD2", name: "Light Goldenrod" },
  { id: "#E6E6FA", name: "Lavender" },
  { id: "#F0FFF0", name: "Honeydew" },
  { id: "#FFF0F5", name: "Lavender Blush" },
  { id: "#F5F5DC", name: "Beige" },
  { id: "#FFEBCD", name: "Blanched Almond" },
];

export default function FrameCustomizer({
  frameColor,
  onChangeFrameColor,
  frameDecorations,
  onAddDecoration,
  onRemoveDecoration,
  onClearDecorations,
}: FrameCustomizerProps) {
  const handleAddDecoration = () => {
    const decorationType = (
      document.getElementById("decoration-type") as HTMLSelectElement
    ).value;
    const decorationPosition = (
      document.getElementById("decoration-position") as HTMLSelectElement
    ).value;
    onAddDecoration(decorationType, decorationPosition);
  };

  return (
    <div className="frame-customizer">
      <div className="color-section">
        <h3 className="section-title">Frame Color</h3>

        <div className="color-grid">
          {presetColors.map((color) => (
            <button
              key={color.id}
              className={`color-swatch ${
                frameColor === color.id ? "selected" : ""
              }`}
              style={{ backgroundColor: color.id }}
              onClick={() => onChangeFrameColor(color.id)}
              title={color.name}
            />
          ))}
        </div>

        <div className="custom-color">
          <label htmlFor="custom-color">Custom:</label>
          <input
            id="custom-color"
            type="color"
            value={frameColor}
            onChange={(e) => onChangeFrameColor(e.target.value)}
            className="color-picker"
          />
        </div>
      </div>

      {/* <div className="decoration-section">
        <div className="section-header">
          <h3 className="section-title">Frame Decorations</h3>
          {frameDecorations.length > 0 && (
            <button
              className="btn btn-outline btn-sm"
              onClick={onClearDecorations}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="decoration-controls">
          <div className="select-group">
            <label htmlFor="decoration-type" className="select-label">
              Decoration
            </label>
            <select id="decoration-type" className="select-input">
              {decorationTypes.map((decoration) => (
                <option key={decoration.id} value={decoration.id}>
                  {decoration.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label htmlFor="decoration-position" className="select-label">
              Position
            </label>
            <select id="decoration-position" className="select-input">
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddDecoration}
          className="btn btn-primary btn-full"
        >
          Add Decoration
        </button>

        {frameDecorations.length > 0 && (
          <div className="active-decorations">
            <h4 className="subsection-title">Active Decorations</h4>
            {frameDecorations.map((decoration, index) => (
              <div key={index} className="decoration-item">
                <div className="decoration-info">
                  <img
                    src={`/decorations/${decoration.type}.png`}
                    alt={decoration.type}
                    className="decoration-thumbnail"
                  />
                  <span className="decoration-name">
                    {decorationTypes.find((d) => d.id === decoration.type)
                      ?.name || decoration.type}{" "}
                    -
                    {positions.find((p) => p.id === decoration.position)
                      ?.name || decoration.position}
                  </span>
                </div>
                <button
                  className="remove-button"
                  onClick={() => onRemoveDecoration(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
