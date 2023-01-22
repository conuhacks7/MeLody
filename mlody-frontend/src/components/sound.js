import { Soundfont } from 'soundfont-player';
import { useEffect, useState } from 'react';

const SoundPlayback = (
    instrumentName,
    hostname,
    format,
    soundfont,
    audioContext,
    onLoad,
    render
) => {
    const [instrument, setInstrument] = useState();

    useEffect(() => {
        Soundfont.instrument(new AudioContext(), instrument).then(
            (grand_piano) => {
                setInstrument(grand_piano)
            }
        )
    }, [])

    return (
        <></>
    )
}

export default SoundPlayback;