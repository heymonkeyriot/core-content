import nlp from 'compromise';

export const transformations = [
    { name: 'Remove vowels', func: removeVowels, isActive: false },
    { name: 'Remove even paras', func: removeEveryOtherParagraph, isActive: false },
    { name: 'Remove even sentences', func: removeEveryOtherSentence, isActive: false },
    { name: 'Keep only verbs + nouns', func: filterVerbsAndNouns, isActive: false },
    { name: 'Cut end', func: truncateFileContent, isActive: false },
    { name: 'Cut start', func: removeCharsBeforeIndexFromEnd, isActive: false },
    { name: 'Cut middle', func: removeCharsBetweenIndices, isActive: false },
    { name: 'Splice words', func: removeLettersFromEndOfWords, isActive: false },
];

export function removeVowels(fileContent: string): string {
    const vowels = 'aeiouAEIOU';
    let stringWithoutVowels = '';

    for (let i = 0; i < fileContent.length; i++) {
        if (!vowels.includes(fileContent[i])) {
            stringWithoutVowels += fileContent[i];
        }
    }

    return stringWithoutVowels;
}

export function removeEveryOtherParagraph(fileContent: string): string {
    const paragraphs = fileContent.split('\n');
    const filteredParagraphs = paragraphs.filter((_, index) => index % 2 === 0);
    return filteredParagraphs.join('\n');
}


export function filterVerbsAndNouns(fileContent: string): string {
    const doc = nlp(fileContent);
    const verbsAndNouns = doc.match('#Noun|#Verb');
    return verbsAndNouns.out('text');
}

export function truncateFileContent(fileContent: string, maxLength: number = 30000): string {
    return fileContent.slice(0, maxLength);
}

export function removeCharsBeforeIndexFromEnd(fileContent: string, indexFromEnd: number = 30000): string {
    const startIndex = Math.max(fileContent.length - indexFromEnd, 0);
    return fileContent.slice(startIndex);
}

export function removeCharsBetweenIndices(fileContent: string, startIndex: number = 15000, endIndexFromEnd: number = 15000): string {
    const firstPart = fileContent.slice(0, startIndex);
    const endIndex = Math.max(fileContent.length - endIndexFromEnd, startIndex);
    const secondPart = fileContent.slice(endIndex);
    return firstPart + secondPart;
}

export function removeEveryOtherSentence(fileContent: string): string {
    const sentences = fileContent.split(/([.?!])\s+/);
    let result = '';

    for (let i = 0; i < sentences.length - 1; i += 2) {
        result += sentences[i] + (sentences[i + 1] || '');
    }

    return result;
}

export function removeLettersFromEndOfWords(fileContent: string): string {
    const words = fileContent.split(/\s+/);
    const transformedWords = words.map((word) => {
        const lettersToRemove = Math.ceil(word.length * 0.25);
        const endIndex = word.length - lettersToRemove;
        return word.slice(0, endIndex);
    });
    return transformedWords.join(' ');
}

