import { doc, onSnapshot } from 'firebase/firestore';
import { removeSpecialChars } from '../custom/customFunctions';
import { projectFirestore } from '../firebase/config';

// hooks
import { useEffect, useState } from 'react';

export const useDocument = (specifiedCollection, docId) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // get real-time data for a document within specified collection
  useEffect(() => {
    // get a reference to the collection on firestore
    const docRef = doc(projectFirestore, specifiedCollection, removeSpecialChars(docId));

    // onsnapshot will return an unsubscribe function that can be used to stop "listening" to changes within the collection
    // whenever the collection is changed, this function will fire "(snapshot) => {}" and a new snapshot will be returned
    const unsub = onSnapshot(
      docRef,
      // snapshot represents the document we have a reference to in "reference"
      snapshot => {
        // check there's actually a document with an id of "docId", if there isn't it won't throw an error as firebase doesn't see it that way, maybe you're setting up the reference/listener before making the document?
        // if the snapshot has data
        if (snapshot.data()) {
          // update document state object
          setDocument({ ...snapshot.data(), id: snapshot.id });

          // remove any previous errors
          setError(null);
        } else {
          setError("That project doesn't exist!");
        }
      },
      // will fire if there's an error
      error => {
        console.log('useCollection hook error: ', error.message);
        setError('Failed to retrieve project :(, please try again later.');
      }
    );

    // unsub on unmount, stop "listening" to changes to the document within the collection
    // if this cleanup is not done when a user clicks away from the component, then errors will be thrown as the state won't be able to be updated (as the component will no longer be mounted)
    return () => unsub();
  }, [specifiedCollection, docId]);

  return { document, error };
};
