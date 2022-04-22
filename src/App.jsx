 //dependencies
 import React, { useEffect, useState } from "react";
//  import { BrowserRouter,/* Switch, Route, Link */} from 'react-router-dom';

 //components
 import Form from "./Form";
 import Header from "./components/header/Header";
 import Footer from "./components/footer/Footer";
 
 //firebase
 import { fireStore, loginWithGoogle, logout, auth } from "./firebase/firebase";
 
 //styles
 import "./index.css";
 import like from "./components/source/like.svg";
 import logobig from "./components/source/logobig.png";
 import pase from "./components/source/logout.png";
//  import RingLoader from "react-spinners/RingLoader";
 
 export default function App() {
   const [data, setData] = useState([]);
  //  const [loading, setLoading] = useState(true);
   const [favs, setFavs] = useState([]);
   const [view, setView] = useState("feed");
   const [isSearch, setIsSearch] = useState(false);
   const [user, setUser] = useState(null);
   
   //Autentication
   useEffect(() => {
 
     setIsSearch(true)
     
     const desuscribir = fireStore
       .collection("tweets")
      //  .orderBy("date")
       .onSnapshot((snapshot) => {
         const tweets = [];
         snapshot.forEach((doc) => {
           const {
             tweet,
             author,
             email,
             uid,
             likes, 
             photo,
            //  date,
            } = doc.data();

           const snap = {
             tweet,
             author,
             id: doc.id,
             email,
             uid,
             likes, 
             photo,
            //  date,
           };
          //  tweets.push(snap);
          tweets.unshift(snap); //en vez de push para agregarlo al principio

         });
         setData(tweets);
         setIsSearch(false)
       });
       
       auth.onAuthStateChanged((user) => {
         
         setUser(user)
         if (user) {
           fireStore.collection('users').get()
             .then(snapshot => {
               snapshot.forEach(doc => {
                 const userDoc = doc.data()
                 if (userDoc.uid === user.uid) {
                   setUser({
                     ...user, ...userDoc
                   })
                 }
               })
             })
         }
       });

     return () => {
       desuscribir();
     };
   }, []);

   useEffect(() => {
     if (user) {
       if (data.length && user.favorites && user.favorites.length) {
          const favorites = user.favorites.map(favId => {
            const tweetFav = data.find(item => item.id === favId)
            console.log(data, favId)
            return tweetFav
          })
            .filter(item => item !== undefined)
          setFavs(favorites)
          console.log('FAVORITESSSSSSSSS', favorites)
       }
       console.log('DATA', data)
       console.log('Entrando al efecto', user)

       fireStore.collection("users")
         .get()
         .then(snapshot => {

           if (!snapshot.size) {
             return fireStore.collection('users').add({
               displayName: user.displayName,
               photo: user.photoURL,
               uid: user.uid,
               email: user.email,
               favorites: []
             })
           } else {
             snapshot.forEach(doc => {
               const userDoc = doc.data()
               if (userDoc.uid !== user.uid) {
//Preguntar/ver como eliminar el "useDoc.id" ya que por el "forEach" se terminan creando usuarios de forma infinita.
                 return fireStore.collection('users').add({
                   displayName: user.displayName,
                   photo: user.photoURL,
                   uid: user.uid,
                   email: user.email,
                   favorites: []
                 })
               }
             })
           }

         })
         .then(doc => doc.get())
         .then(userDoc => {
           setUser(userDoc)
           console.warn(userDoc)
         })
     }
   }, [user, data]) 
 
   //delete tweet
   const deleteTweet = (id) => {
     const userConfirm = window.confirm("¿Estás seguro que quieres eliminar este hermoso Tweet?");
     if (userConfirm) {
       const updatedTweets = data.filter((tweet) => {
         return tweet.id !== id;
       });
       setData(updatedTweets);
       fireStore.doc(`tweets/${id}`).delete();
     }
   };
 
   //like tweets
   function likeTweet(id, likes) {
     const innerLikes = likes || 0;
     fireStore.doc(`tweets/${id}`).update({ likes: innerLikes + 1 });
     fireStore.collection("users")
       .get()
       .then(snapshot => {
         snapshot.forEach(doc => {
           const userDoc = doc.data()
           if (userDoc.uid === user.uid) {
             console.log(doc.id)
             fireStore.doc(`users/${doc.id}`).update({
               favorites: [...userDoc.favorites, id]
              })
           }
         })
       })
       setUser({
         ...user, favorites: [...user.favorites, id]
       })   
   }

   return (
    //  <BrowserRouter>
     <div className="App centered column">
       
       { user && (<Header />)}
       <section className="login">
         {user && (
           <div className='user-info'>
             <p>Hola {user.displayName}</p>
             <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
           </div>
         )}
         <button className="btn-login" type="button" onClick={user ? logout : loginWithGoogle}>
           {user ? 'Cerrar' : 'Iniciar'} Sesión
           <img alt="entrada/salida" src={pase}/>
         </button>
         {user === null && 
         (<div className="containerlogout">
           <h1 className="title1">DEV'S united</h1>
         <img alt="felicidad" src={logobig}/>
         </div>)}
       </section>
       
       {user && (
          <Form 
            data={data} 
            setData={setData}
            user={user || {}} 
          />
        )}
        {/* { loading?<RingLoader className="loader" color={"#477A0C"} loading={loading} size={100} />: */}
       <section className="tweets">
         { isSearch ? <p>Cargando...</p> : null}
         { user && (<button className="btn-feeding" type="button" onClick={() => setView("feed") }>Tweets</button>)}
         { user && (<button className="btn-favorites" type="button" onClick={() => setView("favs") }>Favs</button>)}
         
         { user && (view === "feed" ? data : favs).map((item) => (
           <div className="tweet" key={item.id}>
             
             {/* <div className="containerPhotoTweet">
               <img src={item.photo} alt="fotografía"/> 
               el "containerPhotoTweet" fue sustituido por <img src={item.photo} alt={item.photo}/>
             </div> */} 
             
             <div className="tweet-content">
               <p>{item.tweet}</p>
               <img src={item.photo} alt={item.photo}/> 
               <hr/>
               <small>
                 <strong>@{item.author}</strong>
                 <br/>
                 <strong>{item.email}</strong>
               </small>
             </div>
             <div className="tweet-actions">
               <button
                 className="likes"
                 onClick={() => likeTweet(item.id, item.likes)}
               >
                 <img src={like} alt="like" />
                 
                 <span>{item.likes || 0}</span>
               </button>
             </div>
             {
               (user !== null && user.uid === item.uid) && 
              <button className="delete" onClick={() => deleteTweet(item.id)}>
               X
              </button>
             }
           </div>
         ))}
       </section>
       {/* } */}
       {user && (<Footer />)}
     </div>
    //  </BrowserRouter>
   );
 }
//Continuar video desde minuto 00:51:49, en la parte de Alejandra.