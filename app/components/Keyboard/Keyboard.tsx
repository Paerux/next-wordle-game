import React from 'react'
import styles from './Keyboard.module.scss'

const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

type KeyboardProps = {
    addLetter(letter: string): void,
    undo(): void,
    enter(): void,
    previousGuesses: string[]
    wordToGuess: string
}
export default function Keyboard(props: KeyboardProps)
{
    return (
        <div className={styles.keyboard}>
            {KEYS.map((key) =>
            {
                const isLetterInPreviousGuesses = props.previousGuesses.some(guess => guess.includes(key));
                const isLetterInWordToGuess = props.wordToGuess.includes(key);
                const isLetterInCorrectPosition = props.previousGuesses.some(guess => guess[props.wordToGuess.indexOf(key)] === key);

                let keyStyle = styles.key;

                if (isLetterInPreviousGuesses && !isLetterInWordToGuess)
                {
                    keyStyle = styles.greyKey;
                } else if (isLetterInPreviousGuesses && isLetterInWordToGuess && !isLetterInCorrectPosition)
                {
                    keyStyle = styles.yellowKey;
                } else if (isLetterInPreviousGuesses && isLetterInWordToGuess && isLetterInCorrectPosition)
                {
                    keyStyle = styles.greenKey;
                }

                return (
                    <button key={key}
                        className={keyStyle}
                        onClick={(e) => { e.currentTarget.blur(); props.addLetter(key) }}>
                        {key}
                    </button>
                )
            })}

            <button key="backspace"
                className={styles.key}
                onClick={(e) => { e.currentTarget.blur(); props.undo() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
                </svg>

            </button>

            <button key="enter"
                className={styles.key}
                onClick={(e) => { e.currentTarget.blur(); props.enter() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
        </div>
    )
}
