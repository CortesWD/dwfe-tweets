/**
 * Dependencies
 */
import React from "react";

/**
 * Components
 */
import Button from "./components/button/Button";

/**
 * Hooks
 */
import useForm from "./useForm";

/**
 * Others
 */
import { fireStore } from "./firebase/firebase";
//Para cuestión login y uid se agrega debajo de la linea de setData como otro valor para recibir, el valor "uid" se pasa en el formulario, ya que en este estamos haciendo submit de los "tweets".
const Form = ({
    data = [],
    setData,
    // uid,
    user,
}) => {
//Gracias al "useForm" inferior que tenemos por defecto, se tendrá como valor: "tweet".
    // const [value, handleInput, setValue] = useForm({
    //     tweet: "",
    //     author: ""
    // });
    const [value, handleInput, setValue] = useForm({ tweet: "" });
//Debido al uso del UID el valor del "author" puede descartarse del const inferior, pues este se conoce el autor al momento de que el usuario se loguea.
    // const { tweet, author } = value;
    const { tweet } = value;
//Debido a que "value" tiene mucha presencia en codigos inferiores, se implementa el uso del "debugger", el debugger lo que hace es interrumpir el "flujo" para poder ver los valores, utilizando el console.warn podemos ver que valor se envia antes de ser enviado. Arriba del "debugger" se construye un objeto con el nombre de "newTweet" y este a su vez será un "spread operator" de value, donde se agregan componentes como el "uid", "email" & author, siendo este ultimo el "user.displayName". Por lo anterior, cuando se escriba un nuevo tweet este contenga al autor, email y uid. Al momento que se agregue un nuevo tweet desde la pagina/consola, se mostrará en la base de datos de firestore al autor, uid, email, etc. Debugger pasa a ser eliminado.
    function handleSubmit(e) {
        e.preventDefault()
        //Adding tweets
        const newTweet = {
            ...value,
            uid: user.uid,
            email: user.email,
            author: user.displayName,
        }
        // console.warn(value);
        console.warn(newTweet);
        // debugger;
        // const addTweet = fireStore.collection("tweets").add(value);
        const addTweet = fireStore.collection("tweets").add(newTweet);
        //obtenemos referencia del documento recien creado
        const getDoc = addTweet.then(doc => (doc.get()))
        //Getting tweets
        getDoc.then(doc => {
            const currentTweet = {
                tweet: doc.data().tweet,
                author: doc.data().author,
                id: doc.id
            };

            setData([currentTweet, ...data]);
        });

        setValue({ tweet: "", author: "" });
    }
//Debido al uso del "uid", el valor de author ya no es tan necesario, por lo que puede descartarse, al tenerse al usuario "logueado".
    return (
        <form className="tweet-form">
            <textarea
                name='tweet'
                value={tweet}
                onChange={handleInput}
            >
            </textarea>
            {/* <input
                name='author'
                placeholder='Author'
                value={author}
                onChange={handleInput}
            /> */}
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