import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const Dashboard = () => {
  const { backendUrl, credits, setCredits } = useApp();

  const [preview, setPreview]     = useState(null);   // original preview URL
  const [result, setResult]       = useState(null);   // processed image URL
  const [file, setFile]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [sliderPos, setSliderPos] = useState(50);     // before/after slider

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      if (err.code === "file-too-large") toast.error("File too large. Max size is 10MB.");
      else toast.error("Only JPG, PNG, and WebP files are allowed.");
      return;
    }
    if (accepted.length === 0) return;

    const f = accepted[0];
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize:  MAX_SIZE,
  });

  const handleRemoveBg = async () => {
    if (!file) return;
    if (credits <= 0) {
      toast.error("You have no credits left. Please purchase more.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        setResult(data.data.processedUrl);
        setCredits(data.data.creditsLeft);
        setSliderPos(50);
        toast.success("Background removed!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process image";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      const response = await fetch(result);
      const blob     = await response.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = "bgeraser-result.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Try right-clicking the image.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Remove Background</h1>
        <p className="text-white/50 text-sm">
          Credits remaining:{" "}
          <span className={credits === 0 ? "text-red-400 font-semibold" : "text-brand-500 font-semibold"}>
            {credits}
          </span>
        </p>
      </div>

      {/* Zero-credit banner */}
      {credits === 0 && (
        <div className="card border-red-500/30 bg-red-500/5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-red-400 text-sm">You've used all your credits.</p>
          <a href="/buy-credits" className="btn-primary text-sm py-1.5 px-4">Buy credits →</a>
        </div>
      )}

      {/* Upload zone — only show when no image is loaded */}
      {!preview && (
        <div
          {...getRootProps()}
          className={
            "border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 " +
            (isDragActive
              ? "border-brand-500 bg-brand-500/10"
              : "border-white/10 hover:border-white/30 hover:bg-white/5")
          }
        >
          <input {...getInputProps()} />
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-lg font-medium mb-1">
            {isDragActive ? "Drop your image here" : "Drag & drop an image here"}
          </p>
          <p className="text-white/40 text-sm mb-4">or click to browse files</p>
          <p className="text-white/25 text-xs">JPG, PNG, WebP — max 10MB</p>
        </div>
      )}

      {/* Image work area */}
      {preview && (
        <div className="space-y-6">

          {/* Before / After slider (shows after result arrives) */}
          {result ? (
            <div className="card p-0 overflow-hidden">
              <div className="relative select-none" style={{ height: "420px" }}>

                {/* Processed image (underneath) */}
                <img
                  src={result}
                  alt="Processed"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3Crect x='10' width='10' height='10' fill='%23555'/%3E%3Crect y='10' width='10' height='10' fill='%23555'/%3E%3C/svg%3E\")" }}
                />

                {/* Original image clipped to the left */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={preview}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ width: `${10000 / sliderPos}%`, maxWidth: "none" }}
                  />
                </div>

                {/* Divider line + handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-black text-xs font-bold">⇄</span>
                  </div>
                </div>

                {/* Drag handler overlay */}
                <input
                  type="range" min="0" max="100" value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />

                {/* Labels */}
                <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Before</span>
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">After</span>
              </div>
            </div>
          ) : (
            /* Simple preview before processing */
            <div className="card p-0 overflow-hidden">
              <div className="relative h-80">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                {loading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/70 text-sm">Removing background...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button
                onClick={handleRemoveBg}
                disabled={loading || credits <= 0}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>✨ Remove Background (1 credit)</>
                )}
              </button>
            ) : (
              <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
                ⬇️ Download PNG
              </button>
            )}
            <button onClick={handleReset} className="btn-outline">
              Upload new image
            </button>
          </div>

          {/* Credit warning */}
          {credits <= 2 && credits > 0 && (
            <p className="text-amber-400 text-sm">
              ⚠️ You only have {credits} credit{credits === 1 ? "" : "s"} left.{" "}
              <a href="/buy-credits" className="underline">Buy more</a>
            </p>
          )}
          {credits === 0 && (
            <p className="text-red-400 text-sm">
              You've run out of credits.{" "}
              <a href="/buy-credits" className="underline font-medium">Purchase more →</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
