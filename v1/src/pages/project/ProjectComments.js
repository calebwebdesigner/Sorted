import { nanoid } from 'nanoid';
import { removeSomeSpecialChars } from '../../custom/customFunctions';
import { decode } from 'html-entities';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// hooks
import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { arrayRemove, Timestamp } from 'firebase/firestore';

// components
import Avatar from '../../components/Avatar';

// images
import TrashCan from '../../assets/trashcan.svg';

// styles
import styles from './ProjectComments.module.css';

export default function ProjectComments({ project }) {
  const { updateDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // when user clicks bin to delete comment
  const handleClickDelete = async commentId => {
    // get comment index
    const indexOfComment = project.comments.findIndex(comment => {
      return comment.id === commentId;
    });

    // get comment object
    const commentToRemove = project.comments[indexOfComment];

    // remove comment from project doc's comments field
    await updateDocument(project.id, {
      comments: arrayRemove(commentToRemove),
    });
  };

  // when user submits new comment
  const handleSubmit = async event => {
    event.preventDefault();

    // remove any previous errors that may have popped up
    setError(null);

    // sanitise input, trim off white space
    const newCommentToAdd = removeSomeSpecialChars(newComment.trim());

    // check if comment is just whitespace, will be trimmed at this point so if it was only whitespace then it'll just be ''
    if (newCommentToAdd === '') {
      setError("An empty comment isn't valid!");

      // empty comment box
      setNewComment('');

      // stop code from running further
      return;
    }

    // create comment object
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newCommentToAdd,
      createdAt: Timestamp.fromDate(new Date()),
      // createdBy used to know if current user is the one who made the comment, so they can be given access to delete it
      createdBy: user.uid,
      id: nanoid(),
    };

    // add comment to project document
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    });

    // update textarea to be empty string, if there's no errors
    if (!response.error) {
      setNewComment('');
    }
  };

  return (
    <div className={styles.comments}>
      <h4>Project Comments</h4>

      {/* only show comments section if there are comments to show, otherwise remove it and let add comments section sit at the top */}
      {project.comments.length > 0 && (
        <ul className={styles.commentsContent}>
          {project.comments.length > 0 &&
            // remember to wrap with () when html elements will be returned, not {}
            project.comments.map(comment => (
              <li key={comment.id}>
                <div className={styles.commentBinContainer}>
                  {/* avatar, user name */}
                  <div className={styles.commentAuthor}>
                    <Avatar src={comment.photoURL} />
                    <p>{comment.displayName}</p>
                  </div>

                  {/* show delete icon only to the user that made the comment */}
                  {user.uid === comment.createdBy && (
                    <div>
                      <img src={TrashCan} alt="Delete" onClick={() => handleClickDelete(comment.id)} />
                    </div>
                  )}
                </div>

                {/* date */}
                <div className={styles.commentDate}>
                  <p className="subtxt-dark">{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                </div>

                {/* content */}
                <div>
                  <p>{decode(comment.content)}</p>
                </div>
              </li>
            ))}
        </ul>
      )}

      <form className={styles.addComment} onSubmit={handleSubmit}>
        <label>
          <span>Add a Comment:</span>
          <textarea
            required
            onChange={event => {
              setNewComment(event.target.value);
            }}
            value={newComment}></textarea>
        </label>
        <div className="center-button-wrapper">
          <button className="btn">Add Comment</button>
        </div>
        {error && <div className="err">{error}</div>}
      </form>
    </div>
  );
}
