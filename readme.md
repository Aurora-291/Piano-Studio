# Piano Studio

This project is a browser-based virtual piano application with recording capabilities, sound customization, and a built-in metronome. It's designed with a responsive layout and multiple themes for a personalized musical experience.

## Features

* **Playable Piano Keyboard:**  Use your computer keyboard (keys A-K for white keys, W, E, T, Y, U for black keys) or click/tap on the on-screen keys to play notes.
* **Sound Customization:** Adjust the master volume, reverb level, and choose from different instrument sounds (Grand Piano, Classic Organ, Synthesizer, Crystal Box).
* **Recording:** Record your piano performances, play them back, and save them as JSON files.
* **Metronome:** A built-in metronome with adjustable tempo (BPM) helps you keep time while playing.
* **Visualizer:** A real-time audio visualizer displays the sound waves of your playing.
* **Theming:** Choose from various themes (Timeless Classic, Electric Dreams, Vintage Soul, Midnight Blues) to customize the appearance of the piano studio.
* **Responsive Design:** The interface adapts to different screen sizes and orientations, offering a good experience on both desktop and mobile devices.  A prompt encourages users on mobile devices to switch to landscape mode for optimal use.
* **Lesson Section:**  A dedicated section is included for future development of interactive lessons, currently with placeholder content for scales, chords, and melodies.
* **Help Modal:** A simple modal provides basic instructions on how to use the application.


## Technologies Used

* **HTML:** Structures the webpage and its elements.
* **CSS:** Styles the appearance of the piano studio.
* **JavaScript:** Implements the piano functionality, sound generation, recording, metronome, visualizer, and other interactive features.
* **Web Audio API:**  Used for sound synthesis, effects processing (reverb), and audio analysis for the visualizer.


## How to Run

1. Save the provided `index.html`, `style.css`, and `script.js` files in the same directory.
2. Open `index.html` in a web browser.


## Code Structure

* **index.html:** Contains the HTML structure of the piano studio, including the keyboard, controls, visualizer, and lesson section.
* **style.css:** Defines the styling and layout of the application, including themes.
* **script.js:**  Contains the JavaScript code that powers the piano's functionality, including sound generation, event handling, recording, and more.


## Future Development

* **Interactive Lessons:**  Implement fully interactive lessons in the lesson section to guide users through learning scales, chords, and melodies.
* **More Instruments:** Add more instrument sounds and sound customization options.
* **MIDI Support:** Implement support for MIDI controllers for a more professional playing experience.
* **User Accounts and Saving:** Allow users to create accounts and save their recordings and progress online.
* **Music Sheet Display:**  Display music sheets alongside the keyboard.