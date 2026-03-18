export default function SkillList({ title, skills, type }) {
    return (
      <div className="skill-card">
        <h3>{title}</h3>
        {skills && skills.length > 0 ? (
          <ul className="skill-list">
            {skills.map((skill, index) => (
              <li key={`${skill}-${index}`} className={`skill-item ${type}`}>
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No items found.</p>
        )}
      </div>
    );
  }