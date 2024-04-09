"use client";

import styles from './Wordle.module.scss';
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import axios, { AxiosError } from 'axios';
import Keyboard from '../Keyboard/Keyboard';
import WordleGrid from '../WordleGrid/WordleGrid';


export default function Wordle()
{
    const MAX_GUESSES = 6;
    const [wordLength, setWordLength] = useState<number>();
    const [checkingWord, setCheckingWord] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [hydrated, setHydrated] = useState(false);
    const [wordToGuess, setWordtoGuess] = useState("");
    const [open, setOpen] = useState(false);
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]); // Store previous guesses so we can't guess the same word twice
    const [tries, setTries] = useState(0);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [isWinner, setIsWinner] = useState(false);

    const modalTimer = (0.6 + (0.2 * wordToGuess.length));

    async function getWord(length: number)
    {
        setHydrated(false);
        setWordtoGuess("");
        try
        {
            const response = await axios.get(`/api/randomWord?length=${length}`, { withCredentials: true });
            setWordtoGuess(response.data.word);
            setHydrated(true);
        }
        catch (error)
        {
            if (error instanceof AxiosError)
            {
                if (error.response?.status === 401)
                {
                    console.error("Unauthorized");
                    setError("Please login with discord.");
                    setHydrated(true);
                    return;
                }
            }
            else
            {
                console.error("Error getting word:", error);
                setHydrated(true);
            }
        }
    }

    async function checkWord(word: string): Promise<boolean>
    {
        setCheckingWord(true);
        try
        {
            const response = await axios.get(`/api/checkWord?word=${word}`, { withCredentials: true });
            setCheckingWord(false);
            return response.data.wordExists;
        }
        catch (error)
        {
            setCheckingWord(false);
            return false;
        }
    }

    const selectWord = (length: number) =>
    {
        setWordLength(length);
        getWord(length);
    }

    let errorId: NodeJS.Timeout | null = null;
    const showError = (err: string) =>
    {
        if (errorId !== null)
        {
            clearTimeout(errorId);
        }
        setError(err);
        errorId = setTimeout(() => 
        {
            setError("");
        }, 2000);
    }


    useEffect(() =>
    {

        const handleKeyPress = (event: KeyboardEvent) =>
        {
            if (event.key === "Enter")
            {
                enter();
            }
            else if (event.key === "Backspace")
            {
                undo();
            }
            else
            {
                addLetter(event.key);
            }
        }
        if (hydrated)
        {
            window.addEventListener("keydown", handleKeyPress);
        }

        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isWinner, wordToGuess, currentGuess, hydrated]);

    const addLetter = (letter: string) =>
    {
        if (currentGuess.length >= wordToGuess.length)
        {
            return;
        }

        if (/^[a-zA-Z]$/.test(letter) === false)
        {
            showError("Invalid character");
            return;
        }
        setCurrentGuess(currentGuess + letter);
    }

    const enter = async () =>
    {
        if (isWinner || tries >= MAX_GUESSES) 
        {
            console.log("Resetting game");
            setWordLength(undefined);
            setOpen(false);
            setHydrated(false);
            setPreviousGuesses([]);
            setTries(0);
            setCurrentGuess("");
            setIsWinner(false);
            return;
        }

        if (currentGuess.length !== wordToGuess.length)
        {
            showError("Word is too short");
            return;
        }
        if (previousGuesses.includes(currentGuess))
        {
            showError("Already guessed");
            return;
        }

        if (await checkWord(currentGuess) === false)
        {
            showError("Invalid word");
            return;
        }

        if (currentGuess === wordToGuess)
        {
            console.log("Correct!");
            setPreviousGuesses([...previousGuesses, currentGuess]);
            setCurrentGuess("");
            setIsWinner(true);
            setTimeout(() => setOpen(true), modalTimer * 1000);
            return;
        }
        if (tries + 1 >= MAX_GUESSES)
        {
            console.log("Loser!");
            setTimeout(() => setOpen(true), modalTimer * 1000);
        }
        setTries(tries + 1);
        setPreviousGuesses([...previousGuesses, currentGuess]);
        setCurrentGuess("");
    }

    const undo = () => 
    {
        console.log("Undo");
        setCurrentGuess(currentGuess.slice(0, -1));
    }

    return (
        <div className={`${styles.wordle}`}>
            <div className={`${styles.wordleContainer}`}>
                {error && <div className={styles.error}>{error}</div>}
                {checkingWord && <div>Checking...</div>}
                {!error && !hydrated && !wordLength && (<div className={`${styles.wordle}`}>
                    <div className={`${styles.wordleContainer}`}>
                        {/* Other JSX content */}
                        <div>
                            <div className={styles.title}>Select a word length</div>
                            <button onClick={() => selectWord(4)} className={styles.lengthButton}>4</button>
                            <button onClick={() => selectWord(5)} className={styles.lengthButton}>5</button>
                            <button onClick={() => selectWord(6)} className={styles.lengthButton}>6</button>
                            <button onClick={() => selectWord(7)} className={styles.lengthButton}>7</button>
                            <button onClick={() => selectWord(8)} className={styles.lengthButton}>8</button>
                            <button onClick={() => selectWord(9)} className={styles.lengthButton}>9</button>
                            <button onClick={() => selectWord(10)} className={styles.lengthButton}>10</button>
                            {/* Add more buttons for different word lengths */}
                        </div>
                    </div>
                </div>)}
                {!hydrated && wordLength && <div>Loading...</div>}
                {hydrated && (
                    <>
                        <Transition.Root show={open} as={Fragment}>
                            <Dialog as="div" className="relative z-10 resultDialog" onClose={setOpen}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                                <div className={styles.result}>
                                                    {isWinner && "Winner! Press Enter to try again"}
                                                    {!isWinner && "Loser! The Word Was: " + wordToGuess + ". Press Enter to try again"}
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition.Root>
                        {wordToGuess && <WordleGrid
                            rows={MAX_GUESSES}
                            columns={wordToGuess.length}
                            previousGuesses={previousGuesses}
                            currentGuess={currentGuess}
                            wordToGuess={wordToGuess}
                            error={error === "" ? false : true} />}
                        {wordToGuess && <Keyboard
                            previousGuesses={previousGuesses}
                            wordToGuess={wordToGuess}
                            addLetter={addLetter}
                            enter={enter}
                            undo={undo} />}
                    </>
                )}
            </div>
        </div >
    )
}
