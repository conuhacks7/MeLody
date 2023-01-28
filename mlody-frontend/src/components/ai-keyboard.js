import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Soundfont from 'soundfont-player';
import { useEffect, useState, useRef } from 'react';
import 'react-piano/dist/styles.css';
import './customPianoStyles.css';  // import a set of overrides
import keyMappings from '../resources/key_maps'
import { addNoteToSortedArray, removeNoteFromSortedArray } from '../helpers/helpers';


const AIKeyboard = ({
    notesToPlayArray,
    updateNotesToPlayArray,
    disabled = false
}) => {

  const firstNote = MidiNumbers.fromNote('c2');
  const lastNote = MidiNumbers.fromNote('c6');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: keyMappings,
  });

  const instrument = 'acoustic_grand_piano';
  var audioContext = new AudioContext();
  const [pianoPlayer, setPianoPlayer] = useState()
  const [playbackData, setPlayBackData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [readyForNext, setReadyForNext] = useState(false);
  const [currentActiveNotes, setCurrentActiveNotes] = useState([0])
  const [displayString, setDisplayString] = useState('');
  const [playbackDataDuplicate, setPlayBackDataDuplicate] = useState();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  // websocket stuff
  
  const ws = useRef(null);
  const [isPaused, setPause] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket("wss://socketsbay.com/wss/v3/3/${process.env.REACT_APP_API_KEY_WEB_SOCKET}/");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
        wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    Soundfont.instrument(audioContext, instrument).then(
        (grand_piano) => {
            setPianoPlayer(grand_piano)
        }
    )
  }, [])

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = e => {
        if (isPaused) return;
        console.log(e)
        let data = JSON.parse(e?.data);
        setPlayBackData(data);
        setPlayBackDataDuplicate(data);
        setButtonDisabled(false);
    };
  }, [isPaused]);

  useEffect(() => {
    if (playbackData?.length === 0) return;
    if (!readyForNext) return;
    let copyPlayBack = playbackData;
    let firstIndex = copyPlayBack.shift();
    let listOfPromises = new Array();
    let listOfNotes = new Array();

    firstIndex.forEach(element => {
        if (element?.length > 1) {
            console.log(element[0])
            listOfNotes.push(element[0]);
            listOfPromises.push(
                new Promise((resolver, rejecter) => {
                    pianoPlayer.play(element[0])
                    setTimeout(() => {
                        resolver()
                    }, element[1]*1000)
                })
            )
        }
    }
    );
    Promise.all(listOfPromises).then((result) => {
        console.log('promises resolved')
        setPlayBackData([...copyPlayBack])
        setCurrentActiveNotes([...listOfNotes])
        setCurrentlyPlaying(false);
    });
  }, [playbackData, buttonDisabled, readyForNext])

  return (
    <div
        style = {{
            backgroundColor: 'rgb(20, 21, 31)',
            padding: '28px 0',
            width: '85%',
            margin: '0 auto',
            borderRadius: '44px',
            borderWidth: '8px',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.32)',
        }}
    >
        <div
            style = {{
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '13px',
                gap: '10px'
            }}
        >
            {!currentlyPlaying &&
                <button
                    onClick = {() => {
                        setDisplayString('none');
                        setReadyForNext(true);
                        setCurrentlyPlaying(true);
                    }}
                    disabled = {buttonDisabled}
                    style = {{
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'black',
                        backgroundColor: 'green',
                        borderColor: 'black',
                        borderWidth: '4px',
                        borderRadius: '8px',
                        display: displayString
                    }}
                >
                    { buttonDisabled ? 'WAITING' : 'READY'}
                </button>
            }
            { (playbackDataDuplicate && !currentlyPlaying) && 
                <button
                    onClick = {() => {
                        setPlayBackData([...playbackDataDuplicate])
                        setReadyForNext(true);
                        setDisplayString('');
                        setButtonDisabled(false);
                        setCurrentlyPlaying(true);
                    }}
                    disabled = {buttonDisabled}
                    style = {{
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'WHITE',
                        backgroundColor: 'RED',
                        borderColor: 'black',
                        borderWidth: '4px',
                        borderRadius: '8px',
                    }}
                >
                    REPLAY
                </button>
            }
        </div>
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}

            playNote={(midiNumber) => {
                console.log('note played')

            }}
            stopNote={(midiNumber) => {

            }}
            onPlayNoteInput = {(midiNumber, { prevActiveNotes }) => {
                console.log('prev', prevActiveNotes)
            }}
            activeNotes = {currentActiveNotes}
            className={"piano-container"}
            width={1000}
            // keyboardShortcuts={keyboardShortcuts}
        />
    </div>
  );
}
export default AIKeyboard;