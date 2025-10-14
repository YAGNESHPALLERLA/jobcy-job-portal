"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface ResumeUploadProps {
  isDark?: boolean;
  onUploadSuccess?: (filePath: string) => void;
  currentResume?: string;
}

export default function ResumeUpload({
  isDark = false,
  onUploadSuccess,
  currentResume
}: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadSuccess(true);
        setUploadedFile(data.fileName);
        onUploadSuccess?.(data.filePath);

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Reset success message after 3 seconds, but keep uploaded file
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className={`p-6 rounded-lg border ${
      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark ? "bg-slate-700" : "bg-slate-100"
        }`}>
          <FileText className={`w-8 h-8 ${isDark ? "text-slate-300" : "text-slate-600"}`} />
        </div>

        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          Resume Upload
        </h3>

        <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Upload your resume to showcase your qualifications
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload button */}
        <button
          onClick={handleButtonClick}
          disabled={uploading}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
            uploading
              ? "bg-slate-400 cursor-not-allowed text-white"
              : isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{uploadedFile || currentResume ? "Upload New Resume" : "Choose Resume File"}</span>
            </>
          )}
        </button>

        {/* Success message */}
        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">Resume uploaded successfully!</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current resume info */}
        {(currentResume || uploadedFile) && !uploadSuccess && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Current Resume:</strong> {uploadedFile || currentResume?.split('/').pop()}
            </p>
          </div>
        )}

        {/* File requirements */}
        <div className="mt-6 text-xs text-slate-500">
          <p>Supported formats: PDF, DOC, DOCX</p>
          <p>Maximum file size: 5MB</p>
        </div>
      </div>
    </div>
  );
}