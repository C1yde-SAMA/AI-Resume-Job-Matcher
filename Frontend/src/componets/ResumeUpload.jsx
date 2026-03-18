export default function ResumeUpload({ resumeFile, setResumeFile }) {
    const handleFileChange = (event) => {
      const file = event.target.files?.[0] || null;
      setResumeFile(file);
    };
  
    return (
      <section className="section">
        <label className="section-label">Upload Resume</label>
        <input
          className="file-input"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        {resumeFile && (
          <p className="file-name">
            Selected file: <strong>{resumeFile.name}</strong>
          </p>
        )}
      </section>
    );
  }