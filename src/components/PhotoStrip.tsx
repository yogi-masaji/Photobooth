"use client";

import { useRef } from "react";

interface PhotoStripProps {
  photos: string[];
  onClear: () => void;
  frameColor: string;
  frameDecorations: Array<{ type: string; position: string }>;
}

export default function PhotoStrip({
  photos,
  onClear,
  frameColor,
  frameDecorations,
}: PhotoStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `❤️ ${date} ${time}`;
  };

  const downloadStrip = () => {
    if (!stripRef.current || photos.length === 0) return;

    const strip = stripRef.current;

    // Use html2canvas to capture the strip as an image
    import("html2canvas").then((html2canvas) => {
      html2canvas
        .default(strip, {
          backgroundColor: null,
          scale: 5, // Higher resolution
        })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = `photostrip-${new Date().getTime()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
    });
  };

  // Helper function to get random position within constraints
  const getRandomPosition = () => {
    return {
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
    };
  };

  // Helper function to get position based on position string
  const getPositionStyle = (position: string) => {
    switch (position) {
      case "top-left":
        return { top: "5%", left: "5%" };
      case "top-right":
        return { top: "5%", right: "5%" };
      case "bottom-left":
        return { bottom: "5%", left: "5%" };
      case "bottom-right":
        return { bottom: "5%", right: "5%" };
      case "left":
        return { top: "50%", left: "5%", transform: "translateY(-50%)" };
      case "right":
        return { top: "50%", right: "5%", transform: "translateY(-50%)" };
      case "random":
      default:
        return getRandomPosition();
    }
  };

  return (
    <div className="photo-strip-container">
      <div className="photo-strip-header">
        <h2 className="photo-strip-title">Photo Strip</h2>
        {photos.length > 0 && (
          <div className="photo-strip-actions">
            <button className="btn btn-outline" onClick={onClear}>
              Clear
            </button>
            <button className="btn btn-secondary" onClick={downloadStrip}>
              <span className="icon">↓</span>
              Download Strip
            </button>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="empty-strip">
          No photos taken yet. Take up to 4 photos to create a strip!
        </div>
      ) : (
        <div className="strip-wrapper">
          <div
            ref={stripRef}
            className="photo-strip"
            style={{ backgroundColor: frameColor }}
          >
            {/* Frame decorations */}
            {frameDecorations.map((decoration, index) => (
              <div
                key={index}
                className="decoration"
                style={getPositionStyle(decoration.position)}
              >
                <img
                  src={`/decorations/${decoration.type}.png`}
                  alt={decoration.type}
                  className="decoration-image"
                />
              </div>
            ))}

            <div className="strip-inner">
              <div className="photos-container">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="photo-image"
                    />
                  </div>
                ))}
              </div>

              {photos.length > 0 && (
                <div className="timestamp">{getCurrentDateTime()}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
