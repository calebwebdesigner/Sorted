// hooks
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

// components
import ProjectSummary from './ProjectSummary';
import ProjectComments from './ProjectComments';

// styles
import styles from './Project.module.css';

export default function Project() {
  const { id } = useParams();

  // useDocument will listen to changes within the specified doc
  // when a change occurs, document here will update, which will cause <ProjectSummary project={document} /> and <ProjectComments project={document} /> to update too
  const { document, error } = useDocument('projects', id);

  // if there's an error, show user error and stop running code
  if (error) {
    return <div className="err">{error}</div>;
  }

  // whilst retrieving project/document
  if (!document) {
    return <p className="loadingText">Loading Project...</p>;
  }

  return (
    <div className={styles.projectDetails}>
      <ProjectSummary project={document} />
      <ProjectComments project={document} />
    </div>
  );
}
