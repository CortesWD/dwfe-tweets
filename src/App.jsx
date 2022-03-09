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
import { fireStore } from "./firebase/firebase";

/**
 * Styles
 */
import "./index.css";
import like from "./like.svg";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const desuscribir = fireStore
      .collection("tweets")
      .onSnapshot((snapshot) => {
        const tweets = [];
        snapshot.forEach((doc) => {
          const snap = {
            tweet: doc.data().tweet,
            author: doc.data().author,
            id: doc.id,
            likes: doc.data().likes,
          };
          tweets.push(snap);
        });
        setData(tweets);
      });
    return () => {
      desuscribir();
    };
  }, []);

  

  const deleteTweet = (id) => {

    const userConfirm = confirm("Clicka en Aceptar o Cancelar");

    if(userConfirm){
      //Filtramos nuestro state con el documento que ya no
    // necesitamos con Array.filter
    const updatedTweets = data.filter((tweet) => {
      return tweet.id !== id;
    });

    

    //Actualizamos nuestro state con el array actualizado
    setData(updatedTweets);

    //Borramos documento de Firebase
    fireStore.doc(`tweets/${id}`).delete();
    }
    
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
      <Form data={data} setData={setData} />
      <section className="tweets">
        {data.map((item) => (
          <div className="tweet" key={item.id}>
            <div className="tweet-content">
              <p>{item.tweet}</p>
              <small>
                <strong>@{item.author}</strong>
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
