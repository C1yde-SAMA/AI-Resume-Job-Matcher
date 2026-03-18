export default function MatchButton({ loading, onClick }) {
    return (
      <div className="button-row">
        <button className="match-button" onClick={onClick} disabled={loading}>
          {loading ? "Matching..." : "Match Resume"}
        </button>
      </div>
    );
  }