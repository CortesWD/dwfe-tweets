 import React from "react";
 import Button from "./components/button/Button";
 import useForm from "./useForm";
 import { fireStore } from "./firebase/firebase";
 
 const Form = ({
     data = [],
     setData,
     user,
 }) => {
 
     const [value, handleInput, setValue] = useForm({ tweet: "" });
     const { tweet } = value;
 
     function handleSubmit(e) {
         e.preventDefault()
         
        
        const newTweet = {
            tweet: tweet,
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            photo: user.photoURL,
            date: Date.now()
        }
         console.warn(newTweet);

         const addTweet = fireStore.collection("tweets").add(newTweet);
         const getDoc = addTweet.then(doc => (doc.get()))
         getDoc.then(doc => {
             const currentTweet = {
                 tweet: doc.data().tweet,
                 author: doc.data().displayName,
                 id: doc.id,
                 uid: doc.data().uid,
                 email: doc.data().email,
                 photo: doc.data().photo,
                 likes: doc.data().likes,
                 date: doc.data().date,
             };
             setData([currentTweet, ...data]);
         });
         setValue({ tweet: "", author: "" });
     }
 
     return (
         <form className="tweet-form">
             <textarea
                 name='tweet'
                 placeholder='Escribe un Tweet'
                 value={tweet}
                 onChange={handleInput}
             >
             </textarea>
             <Button
                 className="btn-tweet"
                 onClick={handleSubmit}
             >
                 Submit
             </Button>
         </form>
     )
 }
 
 export default Form