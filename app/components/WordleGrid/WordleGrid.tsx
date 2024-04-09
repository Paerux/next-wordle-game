import React from 'react'
import styles from './WordleGrid.module.scss'
import WordleRow from '../WordleRow/WordleRow'

type WrodleGridProps = {
    rows: number,
    columns: number,
    previousGuesses: string[],
    currentGuess: string,
    wordToGuess: string,
    error?: boolean
}

export default function WordleGrid({ rows, columns, previousGuesses, currentGuess, wordToGuess, error }: WrodleGridProps)
{
    return (
        <div className={styles.grid}>
            {Array(rows).fill(0).map((_, index) =>
            {
                let filled = false;
                let word = "";
                if (index < previousGuesses.length)
                {
                    filled = true;
                    word = previousGuesses[index];
                } else if (index === previousGuesses.length)
                {
                    word = currentGuess;
                }
                const bounce = error && index === previousGuesses.length;
                return <WordleRow filled={filled} wordToGuess={wordToGuess} length={columns} word={word} key={index} bounce={bounce} />;
            })}
        </div>
    )
}
