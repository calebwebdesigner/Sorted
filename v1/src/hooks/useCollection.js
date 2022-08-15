import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

// hooks
import { useEffect, useRef, useState } from 'react';

// this hook will return collection changes in real-time
export const useCollection = (specifiedCollection, _query, _orderDocs) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // wrap the passed in _query in a useRef() before being used
  // if useRef isn't used, then due to specifiedQuery being a dependency of useEffect below, useEffect will keep looping as ['uid', '==', user.uid] is a reference type, and useEffect will see it's changed on every component re-render (thereby causing an infinite loop) even if it hasn't "changed", as reference type variables contain a "reference" to the value in memory, not the value itself. so whenever the location in memory changes, the value of the reference type object changes too, as the "value" is a reference to where the value itself is stored. a = {value: 10}, a will hold the location of where to find {value: 10} in memory, not {value: 10} itself
  // ['uid', '==', user.uid] is what's being passed in from Home.js as the _query
  // _query is an array, and is "different" on every function call
  // .current will get the value as it is currently
  // if _query and _orderDocs arguments aren't passed in, then the whole collection will be grabbed, and in whatever order they're in within firestore
  const specifiedQuery = useRef(_query).current;
  const orderDocs = useRef(_orderDocs).current;

  // useEffect will fire as soon as the component using this hook mounts the dom
  useEffect(() => {
    // get a reference to the collection on firestore
    let reference = collection(projectFirestore, specifiedCollection);

    // used to order the docs so they show up in order on the dom
    if (orderDocs) {
      reference = query(reference, where(...specifiedQuery), orderBy(...orderDocs));
    } else if (specifiedQuery) {
      // query to determine which data to retrieve from collection
      // example: onSnapshot() will only retrieve docs WHERE the user.uid on the doc = the uid of the specifiedQuery, check Home.js line 16
      reference = query(reference, where(...specifiedQuery));
    }

    // snapshot will return an unsubscribe function that can be used to stop "listening" to changes within the collection
    // whenever the collection is changed, this function will fire "(snapshot) => {}" and a new snapshot will be returned
    const unsub = onSnapshot(
      // reference will be determined by what arguments are passed into this hook when it's used by a component
      reference,
      snapshot => {
        let results = [];
        // snapshot.docs represents an array of the documents from the snapshot
        snapshot.docs.forEach(doc => {
          // doc.data() is how you get the doc data, then we're adding an id prop to it before adding the object to the results array
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      // will fire if there's an error
      error => {
        console.log('useCollection hook error: ', error);
        setError('useCollection hook error: ' + error);
      }
    );

    // unsub on unmount, stop "listening" to changes within the collection
    // if this cleanup is not done when a user clicks away from the component, then errors will be thrown as the state won't be able to be updated (as the component will no longer be mounted)
    return () => unsub();
  }, [specifiedCollection, specifiedQuery, orderDocs]);

  return { documents, error };
};
