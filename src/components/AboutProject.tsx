/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Courier_Prime } from 'next/font/google'
import Link from 'next/link';
const courierPrime = Courier_Prime({ weight: '400', style: 'normal', subsets: ['latin'] });

interface AboutProjectProps {
    className?: string;
    onClose: () => void;
}

const AboutProject: React.FC<AboutProjectProps> = ({ className, onClose }) => {
    return (
        <div className={`absolute z-20 top-0 bg-teal right-0 h-screen md:w-2/3 overflow-scroll ${className}`}>
            <div className="max-w-xl pl-10 py-10 text-darkBlue ">
                <button onClick={onClose} className='align-right justify-end text-right border p-2 px-4 rounded-lg border-darkBlue'>X</button>
                <h2 className={courierPrime.className + " text-3xl mt-4"}>About</h2>

                <p>This is a small app we built to help us experiment with inputs and outputs for Large Language models (LLMs). It allows you to preprocess content - either by redacting or reducing it - before copying it into an LLM.
                    <br />
                </p>

                <h2 className={courierPrime.className + " text-2xl mt-4"}>Problems</h2>
                <h3 className={courierPrime.className + ' font-semibold text-lg'}>Problem 1</h3>
                <p>It's very easy to share content with LLMs. This is great unless that content has sensitive data in it. As we talked about in <Link href="https://art-of-the-ai-prompt.com/protect-your-data" className='underline'>protect your data</Link> on The Art of the AI Prompt it's important to redact sensitive content. We wanted a quick redact tool that would allow us to preprocess our content before copying it into an LLM.</p><br />
                <h3 className={courierPrime.className + ' font-semibold text-lg'}>Problem 2</h3>
                <p>LLMs have both a token limit and - assuming you're using an API - a cost for any token sent to them.
                    <br /><br />
                    This annoying if you want to quickly summarise an article or PDF that is over the token limit.<br />
                </p>
                <h2 className={courierPrime.className + " text-2xl mt-4"}>Solution </h2>
                <p>We haven't yet seen a good solution for problem 1.</p><br />
                <p>For problem 2, the most popular solution to pop up over the past months is to use a vector database as an intermediary. This is what we've explored in <Link href="https://ai.torchbox.com/projects" className='underline'>Conversations with your Content</Link>.</p><br />

                <p>This makes a lot of sense for complex, or synthesised, data but it's also time consuming and expensive.</p>
                <br />
                <p>We were interested to see how much we could do on the cheap.</p>

                <h2 className={courierPrime.className + " text-2xl mt-4"}>Stemming</h2>
                <p>In the past computers had very little physical, or accessible, memory. There was a time where every character written to the machine had a cost. It's why systems like flight control systems have impenetrable code since it wad written in the most concise form possible.</p><br />
                <p>Stemming - where you cut out vowels, or cut off the end of vowels - was a solution used for early compression. This felt like it would be a good solution for preprocessing content for LLMs.
                    <br /><br />
                    tl;dr <br />
                    It wasn't!
                    <br /><br />
                    It turns out by stemming words we increase the number of tokens that are used, which was the opposite of what we wanted. Which is a shame because LLMs are great at understanding stemmed words.
                    <br /><br />
                    We've kept the ability to stem words in this app but <em className='i'>caveat emptor</em> that this will increase your costs if you use an API.
                </p>

                <h2 className={courierPrime.className + " text-2xl mt-4"}>Reduction</h2>

                <p>The other strategies were all more destructive. They involved deleting stop words, sentences, paragraphs, the beginning, end or middle of content. Our thought was that humans are quite repetitive when we write. Our early testing indicates this is true. LLMs are very good at taking this reduced content and understanding the meaning of it.</p>
                <br />
                <p>The great thing here is that removing words leads to a reduction in tokens.</p>
                <br />
                <p>In particular removing stop words, adjectives and adverbs seems to have the most utility. The effect on LLM comprehension appears to be minimal but it reduces the content by between 25 - 35%, which potentially has some very positive future benefits.</p>

            </div></div>
    )

}
export default AboutProject;