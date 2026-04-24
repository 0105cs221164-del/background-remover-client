import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";
import { HistorySkeleton } from "../components/Skeleton.jsx";

const HistoryCard = ({ record, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(record.processedUrl);
      const blob     = await response.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = `bgeraser-${record._id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed.");
    }
  };

  return (
    <div className="card p-0 overflow-hidden group">
      {/* Image pair */}
      <div className="grid grid-cols-2 h-40">
        <div className="relative overflow-hidden border-r border-white/5">
          <img src={record.originalUrl} alt="Original" className="w-full h-full object-cover" />
          <span className="absolute bottom-1 left-1 bg-black/60 text-white/70 text-xs px-1.5 py-0.5 rounded">
            Before
          </span>
        </div>
        <div
          className="relative overflow-hidden"
          style={{ background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23222'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23222'/%3E%3Crect x='8' width='8' height='8' fill='%23333'/%3E%3Crect y='8' width='8' height='8' fill='%23333'/%3E%3C/svg%3E\")" }}
        >
          <img src={record.processedUrl} alt="Processed" className="w-full h-full object-contain" />
          <span className="absolute bottom-1 right-1 bg-black/60 text-white/70 text-xs px-1.5 py-0.5 rounded">
            After
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 flex items-center justify-between">
        <span className="text-white/40 text-xs">
          {new Date(record.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            ⬇ Download
          </button>

          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                onClick={() => onDelete(record._id)}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-white/30 hover:text-white/60 px-2 py-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const { backendUrl } = useApp();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/image/history`);
        if (data.success) setRecords(data.data);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/image/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 space-y-2">
          <div className="animate-pulse bg-white/8 rounded-lg h-8 w-36" />
          <div className="animate-pulse bg-white/8 rounded-lg h-4 w-24" />
        </div>
        <HistorySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Your History</h1>
        <p className="text-white/50 text-sm">{records.length} image{records.length !== 1 ? "s" : ""} processed</p>
      </div>

      {records.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-4">🖼️</p>
          <p className="text-white/50">No images yet. Remove a background to get started!</p>
          <a href="/dashboard" className="btn-primary inline-block mt-4">
            Go to Dashboard
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <HistoryCard key={record._id} record={record} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
