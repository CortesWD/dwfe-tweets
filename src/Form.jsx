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

const Form = ({
    data = [],
    setData,
    user,
}) => {

    const [value, handleInput, setValue] = useForm({ tweet: "" });
    const { tweet } = value;

    function handleSubmit(e) {
        e.preventDefault()
        //Adding tweets
        const newTweet = {
            ...value,
            uid: user.uid,
            email: user.email,
            author: user.displayName,
        }
        
        console.warn(newTweet);
        const addTweet = fireStore.collection("tweets").add(newTweet);
        //obtenemos referencia del documento recien creado
        const getDoc = addTweet.then(doc => (doc.get()))
        //Getting tweets
        getDoc.then(doc => {
            const currentTweet = {
                tweet: doc.data().tweet,
                author: doc.data().displayName,
                id: doc.id,
                uid: doc.data().uid,
                email: doc.data().email
            };
//En las dos lineas superiores se agregaron componentes para que el "currentTweet" tenga tanto uid como email y la información de Form sea "homogenea" a la de App.
            setData([currentTweet, ...data]);
        });
//En la linea superior se actualiza con "currentTweet" la base de datos, pero no es lo mismo que actualizar la aplicación como en "fireStore.collection". Es por lo anterior que se setea dos veces la base de datos, primero en la linea 41(colección) y depsues en la linea 54(setData).
        setValue({ tweet: "", author: "" });
    }

    return (
        <form className="tweet-form">
            <textarea
                name='tweet'
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