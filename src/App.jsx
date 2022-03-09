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
  const [flag, setFlag] = useState(false)
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      });
    return () => {
      desuscribir();
    };
  }, []);
  const confirmDelete = ()=>{
    setFlag(true)
  }
  const deleteTweet = (id) => {
    //Filtramos nuestro state con el documento que ya no
    // necesitamos con Array.filter
    const updatedTweets = data.filter((tweet) => {
      return tweet.id !== id;
    });

    const cancelDelete = ()=>{
      setFlag(false)
    }

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
      <Form data={data} setData={setData} />
      {
        loading ?<h2>Cargando</h2> : <section className="tweets">
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
            <button className="delete" onClick={confirmDelete() }>
              X
            </button>
            {
              flag && (<div>
                <h3>Do you want to delete?</h3>
                <button onClick={() => deleteTweet(item.id)} >Yes</button>
                <button onClick={cancelDelete() } >No</button>
              </div>
              )
            }
          </div>
        ))}
      </section>
      }
    </div>
  );
}
