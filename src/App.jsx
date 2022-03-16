/**
 * Dependencies
 */
import React, { useEffect, useState } from "react";

/**
 * Components
 */
import Form from "./Form";
import Button from './components/button/Button';

/**
 * Firebase
 */
import { fireStore, loginWithGoogle, logout, auth } from './firebase/firebase';


/**
 * Styles
 */
import "./index.css";
import like from "./like.svg";

export default function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const desuscribir = fireStore
      .collection("tweets")
      .onSnapshot((snapshot) => {
        const tweets = [];
        snapshot.forEach((doc) => {
          const {
            tweet,
            author,
            email,
            uid,
            likes
          } = doc.data();

          const snap = {
            //tweet: tweet,
            tweet,
            author,
            id: doc.id,
            email,
            uid,
            likes,
          };

          tweets.push(snap);
        });
        setData(tweets);
      });

    auth.onAuthStateChanged((user) => {
      console.warn('LOGGED WITH:', user);
      setUser(user);
    });

    return () => {
      desuscribir();
    };
  }, []);

  const deleteTweet = (id) => {
    //Filtramos nuestro state con el documento que ya no
    // necesitamos con Array.filter
    const updatedTweets = data.filter((tweet) => {
      return tweet.id !== id;
    });

    //Actualizamos nuestro state con el array actualizado
    setData(updatedTweets);

    //Borramos documento de Firebase
    fireStore.doc(`tweets/${id}`).delete();
  };

  /**
   *@description Funcion que actualiza likes en base de datos
   */

  function likeTweet(id, likes) {
    const innerLikes = likes || 0;
    fireStore.doc(`tweets/${id}`).update({ likes: innerLikes + 1 });
  }

  return (
    <div className="App centered column">
      <section className="login">
        {user && (
          <div className='user-info'>
            <p>Hola {user.displayName}</p>
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
          </div>
        )}
        <Button className="btn-login" type="button" onClick={user ? logout : loginWithGoogle}>
          {user ? 'Cerrar' : 'Iniciar'} Sesión
        </Button>
      </section>
      {user && (
        <Form
          data={data}
          setData={setData}
          user={user || {}}
        />
      )}
      <section className="tweets">
        {data.map((item) => (
          <div className="tweet" key={item.id}>
            <div className="tweet-content">
              <p>{item.tweet}</p>
              <small>
                <strong>@{item.author}</strong>
                <br />
                <strong>{item.email}</strong>
              </small>
            </div>
            <div className="tweet-actions">
              <button
                className="likes"
                onClick={() => likeTweet(item.id, item.likes)}
              >
                <img src={like} alt="" />
                {/* <span>{item.likes ? item.likes : 0}</span> */}
                <span>{item.likes || 0}</span>
              </button>
            </div>
            <button className="delete" onClick={() => deleteTweet(item.id)}>
              X
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
