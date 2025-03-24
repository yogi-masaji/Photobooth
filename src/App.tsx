"use client";

import { useState, useRef, useEffect } from "react";
import PhotoStrip from "./components/PhotoStrip";
import FilterSelector from "./components/FilterSelector";
import StickerSelector from "./components/StickerSelector";
import FrameCustomizer from "./components/FrameCustomizer";
import Footer from "./footer";
import "./App.css";
import "./assets/css/instagram.min.css";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const maxPhotos = 4;
  const [isStreaming, setIsStreaming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cameraError, setCameraError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("none");
  const [selectedStickers, setSelectedStickers] = useState<
    Array<{ id: string; x: number; y: number; scale: number }>
  >([]);
  const [frameColor, setFrameColor] = useState<string>("#FFE4E1"); // Default light pink
  const [frameDecorations, setFrameDecorations] = useState<
    Array<{ type: string; position: string }>
  >([]);
  const [activeTab, setActiveTab] = useState<string>("filters");

  const hasCaptured = useRef(false);

  useEffect(() => {
    let countdownInterval: number;

    if (countdown > 0) {
      countdownInterval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1 && !hasCaptured.current) {
            hasCaptured.current = true; // Prevent duplicate execution
            capturePhoto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      hasCaptured.current = false; // Reset for next use
    };
  }, [countdown]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setCameraError("");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Could not access camera. Please ensure you've granted permission."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  const applyFilter = (canvas: HTMLCanvasElement, filter: string) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    switch (filter) {
      case "grayscale":
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        context.putImageData(imageData, 0, 0);
        break;
      case "sepia":
        const sepiaData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const sepiaPixels = sepiaData.data;
        for (let i = 0; i < sepiaPixels.length; i += 4) {
          const r = sepiaPixels[i];
          const g = sepiaPixels[i + 1];
          const b = sepiaPixels[i + 2];
          sepiaPixels[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          sepiaPixels[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          sepiaPixels[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        context.putImageData(sepiaData, 0, 0);
        break;
      case "invert":
        const invertData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const invertPixels = invertData.data;
        for (let i = 0; i < invertPixels.length; i += 4) {
          invertPixels[i] = 255 - invertPixels[i]; // red
          invertPixels[i + 1] = 255 - invertPixels[i + 1]; // green
          invertPixels[i + 2] = 255 - invertPixels[i + 2]; // blue
        }
        context.putImageData(invertData, 0, 0);
        break;
      case "vintage":
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgba(255, 210, 170, 0.3)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = "source-over";
        break;
      case "cool":
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgba(170, 210, 255, 0.3)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = "source-over";
        break;
      case "warm":
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgba(255, 170, 120, 0.3)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = "source-over";
        break;
      default:
        // No filter
        break;
    }
  };

  const applyStickers = async (
    canvas: HTMLCanvasElement,
    stickers: Array<{ id: string; x: number; y: number; scale: number }>
  ) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    for (const sticker of stickers) {
      try {
        const stickerSrc = `/stickers/${sticker.id}.png`;
        const img = await loadImage(stickerSrc);
        const width = img.width * sticker.scale;
        const height = img.height * sticker.scale;
        const x = sticker.x * canvas.width - width / 2;
        const y = sticker.y * canvas.height - height / 2;
        context.drawImage(img, x, y, width, height);
      } catch (error) {
        console.error("Error loading sticker:", error);
      }
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Ambil filter dari elemen video
        const videoFilter = window.getComputedStyle(video).filter;
        context.filter = videoFilter; // Terapkan filter ke canvas

        // Gambar video ke canvas dengan filter yang diterapkan
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply stickers jika ada
        await applyStickers(canvas, selectedStickers);

        // Simpan hasil gambar
        const photoUrl = canvas.toDataURL("image/png");
        setPhotos((prev) => {
          if (prev.length >= maxPhotos) return prev;
          return [...prev, photoUrl];
        });

        // Reset filter setelah menggambar agar tidak mempengaruhi elemen lain
        context.filter = "none";
      }
    }
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const addSticker = (stickerId: string) => {
    setSelectedStickers((prev) => [
      ...prev,
      {
        id: stickerId,
        x: 0.5, // Center of the screen
        y: 0.5, // Center of the screen
        scale: 0.2, // Default scale
      },
    ]);
  };

  const updateStickerPosition = (index: number, x: number, y: number) => {
    setSelectedStickers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y };
      return updated;
    });
  };

  const updateStickerScale = (index: number, scale: number) => {
    setSelectedStickers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], scale };
      return updated;
    });
  };

  const removeSticker = (index: number) => {
    setSelectedStickers((prev) => prev.filter((_, i) => i !== index));
  };

  const addFrameDecoration = (type: string, position: string) => {
    setFrameDecorations((prev) => [...prev, { type, position }]);
  };

  const removeFrameDecoration = (index: number) => {
    setFrameDecorations((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFrameDecorations = () => {
    setFrameDecorations([]);
  };

  return (
    <div className="container">
      <h1 className="title">Web Photobooth</h1>

      <div className="main-grid">
        <div className="controls-section">
          <div className="camera-card">
            <div className="camera-container">
              {!isStreaming && !cameraError && (
                <div className="camera-placeholder">
                  Click "Start Camera" to begin
                </div>
              )}

              {cameraError && <div className="camera-error">{cameraError}</div>}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`camera-video ${
                  !isStreaming ? "hidden" : ""
                } ${selectedFilter}`}
              />

              {isStreaming && selectedStickers.length > 0 && (
                <div className="stickers-overlay">
                  {selectedStickers.map((sticker, index) => (
                    <div
                      key={index}
                      className="sticker-item"
                      style={{
                        left: `${sticker.x * 100}%`,
                        top: `${sticker.y * 100}%`,
                      }}
                    >
                      <img
                        src={`/stickers/${sticker.id}.png`}
                        alt={`Sticker ${sticker.id}`}
                        style={{
                          width: `${sticker.scale * 100}px`,
                          height: "auto",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {countdown > 0 && (
                <div className="countdown-overlay">
                  <span className="countdown-number">{countdown}</span>
                </div>
              )}
            </div>
          </div>

          <div className="button-group">
            {!isStreaming ? (
              <button className="btn btn-primary" onClick={startCamera}>
                Start Camera
              </button>
            ) : (
              <>
                <button className="btn btn-danger" onClick={stopCamera}>
                  Stop Camera
                </button>
                <button
                  className="btn btn-primary"
                  onClick={startCountdown}
                  disabled={countdown > 0 || photos.length >= maxPhotos}
                >
                  {countdown > 0
                    ? `Taking photo in ${countdown}...`
                    : photos.length >= maxPhotos
                    ? "Max Photos Reached"
                    : `Take Photo (${photos.length}/${maxPhotos})`}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={capturePhoto}
                  disabled={photos.length >= maxPhotos}
                >
                  Snap Instantly
                </button>
              </>
            )}
          </div>

          {isStreaming && (
            <div className="tabs">
              <div className="tabs-header">
                <button
                  className={`tab-button ${
                    activeTab === "filters" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("filters")}
                >
                  Filters
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "stickers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("stickers")}
                >
                  Stickers
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "frame" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("frame")}
                >
                  Frame
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === "filters" && (
                  <FilterSelector
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                  />
                )}
                {activeTab === "stickers" && (
                  <StickerSelector
                    onAddSticker={addSticker}
                    selectedStickers={selectedStickers}
                    onRemoveSticker={removeSticker}
                    onUpdatePosition={updateStickerPosition}
                    onUpdateScale={updateStickerScale}
                  />
                )}
                {activeTab === "frame" && (
                  <FrameCustomizer
                    frameColor={frameColor}
                    onChangeFrameColor={setFrameColor}
                    frameDecorations={frameDecorations}
                    onAddDecoration={addFrameDecoration}
                    onRemoveDecoration={removeFrameDecoration}
                    onClearDecorations={clearFrameDecorations}
                  />
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden-canvas" />
        </div>

        <PhotoStrip
          photos={photos}
          onClear={clearPhotos}
          frameColor={frameColor}
          frameDecorations={frameDecorations}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
