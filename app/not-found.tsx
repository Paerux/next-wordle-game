import Link from "next/link"
import React from 'react'

export default function NotFound()
{
    return (
        <main className="text-center">
            <h2 className="text-3xl">There was a problem.</h2>
            <p>Page is not found.</p>
            <Link href="/">Homepage</Link>
        </main>
    )
}
