import { useEffect, useReducer, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

// initialState is created outside of the hook local scope as we don't need a new copy of it every time the hook is used
let initialState = {
  // when adding a doc to firestore, the response will include the document we just created
  // document: will be updated to match the doc we get from that response
  document: null,
  // used to determine if we're currently awaiting a response from firebase
  isPending: false,
  // used to hold errors we get from the response
  error: null,
  // show whether the request was successful
  success: null,
};

// used to update the state object (response from line 46)
// when the state object changes, then any component utilising it will re-render with the new state being used
const firestoreReducer = (currentState, action) => {
  switch (action.type) {
    // when every prop is defined, there's no need to include "...currentState"
    case 'IS_PENDING':
      // return the state, with only isPending changed, and all other props returned to default values
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null };
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload };

    // if no other case matches then return the state unchanged
    default:
      return currentState;
  }
};

export const useFirestore = specifiedCollection => {
  // response is the state that represents the response from firebase (it's not the actual response, but it will "represent" it)
  // dispatch is the function used to dispatch actions to the reducer function
  // firestoreReducer is the reducer function that we want to use
  // initialState is the initial state object that "response" will be filled with
  const [response, dispatch] = useReducer(firestoreReducer, initialState);

  // used for cleanup, to stop local state being updated on a component that's unmounted (will happen if user clicks away from page mid-request)
  const [isCancelled, setIsCancelled] = useState(false);

  // get a reference to the collection on firestore
  const collectionRef = collection(projectFirestore, specifiedCollection);

  // check if isCancelled is true, if so then the user has moved away from the page/component that initially used this hook
  // we only want to dispatch actions if the user hasn't clicked away
  const dispatchIfNotCancelled = action => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add document (will be an object) to collection
  const addDocument = async document => {
    // change isPending to true, so associated component can show a loading message or something
    dispatch({ type: 'IS_PENDING' });

    try {
      // create new date object with current date/time, add that as the from date to the timestamp object
      // timestamp object will be used to order the documents in firestore
      const createdAt = Timestamp.fromDate(new Date());
      // will add the document to the collection, and return a reference to the added document
      const addedDocumentReference = await addDoc(collectionRef, { ...document, createdAt: createdAt });

      // add addedDocumentReference to the document prop within the state object
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocumentReference });
    } catch (error) {
      // add error to error prop within state object
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  // remove document from collection
  // id of document to be removed will be passed in
  const removeDocument = async id => {
    // get reference to specific doc, within specified collection (which is declared when useFirestore is called, i.e. useFirestore('projects');)
    const docRef = doc(projectFirestore, specifiedCollection, id);

    // change isPending to true, so associated component can show a loading message or something
    dispatch({ type: 'IS_PENDING' });

    try {
      // delete document, will return a reference to the deleted document but we don't need that (;
      await deleteDoc(docRef);
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: `Could not delete: ${error.message}` });
    }
  };

  // id of document to be removed will be passed in
  const updateDocument = async (id, updates) => {
    // get reference to specific doc within specified collection
    const docRef = doc(projectFirestore, specifiedCollection, id);
    console.log(id, updates);
    dispatch({ type: 'IS_PENDING' });

    try {
      // update document, will return a reference to the updated document
      const updatedDocument = await updateDoc(docRef, updates);
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument });
    } catch (error) {
      // will fire if there's an error
      dispatchIfNotCancelled({ type: 'ERROR', payload: `Could not update: ${error.message}` });
    }
  };

  // cleanup function, will fire when the component using this hook unmounts
  // this will stop the hook from trying to update a component that is no longer mounted, which will result in an error
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []); // will only fire once on first render, when the component that uses this hook mounts the dom, due to the empty dependency array

  // return the functions and response object to be used by any component that is using this hook
  return { addDocument, removeDocument, updateDocument, response };
};
