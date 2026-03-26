import { useNavigate, useParams } from 'react-router-dom';
import { useFeatureList, useDeleteFeature } from '../../hooks/useFeatures';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: features, isLoading } = useFeatureList();
  const deleteMutation = useDeleteFeature();

  const handleDelete = (featureId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this feature?')) {
      deleteMutation.mutate(featureId, {
        onSuccess: () => {
          if (String(featureId) === id) navigate('/');
        },
      });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Features</h2>
        <button className="btn-new" onClick={() => navigate('/features/new')}>
          + New
        </button>
      </div>
      <nav className="sidebar-list">
        {isLoading && <p className="sidebar-loading">Loading...</p>}
        {features?.map((f) => (
          <div
            key={f.id}
            className={`sidebar-item ${String(f.id) === id ? 'active' : ''}`}
            onClick={() => navigate(`/features/${f.id}`)}
          >
            <div className="sidebar-item-info">
              <span className="sidebar-item-name">{f.name}</span>
              <span className="sidebar-item-count">
                {f.scenarioCount} scenario{f.scenarioCount !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              className="btn-delete-small"
              onClick={(e) => handleDelete(f.id, e)}
              title="Delete feature"
            >
              x
            </button>
          </div>
        ))}
        {features && features.length === 0 && (
          <p className="sidebar-empty">No features yet</p>
        )}
      </nav>
    </aside>
  );
}
