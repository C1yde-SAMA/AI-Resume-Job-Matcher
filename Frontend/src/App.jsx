import { useState } from "react";
import { uploadResumeFile, matchResumeToJob } from "./services/api";
import "./index.css";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const MAX_FILE_SIZE_MB = 5;

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadedResumeInfo, setUploadedResumeInfo] = useState(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchError, setMatchError] = useState("");

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const validateResumeFile = (file) => {
    if (!file) {
      return "Please select a resume file.";
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload PDF, DOC, DOCX, or TXT.";
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
    }

    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setResumeFile(null);
    setUploadError("");
    setUploadSuccess("");
    setUploadStatus("");
    setUploadedResumeInfo(null);
    setResult(null);
    setMatchError("");

    if (!file) {
      return;
    }

    const error = validateResumeFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setResumeFile(file);
    setUploadStatus("File ready to upload.");
  };

  const handleUploadResume = async () => {
    setUploadError("");
    setUploadSuccess("");
    setUploadStatus("");
    setUploadedResumeInfo(null);

    const error = validateResumeFile(resumeFile);
    if (error) {
      setUploadError(error);
      return;
    }

    try {
      setLoadingUpload(true);
      setUploadStatus("Uploading resume...");

      const data = await uploadResumeFile(resumeFile);

      setUploadSuccess("Resume uploaded successfully.");
      setUploadStatus("");
      setUploadedResumeInfo(data);
    } catch (err) {
      setUploadError(err.message || "Failed to upload resume.");
      setUploadStatus("");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleMatch = async () => {
    setMatchError("");
    setResult(null);

    const fileError = validateResumeFile(resumeFile);
    if (fileError) {
      setMatchError(fileError);
      return;
    }

    if (!jobDescription.trim()) {
      setMatchError("Please paste a job description.");
      return;
    }

    try {
      setLoadingMatch(true);
      const data = await matchResumeToJob(resumeFile, jobDescription);
      setResult(data);
    } catch (err) {
      setMatchError(err.message || "Failed to analyze match.");
    } finally {
      setLoadingMatch(false);
    }
  };

  const percentage = result ? Math.round((result.score || 0) * 100) : 0;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">AI</div>
          <span>Resume Matcher</span>
        </div>
        <div className="topbar-tag">Built for job seekers</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">AI-powered career matching</div>
          <h1>Turn your resume into a smarter job search.</h1>
          <p>
            Upload your resume, paste a job description, and see your alignment,
            skill match, and missing requirements.
          </p>
        </div>
      </section>

      <main className="workspace">
        <section className="panel input-panel">
          <div className="panel-head">
            <h2>Resume Upload</h2>
            <span>Step 1: upload your resume</span>
          </div>

          <div className="field-group">
            <label className="field-label">Resume File</label>

            <label className="upload-card">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <div className="upload-main">
                <div className="upload-icon">↑</div>
                <div>
                  <div className="upload-title">
                    {resumeFile ? resumeFile.name : "Choose your resume file"}
                  </div>
                  <div className="upload-subtitle">
                    Supported: PDF, DOC, DOCX, TXT
                  </div>
                </div>
              </div>
            </label>

            {resumeFile && (
              <div className="file-meta-card">
                <div><strong>Name:</strong> {resumeFile.name}</div>
                <div><strong>Type:</strong> {resumeFile.type || "Unknown"}</div>
                <div><strong>Size:</strong> {formatFileSize(resumeFile.size)}</div>
              </div>
            )}
          </div>

          <button
            className="secondary-btn"
            onClick={handleUploadResume}
            disabled={loadingUpload || !resumeFile}
          >
            {loadingUpload ? "Uploading..." : "Upload Resume"}
          </button>

          {uploadStatus && <div className="info-box">{uploadStatus}</div>}
          {uploadError && <div className="error-box">{uploadError}</div>}
          {uploadSuccess && <div className="success-box">{uploadSuccess}</div>}

          {uploadedResumeInfo && (
            <div className="soft-card upload-result-card">
              <h3>Uploaded Resume Info</h3>
              <p><strong>Filename:</strong> {uploadedResumeInfo.filename}</p>
              <p><strong>File type:</strong> {uploadedResumeInfo.content_type}</p>
              <p><strong>File size:</strong> {formatFileSize(uploadedResumeInfo.size)}</p>
              <p><strong>Stored path:</strong> {uploadedResumeInfo.saved_as}</p>
            </div>
          )}

          <div className="panel-head section-gap">
            <h2>Job Description</h2>
            <span>Step 2: analyze job fit</span>
          </div>

          <div className="field-group">
            <label className="field-label">Job Description</label>
            <textarea
              className="jd-textarea"
              rows="11"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {matchError && <div className="error-box">{matchError}</div>}

          <button
            className="primary-btn"
            onClick={handleMatch}
            disabled={loadingMatch}
          >
            {loadingMatch ? "Analyzing..." : "Analyze Match"}
          </button>
        </section>

        <section className="panel result-panel">
          <div className="panel-head">
            <h2>AI Result</h2>
            <span>Score, alignment, and skill gaps</span>
          </div>

          {!result && !loadingMatch && (
            <div className="empty-state">
              <div className="empty-orb" />
              <h3>No analysis yet</h3>
              <p>Upload the resume and run the analysis to see results here.</p>
            </div>
          )}

          {loadingMatch && (
            <div className="empty-state">
              <div className="loader" />
              <h3>Analyzing your profile</h3>
              <p>Please wait while the system compares your resume to the role.</p>
            </div>
          )}

          {result && (
            <>
              <div className="score-card">
                <div
                  className="score-ring"
                  style={{
                    background: `conic-gradient(#3b82f6 ${percentage * 3.6}deg, #dbe7ff 0deg)`,
                  }}
                >
                  <div className="score-inner">
                    <strong>{percentage}%</strong>
                    <span>Match</span>
                  </div>
                </div>

                <div className="score-copy">
                  <h3>Overall Match Score</h3>
                  <p>
                    This score estimates how closely your resume aligns with the job description.
                  </p>
                </div>
              </div>

              <div className="result-grid">
                <div className="soft-card">
                  <h3>Matched Skills</h3>
                  <div className="chips">
                    {(result.matched_skills || []).length > 0 ? (
                      result.matched_skills.map((skill, index) => (
                        <span key={`${skill}-${index}`} className="chip matched">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="muted">No matched skills found.</p>
                    )}
                  </div>
                </div>

                <div className="soft-card">
                  <h3>Missing Skills</h3>
                  <div className="chips">
                    {(result.missing_skills || []).length > 0 ? (
                      result.missing_skills.map((skill, index) => (
                        <span key={`${skill}-${index}`} className="chip missing">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="muted">No missing skills found.</p>
                    )}
                  </div>
                </div>
              </div>

              {result.resume_preview && (
                <div className="soft-card preview-card">
                  <h3>Resume Preview</h3>
                  <p>{result.resume_preview}</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}