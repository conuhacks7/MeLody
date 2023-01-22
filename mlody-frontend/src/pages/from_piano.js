import ConnectedKeyBoard from "../components/connected-keyboard";
import Notegif from "../resources/notegif-slow-slow.gif"
import { useState } from "react";
import NotesAnimation from "../components/notes_animation";

const FromPiano = () => {
    const [notesToPlayArray, updateNotesToPlayArray] = useState(new Array());
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
                <ConnectedKeyBoard 
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
export default FromPiano;