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
  const [favs, setFavs] = useState([]);
  const [view, setView] = useState("feed");
  const [isSearch, setIsSearch] = useState(false);
  //Se agregaron diferentes estados, para denotar si un tweet ha sido "corrido", "visto" o se puede considerar como "favorito".
  useEffect(() => {

    setIsSearch(true)
    //Se toma como que la variable "setIsSearch" es "verdadera" al correrse la aplicación, pero una vez hecha una vuelta con el useEffect, esta pasará a ser "falsa", esto tiene el proposito que una vez que se "renderize" la aplicación o realice su trabajo, muestre por un codigo mas a bajo un mensaje de "cargando".

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
        setFavs(tweets.filter(item => {
          return item.likes > 0;
        }))
        setIsSearch(false)
      });
      //En "setFavs" se setearon tweets y se les aplicó un filtrado, y los tweets con un "like" mayor a cero, se iban a renderizar como "favoritos"
    return () => {
      desuscribir();
    };
  }, []);



  const deleteTweet = (id) => {
    //Aqui se tiene la función con la que se elimina un tweet, en esta se agregó la variable "useConfirm" que contiene "window.confirm" que depsliega en pantalla una "alerta" pero con la diferencia que ".confirm" agrega un si o no, en este caso si la persona quiere eliminar o no el tweet.
    const userConfirm = window.confirm("¿Estás seguro que quieres eliminar este hermoso Tweet?");

    if (userConfirm) {
      //Filtramos nuestro state con el documento que ya no
      // necesitamos con Array.filter
      const updatedTweets = data.filter((tweet) => {
        return tweet.id !== id;
      });
      //El codigo previo de updatedTweets se coloca dentro del useconfirm.


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
        {isSearch ? <p>Cargando...</p> : null}
        <button type="button" onClick={() => setView("feed") }>Tweets</button>
        <button type="button" onClick={() => setView("favs") }>Favs</button>
        {/** se colocaron dos botones para denotar cuales tweets eran "favoritos" y cuales "vistos", si el estado "view" estaba en "feed" se mostraría el "data(donde se tenían todos los tweets)" en caso contrario mostraría los tweets "favoritos", esto con el uso de un ternario y un mapeo. */}
        {/* {data.map((item) => ( */}
        {(view === "feed" ? data : favs).map((item) => (
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
