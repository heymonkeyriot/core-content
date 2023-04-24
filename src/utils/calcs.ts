import nlp from 'compromise';

export const transformations = [
    { name: 'Remove vowels', description: 'has had all vowels removed', func: removeVowels, isActive: false },
    { name: 'Remove even paras', description: 'has every second paragraph removed', func: removeEveryOtherParagraph, isActive: false },
    { name: 'Remove even sentences', description: 'has every second sentence removed', func: removeEveryOtherSentence, isActive: false },
    { name: 'Keep only verbs + nouns', description: 'has only verbs and nouns', func: filterVerbsAndNouns, isActive: false },
    { name: 'Cut end', description: 'has had 20% removed from the end', func: truncateFileContent, isActive: false },
    { name: 'Cut start', description: 'has had 20% removed from the start', func: removeCharsBeforeIndexFromEnd, isActive: false },
    { name: 'Cut middle', description: 'has had 20% removed from the middle', func: removeCharsBetweenIndices, isActive: false },
    { name: 'Splice words', description: 'has spliced the ends of letters by 25%', func: removeLettersFromEndOfWords, isActive: false },
];

type Transformation = {
    name: string;
    func: (fileContent: string) => string;
    isActive: boolean;
    description: string;
};

export function generateDescription(transformations: Transformation[]): string {
    const activeDescriptions = transformations
        .filter((t) => t.isActive)
        .map((t) => t.description);

    if (activeDescriptions.length === 0) {
        return "";
    }

    const descriptionText = activeDescriptions.join(', ');

    return `The below text: ${descriptionText}`;
}

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
    const paragraphs = fileContent.split(/(\n{1,})/);
    let result = '';

    for (let i = 0; i < paragraphs.length; i++) {
        // If the index is even, it's a paragraph; if odd, it's a gap
        if (i % 2 === 0) {
            if (i % 4 === 0) {
                result += paragraphs[i];
            }
        } else {
            result += paragraphs[i];
        }
    }

    return result;
}



export function filterVerbsAndNouns(fileContent: string): string {
    const doc = nlp(fileContent);
    const verbsAndNouns = doc.match('#Noun|#Verb');
    console.log(verbsAndNouns);
    return verbsAndNouns.out('text');
}

export function truncateFileContent(fileContent: string, maxLength: number = 30000): string {
    const length = fileContent.length;

    if (length > maxLength) {
        return fileContent.slice(0, maxLength);
    }

    const endIndex = Math.floor(length * 0.8);
    return fileContent.slice(0, endIndex);
}

export function removeCharsBeforeIndexFromEnd(fileContent: string, indexFromEnd: number = 30000): string {
    const length = fileContent.length;
    const endIndex = Math.max(length - indexFromEnd, 0);

    if (endIndex > 0) {
        return fileContent.slice(endIndex);
    }

    const startIndex = Math.floor(length * 0.2);
    return fileContent.slice(startIndex);
}

export function removeCharsBetweenIndices(fileContent: string, startIndex: number = 15000, endIndexFromEnd: number = 15000): string {
    const length = fileContent.length;
    const endIndex = Math.max(length - endIndexFromEnd, startIndex);

    if (startIndex < endIndex) {
        const firstPart = fileContent.slice(0, startIndex);
        const secondPart = fileContent.slice(endIndex);
        return firstPart + secondPart;
    }

    const relativeStartIndex = Math.floor(length * 0.4);
    const relativeEndIndex = Math.floor(length * 0.6);
    const firstPart = fileContent.slice(0, relativeStartIndex);
    const secondPart = fileContent.slice(relativeEndIndex);
    return firstPart + secondPart;
}


export function removeEveryOtherSentence(fileContent: string): string {
    const lines = fileContent.split('\n');
    const transformedLines = lines.map((line) => {
        const sentences = line.split(/([.?!])\s+/);
        let result = '';

        for (let i = 0; i < sentences.length - 1; i += 2) {
            result += sentences[i] + (sentences[i + 1] || '');
        }

        return result;
    });

    return transformedLines.join('\n');
}


export function removeLettersFromEndOfWords(fileContent: string): string {
    const lines = fileContent.split('\n');
    const transformedLines = lines.map((line) => {
        const words = line.split(/\s+/);
        const transformedWords = words.map((word) => {
            const lettersToRemove = Math.ceil(word.length * 0.25);
            const endIndex = word.length - lettersToRemove;
            return word.slice(0, endIndex);
        });
        return transformedWords.join(' ');
    });

    return transformedLines.join('\n');
}

