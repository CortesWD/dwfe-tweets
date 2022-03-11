/**
 * Dependencies
 */
import React, { useEffect, useState } from "react";

/**
 * Components
 */
import Form from "./Form";

/**
 * Firebase
 */
import { fireStore, loginWithGoogle, logout, auth } from './firebase/firebase';


/**
 * Styles
 */
import "./index.css";
import Button from './components/button/Button';

export default function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const disconnect = fireStore.collection('tweets')
      .onSnapshot((snapshot) => {
        const tweets = [];
        snapshot.forEach(doc => {
          const snap = {
            tweet: doc.data().tweet,
            author: doc.data().author,
            id: doc.id
          };
          tweets.push(snap);

        });
        setData(tweets)

      });

    auth.onAuthStateChanged((user) => {
      console.warn('LOGGED WIDTH:', user);
      setUser(user);
    });

    return () => { disconnect() }

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

  return (
    <div className="App centered column">
      <section className="login">
        {user && (
          <div className='user-info'>
            <p>Hola {user.displayName}</p>
            <img src={user.photoURL} alt={user.displayName} />
          </div>
        )}
        <Button className="btn-login" type="button" onClick={user ? logout : loginWithGoogle}>
          {user ? 'Cerrar' : 'Iniciar'} Sesión
        </Button>
      </section>
      {user && <Form data={data} setData={setData} />}
      <section className='tweets'>
        {
          data.map(item => (
            <div className='tweet' key={item.id} >
              <div className="tweet-content">
                <p>{item.tweet}</p>
                <small>
                  <strong>@{item.author}</strong>
                </small>
              </div>
              <div className='tweet-actions'>
              </div>
              <button className="delete" onClick={() => deleteTweet(item.id)} >X</button>
            </div>
          ))
        }
      </section>
    </div>
  );
}
