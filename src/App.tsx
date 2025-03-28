"use client";

import { useState, useRef, useEffect } from "react";
import PhotoStrip from "./components/PhotoStrip";
import FilterSelector from "./components/FilterSelector";
import StickerSelector from "./components/StickerSelector";
import FrameCustomizer from "./components/FrameCustomizer";
import "./App.css";
import "./assets/css/instagram.min.css";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isMirrored, setIsMirrored] = useState(true);
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

        // Check if mirroring is enabled
        if (isMirrored) {
          context.translate(canvas.width, 0); // Geser titik awal ke kanan
          context.scale(-1, 1); // Flip horizontal
        }

        // Gambar video ke canvas dengan filter yang diterapkan
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Kembalikan transformasi ke normal setelah menggambar
        if (isMirrored) {
          context.setTransform(1, 0, 0, 1, 0, 0);
        }

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

  return <div className="container"></div>;
}

export default App;
