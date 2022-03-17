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
 import { fireStore, loginWithGoogle, logout, auth } from "./firebase/firebase";
 // en import se agregaron los valores de "loginConGoogle", "auth" & "logout"
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
   const [user, setUser] = useState(null);
   //Se agregaron diferentes estados, para denotar si un tweet ha sido "corrido", "visto" o se puede considerar como "favorito". Se agregó un nuevo useState con user y setUser para las funcionalidades de autenticación.
   useEffect(() => {
 
     setIsSearch(true)
     //Se toma como que la variable "setIsSearch" es "verdadera" al correrse la aplicación, pero una vez hecha una vuelta con el useEffect, esta pasará a ser "falsa", esto tiene el proposito que una vez que se "renderize" la aplicación o realice su trabajo, muestre por un codigo mas a bajo un mensaje de "cargando". 
      //En el "const snap" se agregarón dos propiedades mas: "email" & "uid", ademas se procedió a realizar una refactorización de los mismos componentes, mediante "prop-drilling" y usando la asignación direcata con "ecmascript5".
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
            //Debido a ecmascript5 se escriben los "keyvalue" prar dirigir los componentes de abajo, si el valor de la llave y la de la constante se llaman igual, se puede escribir unicamente la llave sin afectar la logica del codigo. 
           const snap = {
             tweet,
             author,
             id: doc.id,
             email,
             uid,
             likes
            //  tweet: doc.data().tweet,
            //  author: doc.data().author,
            //  id: doc.id,
            //  email: doc.data().email,
            //  uid: doc.data().uid,
            //  likes: doc.data().likes,
           };
           tweets.push(snap);
         });
         setData(tweets);
         setFavs(tweets.filter(item => {
           return item.likes > 0;
         }))
         setIsSearch(false)
       });
       // En "setFavs" se setearon tweets y se les aplicó un filtrado, y los tweets con un "like" mayor a cero, se iban a renderizar como "favoritos", en la parte superior.
       auth.onAuthStateChanged((user) => {
         console.warn('LOGGED WIDTH:', user);
         setUser(user);
        //  console.log('UID:',user.uid);
       });
       // Para el caso de tener usario de ingreso y salida, se agrego: auth.onAuthStateChanged en la linea superior. En la linea superior se agregó un console.log que tomará a cuenta el UID del usuario.
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
   };
//en la linea debajo del section "login", esta un botón que le pregutna al usuario si esta "fuera" de la sesión, en caso de no ser el caso, ingresarlo con el login de google, de igual manera este le pregunta al user si iniciar o cerrar sesión. Para explicar lo colocado debajo del section con "login", se toma en cuenta que al ingresar el user o usuario este despliegue "hola", mas el nombre del usuario, asi mismo una imagen anexada a la URL que se tiene en google del mismo. En la sessión de "Form", debajo de "setData" se colocó que "uid" fuese igual a uid o un string vacio en caso de que todavía no exista el otro valor comparativo, estos valores reciben el nombre de "propiedades" o "props", donde se pasa una propiedad de un componente padre a un componente hijo o "prop drilling".
   return (
     <div className="App centered column">
       <section className="login">
         {user && (
           <div className='user-info'>
             <p>Hola {user.displayName}</p>
             <img src={user.photoURL} alt={user.displayName} />
           </div>
         )}
         <button className="btn-login" type="button" onClick={user ? logout : loginWithGoogle}>
           {user ? 'Cerrar' : 'Iniciar'} Sesión
         </button>
       </section>
       {/* {user && <Form data={data} setData={setData} />} */}
       {user && (
          <Form 
            data={data} 
            setData={setData}
            // uid={user.uid || ''}
            user={user || {}} 
          />
        )}
       <section className="tweets">
         {isSearch ? <p>Cargando...</p> : null}
         <button type="button" onClick={() => setView("feed") }>Tweets</button>
         <button type="button" onClick={() => setView("favs") }>Favs</button>
         {/** se colocaron dos botones para denotar cuales tweets eran "favoritos" y cuales "vistos", si el estado "view" estaba en "feed" se mostraría el "data(donde se tenían todos los tweets)" en caso contrario mostraría los tweets "favoritos", esto con el uso de un ternario y un mapeo. Todo lo que esté antes de un ".map" se somete a una "evaluación de código", pero por lo mismo que procede un .map, debe asegurarse que se analice un array. En la linea que tiene a "data" y "setData" se colocó el componente de "user", esto hace que se puedan escribir tweets UNICAMENTE cuando se haya accedido/iniciado la sesión. Debajo sel "strong author", se agregó otro "strong" con el valor de "item.email".*/}
         {/* {data.map((item) => ( */}
         {(view === "feed" ? data : favs).map((item) => (
           <div className="tweet" key={item.id}>
             <div className="tweet-content">
               <p>{item.tweet}</p>
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
 