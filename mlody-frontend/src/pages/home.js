import KeyBoard from "../components/keyboard";
import Notegif from "../resources/notegif-slow-slow.gif"
import NotesAnimation from "../components/notes_animation"
import { useEffect, useState } from "react";

const Home = () => {
    const [notesToPlayArray, updateNotesToPlayArray] = useState(new Array());
    useEffect(() => {
        console.log('home rendered')
    }, [])
    return (
        <>
            <NotesAnimation
                notesToPlayArray = {notesToPlayArray}
                updateNotesToPlayArray = {updateNotesToPlayArray}
            />
            <div
                style = {{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    paddingTop: '5%',
                    top: '465px',
                    position: 'relative'
                }}
            >
                <img 
                    src = {Notegif}
                    style = {{
                        height: '50px',
                        margin: 'auto 0'
                    }}
                />
                <KeyBoard 
                    notesToPlayArray = {notesToPlayArray}
                    updateNotesToPlayArray = {updateNotesToPlayArray}
                />
                <img 
                    src = {Notegif}
                    style = {{
                        height: '50px',
                        margin: 'auto 0'
                    }}
                />
            </div>
        </>

    )
}

export default Home;