import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Soundfont from 'soundfont-player';
import { useEffect, useState, useRef } from 'react';
import 'react-piano/dist/styles.css';
import './customPianoStyles.css';  // import a set of overrides
import keyMappings from '../resources/key_maps'
import { addNoteToSortedArray, removeNoteFromSortedArray } from '../helpers/helpers';


const KeyBoard = ({
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
  const audioContext = new AudioContext();
  const [pianoPlayer, setPianoPlayer] = useState()

  useEffect(() => {
      Soundfont.instrument(audioContext, instrument).then(
          (grand_piano) => {
              setPianoPlayer(grand_piano)
          }
      )
  }, [])

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
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}

            playNote={(midiNumber) => {
                console.log('playnote:', midiNumber)
                if (pianoPlayer && !disabled) {
                    console.log('playing', midiNumber)
                    pianoPlayer.play(midiNumber)
                    let newArr = addNoteToSortedArray(midiNumber, notesToPlayArray);
                    console.log('arr b4:', notesToPlayArray)
                    console.log('arr after:', newArr)
                    updateNotesToPlayArray([...newArr])
                } else if (disabled) {

                }
            }}
            stopNote={(midiNumber) => {
                // Stop playing a given note - see notes below
                console.log('stopping', midiNumber)
                let notesBeingPlayed = notesToPlayArray;
                updateNotesToPlayArray([...removeNoteFromSortedArray(midiNumber, notesBeingPlayed)]);
            }}
            className={"piano-container"}
            width={1000}
            keyboardShortcuts={keyboardShortcuts}
        />
    </div>
  );
}
export default KeyBoard;