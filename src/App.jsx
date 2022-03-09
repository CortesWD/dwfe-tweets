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
  const [ids, setIds] = useState("")

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
  const confirmDelete = (id)=>{
    setFlag(true)
    setIds(id)

  }
  const deleteTweet = () => {
    //Filtramos nuestro state con el documento que ya no
    // necesitamos con Array.filter
    const updatedTweets = data.filter((tweet) => {
      return tweet.id !== ids;
    });

    
    //Actualizamos nuestro state con el array actualizado
    setData(updatedTweets);

    //Borramos documento de Firebase
    fireStore.doc(`tweets/${ids}`).delete();
    setIds("")
    setFlag(false)
  };

    const cancelDelete = ()=>{
      setFlag(false)
    }

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
            <button className="delete" onClick={()=>confirmDelete (item.id)}>
              X
            </button>
          </div>
        ))}
      </section>
      }
      {
        flag && (<div>
          <h3>Do you want to delete?</h3>
          <button onClick={() => deleteTweet()} >Yes</button>
          <button onClick={cancelDelete} >No</button>
        </div>
        )
      }
    </div>
  );
}
