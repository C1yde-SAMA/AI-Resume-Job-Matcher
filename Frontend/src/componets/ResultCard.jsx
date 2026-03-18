import SkillList from "./SkillList";

export default function ResultCard({ result }) {
  const percentage = Math.round((result.score || 0) * 100);

  return (
    <section className="result-section">
      <h2>Match Result</h2>

      <div className="score-box">
        <div className="score-circle">{percentage}%</div>
        <div>
          <p className="score-title">Overall Match Score</p>
          <p className="score-subtitle">
            Based on semantic similarity and skill overlap
          </p>
        </div>
      </div>

      <div className="skills-grid">
        <SkillList
          title="Matched Skills"
          skills={result.matched_skills || []}
          type="matched"
        />
        <SkillList
          title="Missing Skills"
          skills={result.missing_skills || []}
          type="missing"
        />
      </div>

      {result.resume_preview && (
        <div className="preview-box">
          <h3>Resume Preview</h3>
          <p>{result.resume_preview}</p>
        </div>
      )}
    </section>
  );
}