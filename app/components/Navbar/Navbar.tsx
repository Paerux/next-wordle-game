"use client";

import { useEffect, useState } from 'react'
import { Disclosure, Switch } from '@headlessui/react'
import Link from 'next/link';
import { useThemeContext } from '@/app/context/ThemeContext';
import styles from './Navbar.module.scss';

function classNames(...classes: string[])
{
    return classes.filter(Boolean).join(' ')
}

type NavbarProps = {
    loggedIn: boolean;
}
export default function Navbar({ loggedIn }: NavbarProps)
{
    const { theme, setTheme, loaded } = useThemeContext();
    const [enabled, setEnabled] = useState(false)
    const [toggleInteractable, setToggleInteractable] = useState(false);

    useEffect(() =>
    {
        if (loaded)
        {
            if (theme === "dark")
            {
                setEnabled(true);
            } else
            {
                setEnabled(false);

            }
            setToggleInteractable(true);
        }
    }, [loaded]);

    // This effect will run whenever `enabled` changes
    useEffect(() =>
    {
        // Ensure that the theme is not changed when it's already set
        if (toggleInteractable)
        {
            if (enabled)
            {
                setTheme("dark");
                document.body.classList.add('dark');
            } else
            {
                document.body.classList.remove('dark');
                setTheme("light");
            }
        }
    }, [toggleInteractable, enabled, setTheme]);


    return (
        <Disclosure as="nav" className={styles.nav}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0">
                            <Link href="http://www.paerux.com">
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">

                                <a href="https://hangman.paerux.com" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300">
                                    Hangman
                                </a>
                                <a href="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300">
                                    Wordle
                                </a>

                            </div>
                        </div>
                        <Switch.Group as="div" className="flex items-center ml-auto">
                            {!loggedIn && <Link href="/api/auth/login"> Login with Discord</Link>}
                            <Switch.Label as="span" className="ml-3 mr-3 text-sm">
                                <span className="font-medium text-white">Dark Mode</span>
                            </Switch.Label>
                            <Switch
                                disabled={!toggleInteractable}
                                checked={enabled}
                                onChange={setEnabled}
                                className={classNames(
                                    enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        enabled ? 'translate-x-5' : 'translate-x-0',
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                    )}
                                />
                            </Switch>

                        </Switch.Group>
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}


