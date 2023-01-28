import wave
import sys
import numpy as np
import pyaudio
from contextlib import closing
from websocket import create_connection
from scipy.io.wavfile import read
import pylab
from scipy.signal import argrelmax
import struct

midi_values = {27.5: 21,
               29.13523509: 22,
               30.86770633: 23,
               32.70319566: 24,
               34.64782887: 25,
               36.70809599: 26,
               38.89087297: 27,
               41.20344461: 28,
               43.65352893: 29,
               46.24930284: 30,
               48.9994295: 31,
               51.9130872: 32,
               55: 33,
               58.27047019: 34,
               61.73541266: 35,
               65.40639133: 36,
               69.29565774: 37,
               73.41619198: 38,
               77.78174593: 39,
               82.40688923: 40,
               87.30705786: 41,
               92.49860568: 42,
               97.998859: 43,
               103.8261744: 44,
               110: 45,
               116.5409404: 46,
               123.4708253: 47,
               130.8127827: 48,
               138.5913155: 49,
               146.832384: 50,
               155.5634919: 51,
               164.8137785: 52,
               174.6141157: 53,
               184.9972114: 54,
               195.997718: 55,
               207.6523488: 56,
               220: 57,
               233.0818808: 58,
               246.9416506: 59,
               261.6255653: 60,
               277.182631: 61,
               293.6647679: 62,
               311.1269837: 63,
               329.6275569: 64,
               349.2282314: 65,
               369.9944227: 66,
               391.995436: 67,
               415.3046976: 68,
               440: 69,
               466.1637615: 70,
               493.8833013: 71,
               523.2511306: 72,
               554.365262: 73,
               587.3295358: 74,
               622.2539674: 75,
               659.2551138: 76,
               698.4564629: 77,
               739.9888454: 78,
               783.990872: 79,
               830.6093952: 80,
               880: 81,
               932.327523: 82,
               987.7666025: 83,
               1046.502261: 84,
               1108.730524: 85,
               1174.659072: 86,
               1244.507935: 87,
               1318.510228: 88,
               1396.912926: 89,
               1479.977691: 90,
               1567.981744: 91,
               1661.21879: 92,
               1760: 93,
               1864.655046: 94,
               1975.533205: 95,
               2093.004522: 96,
               2217.461048: 97,
               2349.318143: 98,
               2489.01587: 99,
               2637.020455: 100,
               2793.825851: 101,
               2959.955382: 102,
               3135.963488: 103,
               3322.437581: 104,
               3520: 105,
               3729.310092: 106,
               3951.06641: 107,
               4186.009045: 108}
unpacking = 'hhhh' * 512


def get_midi(freq):
    return midi_values[min(midi_values, key=lambda x: abs(x - freq))]


def read_inp(CHUNK, FORMAT, CHANNELS, RATE, RECORD_SECONDS):
    # Read input signal and save as WAV file
    melodie = list()
    with wave.open('output_a.wav', 'wb') as wf:
        with closing(create_connection("wss://socketsbay.com/wss/v2/2/11ddc86a34cc702f0ed2cf199513e3dd/")) as conn:
            p = pyaudio.PyAudio()
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(p.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True)
            print('Recording...')
            result = np.array([])
            noise = 1500
            batch = np.array([])
            cnt = 0
            play = False
            last = 0
            sent = -2
            length = 0
            for i in range(0, RATE // CHUNK * RECORD_SECONDS):
                temp = stream.read(CHUNK)
                wf.writeframes(temp)
                temp = np.asarray(struct.unpack(unpacking, temp))
                temp = temp[::2]
                temp[temp > 1750] = temp[temp > 1750] * 3
                if len(result) == 0:
                    result = temp
                else:
                    result = np.hstack((result, temp))
                if cnt < 6:
                    if len(batch) == 0:
                        batch = temp
                    else:
                        batch = np.hstack((batch, temp))
                    cnt += 1
                else:
                    batch = np.hstack((batch, temp))
                    for item in np.split(temp, 1):
                        if np.any(item > noise * 1.5):
                            spectrum = np.fft.fft(item)
                            frequencies = np.fft.fftfreq(len(spectrum), 1 / RATE)
                            useful = abs(frequencies) < 1000
                            useful = (frequencies > 0) * useful
                            spectrum = abs(spectrum[useful])
                            frequencies = frequencies[useful]
                            max_index = np.argmax(spectrum)
                            useful = spectrum > spectrum[max_index] * 0.2
                            useful = np.logical_not(useful)
                            spectrum[useful] = 0
                            maxs = argrelmax(spectrum, mode='wrap')
                            current = get_midi(frequencies[maxs[0][0]])
                            if current < 55:
                                continue
                            if play and current < last:
                                print("Frequency played: " + str(last))
                                length += 1
                            else:
                                length += 1
                                last = current
                                print("Frequency played: " + str(current))
                                if not current == sent:
                                    conn.send(str(current))
                                    sent = current
                            play = True
                        else:
                            if not last == 0:
                                melodie.append([last, length * CHUNK / RATE * 6])
                            print("No frequency played")
                            length = 0
                            if not sent == -1:
                                conn.send(str(-1))
                                sent = -1
                            play = False
                            last = 0
                        batch = np.array([])
                        cnt = 0
            print('Done')
            pylab.plot(np.array(range(0, len(result))), result)
            pylab.show()
            stream.close()
            print(melodie)
            p.terminate()
            print(noise)
        with closing(create_connection("wss://socketsbay.com/wss/v2/1/11ddc86a34cc702f0ed2cf199513e3dd/")) as conn:
            conn.send(str(melodie))


def analyze():
    RATE = 44100

    read_inp(1024, pyaudio.paInt16, 1 if sys.platform == 'darwin' else 2, RATE, 15)
    # Analyze input file

''' a = read('output.wav')
    signal = np.array(a[1], dtype=np.int16)
    #pylab.plot(np.array(range(0, len(signal))) / RATE, signal)
    #pylab.show()
    signal1 = signal[:, 0]
    signal2 = signal[:, 1]
    # Get the approximate intensity of the noise
    noise_approx1 = np.max(signal1[:int(RATE * 0.5)]) * 2
    noise_approx2 = np.max(signal2[:int(RATE * 0.5)]) * 2
    test_width = int(RATE / 100) * 2
    played = False
    notes = list()
    left = 0
    for i in range(0, len(signal1) // int(test_width)):
        sub = signal1[i * test_width: (i + 1) * test_width]
        if np.any(sub > noise_approx1):
            if not played:
                played = True
                left = i * test_width
        else:
            if played:
                played = False
                notes.append(signal1[left: (i + 1) * test_width])
                left = 0
    for item in notes:
        spectrum = np.fft.fft(item)
        frequencies = np.fft.fftfreq(len(spectrum), 1 / RATE)
        useful = abs(frequencies) < 1000
        useful = (frequencies > 0) * useful
        spectrum = abs(spectrum[useful])
        frequencies = frequencies[useful]
        max_index = np.argmax(spectrum)
        useful = spectrum > spectrum[max_index] * 0.2
        useful = np.logical_not(useful)
        spectrum[useful] = 0
        #pylab.plot(frequencies, spectrum)
        #pylab.show()
        maxs = argrelmax(spectrum)
        print("Frequency played: " + str(get_midi(frequencies[maxs[0][0]])))'''


analyze()