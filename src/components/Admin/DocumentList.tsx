import { useState, useEffect } from "react";
import {
  File,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getDocuments, deleteDocument } from "../../services/api";
import type { Document } from "../../types";

interface DocumentListProps {
  refreshTrigger?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ refreshTrigger = 0 }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      setDeletingId(documentId);
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      setError("Failed to delete document");
      console.error("Error deleting document:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadgeColor = (category: string): string => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-800",
      admissions: "bg-blue-100 text-blue-800",
      academics: "bg-green-100 text-green-800",
      "student-life": "bg-purple-100 text-purple-800",
      policies: "bg-red-100 text-red-800",
      financial: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading documents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={fetchDocuments}
            className="ml-auto text-red-600 hover:text-red-500 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Documents ({documents.length})
        </h3>
        <button
          onClick={fetchDocuments}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents uploaded yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {documents.map((document) => (
              <li key={document.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <File className="h-8 w-8 text-red-500" />
                    </div>

                    <div className="ml-4 min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {document.title}
                        </p>
                        <div className="ml-2 flex-shrink-0">
                          {document.is_processed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500 truncate">
                          {document.original_filename}
                        </p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(document.file_size)}
                        </p>
                        {document.is_processed && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {document.chunk_count} chunks
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center mt-2 space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                            document.category
                          )}`}
                        >
                          {document.category.replace("-", " ")}
                        </span>
                        <span className="text-xs text-gray-500">
                          Uploaded {formatDate(document.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          document.is_processed
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {document.is_processed ? "Processed" : "Processing"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(document.id, document.title)}
                      disabled={deletingId === document.id}
                      className="inline-flex items-center p-1 border border-transparent rounded text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {deletingId === document.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
