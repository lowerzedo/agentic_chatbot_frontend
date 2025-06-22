import { useState, useCallback } from "react";
import { Upload, File, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { uploadDocument } from "../../services/api";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    category: "general",
  });

  const categories = [
    { value: "general", label: "General" },
    { value: "admissions", label: "Admissions" },
    { value: "academics", label: "Academics" },
    { value: "student-life", label: "Student Life" },
    { value: "policies", label: "Policies" },
    { value: "financial", label: "Financial" },
  ];

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed.";
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return "File size must be less than 10MB.";
    }

    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadStatus("error");
      setUploadMessage(error);
      return;
    }

    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadMessage("");

    // Auto-populate title if empty
    if (!metadata.title) {
      setMetadata((prev) => ({
        ...prev,
        title: file.name.replace(".pdf", ""),
      }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadMessage("Uploading document...");

    try {
      const response = await uploadDocument(
        selectedFile,
        metadata.title || undefined,
        metadata.description || undefined,
        metadata.category
      );

      setUploadStatus("success");
      setUploadMessage(`Successfully uploaded: ${response.filename}`);
      setSelectedFile(null);
      setMetadata({ title: "", description: "", category: "general" });

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage("Failed to upload document. Please try again.");
      console.error("Upload error:", error);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadMessage("");
    setMetadata({ title: "", description: "", category: "general" });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Document
        </h2>
        <p className="text-gray-600">
          Upload PDF documents to enhance the chatbot's knowledge base.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`upload-area ${isDragOver ? "dragover" : ""} mb-6`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-900 mb-2">
            Drop your PDF file here, or{" "}
            <label className="text-primary-600 hover:text-primary-500 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInputChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">PDF files up to 10MB</p>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Metadata Form */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) =>
                  setMetadata((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Document title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={metadata.description}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description of the document content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={metadata.category}
                onChange={(e) =>
                  setMetadata((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleUpload}
              disabled={uploadStatus === "uploading"}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === "uploading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {uploadMessage && (
        <div
          className={`p-4 rounded-md mb-4 ${
            uploadStatus === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : uploadStatus === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex items-center">
            {uploadStatus === "success" && (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            {uploadStatus === "error" && <XCircle className="w-5 h-5 mr-2" />}
            {uploadStatus === "uploading" && (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            )}
            <span className="text-sm font-medium">{uploadMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
