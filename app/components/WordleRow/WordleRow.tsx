import React from 'react'
import styles from './WordleRow.module.scss'

type WordleRowProps = {
    word: string,
    length: number,
    filled: boolean,
    wordToGuess: string,
    bounce?: boolean
}

export default function WordleRow({ word, length, filled, wordToGuess, bounce }: WordleRowProps)
{
    return (
        <div className={`${styles.row}`}>
            {Array(length).fill(0).map((_, index) =>
            {
                const isMatch = word[index] === wordToGuess[index];
                const isIncluded = wordToGuess.includes(word[index]);

                let cellClass = "";

                if (isMatch)
                {
                    cellClass = styles.greenCell;
                }
                else if (isIncluded)
                {
                    cellClass = styles.yellowCell;
                }
                else
                {
                    cellClass = styles.greyCell;
                }

                cellClass = filled ? cellClass : styles.emptyCell;

                return (
                    <div className={`${cellClass} ${bounce ? styles.bounce : ""}`} key={index}>
                        {index < word.length ? word[index] : ""}
                    </div>
                );
            })}
        </div>
    )
}
