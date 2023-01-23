# MeLody

An elegant AI that generates a chord progression/bassline based on a user-input melody.

## Inspiration
Music & Machine Learning. Our team has always been interested in music, from band practice to music theory class. This project gave us the opportunity to visualize patterns in classical piano music, with data from Bach, Mozart, Beethoven, and many other composers, which allowed us to create a program to predict the best chords for an unknown given melody - with a bit of a bias towards classical music.

We also all have some experience in machine learning, inside and outside of school, and we were interested in seeing if we could create a robust AI to help with music created in a short period of time.

## What it does
There are two parts to this project. The first part is a live connection to a piano where the user plays notes and is then deconstructed and displayed by a program as the notes are being played. The second part is a complex deep neural network that takes any melody that is input by the user on a physical keyboard (or virtual keyboard) and predicts a good chord/bassline to go with it. Our website also visualizes how the predicted chords go together with the melody you created!

## How we built it
The backend was done entirely in Python. We were able to read the keyboard input with PyPiano and use Numpy and PyTorch to convert audio to a more computer-readable format. The neural network was built from scratch with PyTorch and was tested with dropout, momentum, a dynamic learning rate, as well as with a few different optimizers such as Adam and SGD. The data came from a dataset called MAESTRO, which has over 200 hours of MIDI information on classical music. We were able to convert this to almost three million data points to be used in training and testing.

The frontend was done with React. On initial load, an AudioContext is created. When a note is played, an event is fired, and a note is played from the client speakers. The animations were done using a 2d physics engine called matter-js, as a note is played, the bar will grow horizontally, and when it is released the bar will fly upwards with an acceleration of ~9.8m/s^2. The audio is fetched from an open source database comprised of acoustic grand piano notes. The x-coordinate of the bar generated is a function of the note played.

## Challenges we ran into
One of the biggest challenges was being able to convert the piano input to computer-readable input. The YAMAHA keyboard we brought to use is at least **20 years old and does not have any MIDI capability**, so we had to program a script to read input sounds and convert them to MIDI. To do this we had to analyse the incoming signal and isolate the background noise to only analyse the actual signal content we were interested in. Once we have localised an interesting area, we performed a Fourier Analysis. Unfortunately, this was the point, where we found out about the harmonic octaves added to the signal by the piano without our knowledge. So instead of just taking the maximum, we had to identify the maximum high enough to not be noise and also the lowest frequency to be the base chord. Then finally, we could use the identified frequency and assign the MIDI code that can be used in further processing.

Another challenge we ran into was creating a server to connect our backend and frontend. Having almost completed all our parts, we struggled to combine them into one clean web app. Actually, as I am typing this, we are still struggling with this issue.

## Accomplishments that we're proud of
We’re proud of producing a solid training and test dataset from notes from 200 hours worth of piano music. Being able to distinguish the note through its digital values was rather difficult but very rewarding once completed. Furthermore, we are also proud of using this dataset to produce a model that produces a baseline for our application.

## What we learned
We learned that hurdles can come in all kinds of facets but can be overcome with great teamwork and problem-solving. The project was split into three components: the reading of the piano keys, the neural network portion, and the UI connection of everything. Many varying issues arose from all these components, such as the Fourier transform of the piano audio, sorting of note frequencies of the MAESTRO dataset, and dynamically reading the piano input into our UI. However, we as a team were able to resolve these issues in order to achieve our project goal, which is a feat to be proud of! 

## What's next for MeLody
The next steps for MeLody are to continually improve the UI, refine the dataset, and provide additional data visualization, as well as the possibility of adding more instruments. These changes will help improve the overall experience of using the tool as well as help its performance. The extra data visualization features will also provide key insight for both developer and user on how to use and improve the tool. In conclusion, we as a group created MeLody to be a fun and interesting project that we definitely look forward to developing further!
