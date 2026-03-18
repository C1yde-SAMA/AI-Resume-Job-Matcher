export default function JobDescriptionInput({
    jobDescription,
    setJobDescription,
  }) {
    return (
      <section className="section">
        <label className="section-label">Job Description</label>
        <textarea
          className="textarea"
          rows="10"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </section>
    );
  }