export const transformations = [
    {
        name: 'Remove vowels', description: 'has had all vowels removed', reduceTokens: false, func: removeVowels, isActive: false, img: {
            active: 'vowels-active.png',
            inactive: 'vowels-inactive.png',
        },
    },
    {
        name: 'Remove even paras', description: 'has every second paragraph removed', reduceTokens: true, func: removeEveryOtherParagraph, isActive: false, img: {
            active: 'paragraphs-active.png',
            inactive: 'paragraphs-inactive.png',
        },
    },
    {
        name: 'Remove even sentences', description: 'has every second sentence removed', reduceTokens: true, func: removeEveryOtherSentence, isActive: false, img: {
            active: 'sentence-active.png',
            inactive: 'sentence-inactive.png',
        },
    },
    {
        name: 'Remove stop words, adverbs + adjectives', description: 'has had stop-words, adjectives and adverbs removed', reduceTokens: true, func: filterVerbsAndNouns, isActive: false, img: {
            active: 'stop-words-active.png',
            inactive: 'stop-words-inactive.png',
        },
    },
    {
        name: 'Cut end', description: 'has had 20% removed from the end', reduceTokens: true, func: truncateFileContent, isActive: false, img: {
            active: 'end-active.png',
            inactive: 'end-inactive.png',
        },
    },
    {
        name: 'Cut start', description: 'has had 20% removed from the start', reduceTokens: true, func: removeCharsBeforeIndexFromEnd, isActive: false, img: {
            active: 'start-active.png',
            inactive: 'start-inactive.png',
        },
    },
    {
        name: 'Cut middle', description: 'has had 20% removed from the middle', reduceTokens: true, func: removeCharsBetweenIndices, isActive: false, img: {
            active: 'middle-active.png',
            inactive: 'middle-inactive.png',
        },
    },
    {
        name: 'Splice words', description: 'has spliced the ends of letters by 25%', reduceTokens: false, func: removeLettersFromEndOfWords, isActive: false, img: {
            active: 'word-active.png',
            inactive: 'word-inactive.png',
        },
    },
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
    // const doc = nlp(fileContent);

    // const verbsAndNouns = doc.match('#Noun|#Verb');
    // console.log(verbsAndNouns);
    // return verbsAndNouns.out('text');
    const lines = fileContent.split('\n');
    const filteredLines = lines.map(line => {
        const words = line.split(/\s+/);
        var filteredWords = words.filter((word) => !stopWordsList.includes(word.toLowerCase()));
        filteredWords = filteredWords.filter((word) => !adjectives.includes(word.toLowerCase()));
        filteredWords = filteredWords.filter((word) => !adverbs.includes(word.toLowerCase()));
        return filteredWords.join(" ");
    });
    return filteredLines.join("\n");
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

const stopWordsList = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take", "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"]

const adjectives = ["Aristotelian", "Arthurian", "Bohemian", "Brethren", "Mosaic", "Oceanic", "Proctor", "Terran", "Tudor", "abroad", "absorbing", "abstract", "academic", "accelerated", "accented", "accountant", "acquainted", "acute", "addicting", "addictive", "adjustable", "admired", "adult", "adverse", "advised", "aerosol", "afraid", "aggravated", "aggressive", "agreeable", "alienate", "aligned", "all-round", "alleged", "almond", "alright", "altruistic", "ambient", "ambivalent", "amiable", "amino", "amorphous", "amused", "anatomical", "ancestral", "angelic", "angrier", "answerable", "antiquarian", "antiretroviral", "appellate", "applicable", "apportioned", "approachable", "appropriated", "archer", "aroused", "arrested", "assertive", "assigned", "athletic", "atrocious", "attained", "authoritarian", "autobiographical", "avaricious", "avocado", "awake", "awesome", "backstage", "backwoods", "balding", "bandaged", "banded", "banned", "barreled", "battle", "beaten", "begotten", "beguiled", "bellied", "belted", "beneficent", "besieged", "betting", "big-money", "biggest", "biochemical", "bipolar", "blackened", "blame", "blessed", "blindfolded", "bloat", "blocked", "blooded", "blue-collar", "blushing", "boastful", "bolder", "bolstered", "bonnie", "bored", "boundary", "bounded", "bounding", "branched", "brawling", "brazen", "breeding", "bridged", "brimming", "brimstone", "broadest", "broiled", "broker", "bronze", "bruising", "buffy", "bullied", "bungling", "burial", "buttery", "candied", "canonical", "cantankerous", "cardinal", "carefree", "caretaker", "casual", "cathartic", "causal", "chapel", "characterized", "charcoal", "cheeky", "cherished", "chipotle", "chirping", "chivalrous", "circumstantial", "civic", "civil", "civilised", "clanking", "clapping", "claptrap", "classless", "cleansed", "cleric", "cloistered", "codified", "colloquial", "colour", "combat", "combined", "comely", "commissioned", "commonplace", "commuter", "commuting", "comparable", "complementary", "compromising", "conceding", "concentrated", "conceptual", "conditioned", "confederate", "confident", "confidential", "confining", "confuse", "congressional", "consequential", "conservative", "constituent", "contaminated", "contemporaneous", "contraceptive", "convertible", "convex", "cooked", "coronary", "corporatist", "correlated", "corroborated", "cosmic", "cover", "crash", "crypto", "culminate", "cushioned", "dandy", "dashing", "dazzled", "decreased", "decrepit", "dedicated", "defaced", "defective", "defenseless", "deluded", "deodorant", "departed", "depress", "designing", "despairing", "destitute", "detective", "determined", "devastating", "deviant", "devilish", "devoted", "diagonal", "dictated", "didactic", "differentiated", "diffused", "dirtier", "disabling", "disconnected", "discovered", "disdainful", "diseased", "disfigured", "disheartened", "disheveled", "disillusioned", "disparate", "dissident", "doable", "doctrinal", "doing", "dotted", "double-blind", "downbeat", "dozen", "draining", "draught", "dread", "dried", "dropped", "dulled", "duplicate", "eaten", "echoing", "economical", "elaborated", "elastic", "elective", "electoral", "elven", "embryo", "emerald", "emergency", "emissary", "emotional", "employed", "enamel", "encased", "encrusted", "endangered", "engraved", "engrossing", "enlarged", "enlisted", "enlivened", "ensconced", "entangled", "enthralling", "entire", "envious", "eradicated", "eroded", "esoteric", "essential", "evaporated", "ever-present", "evergreen", "everlasting", "exacting", "exasperated", "excess", "exciting", "executable", "existent", "exonerated", "exorbitant", "exponential", "export", "extraordinary", "exultant", "exulting", "facsimile", "fading", "fainter", "faith-based", "fallacious", "faltering", "famous", "fancier", "fast-growing", "fated", "favourable", "fearless", "feathered", "fellow", "fermented", "ferocious", "fiddling", "filling", "firmer", "fitted", "flammable", "flawed", "fledgling", "fleshy", "flexible", "flickering", "floral", "flowering", "flowing", "foggy", "folic", "foolhardy", "foolish", "footy", "forehand", "forked", "formative", "formulaic", "foul-mouthed", "fractional", "fragrant", "fraudulent", "freakish", "freckled", "freelance", "freight", "fresh", "fretted", "frugal", "fulfilling", "fuming", "funded", "funny", "garbled", "gathered", "geologic", "geometric", "gibberish", "gilded", "ginger", "glare", "glaring", "gleaming", "glorified", "glorious", "goalless", "gold-plated", "goody", "grammatical", "grande", "grateful", "gratuitous", "graven", "greener", "grinding", "grizzly", "groaning", "grudging", "guaranteed", "gusty", "half-breed", "hand-held", "handheld", "hands-off", "hard-pressed", "harlot", "healing", "healthier", "healthiest", "heart", "heart-shaped", "heathen", "hedonistic", "heralded", "herbal", "high-density", "high-performance", "high-res", "high-yield", "hissy", "hitless", "holiness", "homesick", "honorable", "hooded", "hopeless", "horrendous", "horrible", "hot-button", "huddled", "human", "humbling", "humid", "humiliating", "hypnotized", "idealistic", "idiosyncratic", "ignited", "illustrated", "illustrative", "imitated", "immense", "immersive", "immigrant", "immoral", "impassive", "impressionable", "improbable", "impulsive", "in-between", "in-flight", "inattentive", "inbound", "inbounds", "incalculable", "incomprehensible", "indefatigable", "indigo", "indiscriminate", "indomitable", "inert", "inflate", "inform", "inheriting", "injured", "injurious", "inking", "inoffensive", "insane", "insensible", "insidious", "insincere", "insistent", "insolent", "insufferable", "intemperate", "interdependent", "interesting", "interfering", "intern", "interpreted", "intersecting", "intolerable", "intolerant", "intuitive", "irresolute", "irritate", "jealous", "jerking", "joining", "joint", "journalistic", "joyful", "keyed", "knowing", "lacklustre", "laden", "lagging", "lamented", "laughable", "layered", "leather", "leathern", "leery", "left-footed", "legible", "leisure", "lessening", "liberating", "life-size", "lifted", "lightest", "limitless", "listening", "literary", "liver", "livid", "lobster", "locked", "long-held", "long-lasting", "long-running", "long-suffering", "loudest", "loveliest", "low-budget", "low-carb", "lowering", "lucid", "luckless", "lusty", "luxurious", "magazine", "maniac", "manmade", "maroon", "mastered", "mated", "material", "materialistic", "meaningful", "measuring", "mediaeval", "medical", "meditated", "medley", "melodic", "memorable", "memorial", "metabolic", "metallic", "metallurgical", "metering", "midair", "midterm", "midway", "mighty", "migrating", "mind-blowing", "mind-boggling", "minor", "mirrored", "misguided", "misshapen", "mitigated", "mixed", "modernized", "molecular", "monarch", "monastic", "morbid", "motley", "motorized", "mounted", "multi-million", "multidisciplinary", "muscled", "muscular", "muted", "mysterious", "mythic", "nail-biting", "natural", "nauseous", "negative", "networked", "neurological", "neutered", "newest", "night", "nitrous", "no-fly", "noncommercial", "nonsense", "north", "nuanced", "occurring", "offensive", "oldest", "oncoming", "one-eyed", "one-year", "onstage", "onward", "opaque", "open-ended", "operating", "opportunist", "opposing", "opt-in", "ordinate", "outdone", "outlaw", "outsized", "overboard", "overheated", "oversize", "overworked", "oyster", "paced", "panting", "paralyzed", "paramount", "parental", "parted", "partisan", "passive", "pastel", "patriot", "peacekeeping", "pedestrian", "peevish", "penal", "penned", "pensive", "perceptual", "perky", "permissible", "pernicious", "perpetuate", "perplexed", "pervasive", "petrochemical", "philosophical", "picturesque", "pillaged", "piped", "piquant", "pitching", "plausible", "pliable", "plumb", "politician", "polygamous", "poorest", "portmanteau", "posed", "positive", "possible", "postpartum", "prank", "pre-emptive", "precocious", "predicted", "premium", "preparatory", "prerequisite", "prescient", "preserved", "presidential", "pressed", "pressurized", "presumed", "prewar", "priced", "pricier", "primal", "primer", "primetime", "printed", "private", "problem", "procedural", "process", "prodigious", "professional", "programmed", "progressive", "prolific", "promising", "promulgated", "pronged", "proportionate", "protracted", "pulled", "pulsed", "purgatory", "quick", "rapid-fire", "raunchy", "razed", "reactive", "readable", "realizing", "recognised", "recovering", "recurrent", "recycled", "redeemable", "reflecting", "regal", "registering", "reliable", "reminiscent", "remorseless", "removable", "renewable", "repeating", "repellent", "reserve", "resigned", "respectful", "rested", "restrict", "resultant", "retaliatory", "retiring", "revelatory", "reverend", "reversing", "revolving", "ridiculous", "right-hand", "ringed", "risque", "robust", "roomful", "rotating", "roused", "rubber", "run-down", "running", "runtime", "rustling", "safest", "salient", "sanctioned", "saute", "saved", "scandalized", "scarlet", "scattering", "sceptical", "scheming", "scoundrel", "scratched", "scratchy", "scrolled", "seated", "second-best", "segregated", "self-taught", "semiautomatic", "senior", "sensed", "sentient", "sexier", "shadowy", "shaken", "shaker", "shameless", "shaped", "shiny", "shipped", "shivering", "shoestring", "short", "short-lived", "signed", "simplest", "simplistic", "sizable", "skeleton", "skinny", "skirting", "skyrocketed", "slamming", "slanting", "slapstick", "sleek", "sleepless", "sleepy", "slender", "slimmer", "smacking", "smokeless", "smothered", "smouldering", "snuff", "socialized", "solid-state", "sometime", "sought", "spanking", "sparing", "spattered", "specialized", "specific", "speedy", "spherical", "spiky", "spineless", "sprung", "squint", "stainless", "standing", "starlight", "startled", "stately", "statewide", "stereoscopic", "sticky", "stimulant", "stinky", "stoked", "stolen", "storied", "strained", "strapping", "strengthened", "stubborn", "stylized", "suave", "subjective", "subjugated", "subordinate", "succeeding", "suffering", "summary", "sunset", "sunshine", "supernatural", "supervisory", "supply-side", "surrogate", "suspended", "suspenseful", "swarthy", "sweating", "sweeping", "swinging", "swooning", "sympathize", "synchronized", "synonymous", "synthetic", "tailed", "tallest", "tangible", "tanked", "tarry", "technical", "tectonic", "telepathic", "tenderest", "territorial", "testimonial", "theistic", "thicker", "threatening", "tight-lipped", "timed", "timely", "timid", "torrent", "totalled", "tougher", "traditional", "transformed", "trapped", "traveled", "traverse", "treated", "trial", "trunk", "trusting", "trying", "twisted", "two-lane", "tyrannical", "unaided", "unassisted", "unassuming", "unattractive", "uncapped", "uncomfortable", "uncontrolled", "uncooked", "uncooperative", "underground", "undersea", "undisturbed", "unearthly", "uneasy", "unequal", "unfazed", "unfinished", "unforeseen", "unforgivable", "unidentified", "unimaginative", "uninspired", "unintended", "uninvited", "universal", "unmasked", "unorthodox", "unparalleled", "unpleasant", "unprincipled", "unread", "unreasonable", "unregulated", "unreliable", "unremitting", "unsafe", "unsanitary", "unsealed", "unsuccessful", "unsupervised", "untimely", "unwary", "unwrapped", "uppity", "upstart", "useless", "utter", "valiant", "valid", "valued", "vanilla", "vaulting", "vaunted", "veering", "vegetative", "vented", "verbal", "verifying", "veritable", "versed", "vinyl", "virgin", "visceral", "visual", "voluptuous", "walk-on", "wanton", "warlike", "washed", "waterproof", "waved", "weakest", "well-bred", "well-chosen", "well-informed", "wetting", "wheeled", "whirlwind", "widen", "widening", "willful", "willing", "winnable", "winningest", "wireless", "wistful", "woeful", "wooded", "woodland", "wordless", "workable", "worldly", "worldwide", "worst-case", "worsted", "worthless"]

const adverbs = ["abnormally", "absentmindedly", "accidentally", "acidly", "actually", "adventurously", "afterwards", "almost", "always", "angrily", "annually", "anxiously", "arrogantly", "awkwardly", "badly", "bashfully", "beautifully", "bitterly", "bleakly", "blindly", "blissfully", "boastfully", "boldly", "bravely", "briefly", "brightly", "briskly", "broadly", "busily", "calmly", "carefully", "carelessly", "cautiously", "certainly", "cheerfully", "clearly", "cleverly", "closely", "coaxingly", "colorfully", "commonly", "continually", "coolly", "correctly", "courageously", "crossly", "cruelly", "curiously", "daily", "daintily", "dearly", "deceivingly", "deeply", "defiantly", "deliberately", "delightfully", "diligently", "dimly", "doubtfully", "dreamily", "easily", "elegantly", "energetically", "enormously", "enthusiastically", "equally", "especially", "even", "evenly", "eventually", "exactly", "excitedly", "extremely", "fairly", "faithfully", "famously", "far", "fast", "fatally", "ferociously", "fervently", "fiercely", "fondly", "foolishly", "fortunately", "frankly", "frantically", "freely", "frenetically", "frightfully", "fully", "furiously", "generally", "generously", "gently", "gladly", "gleefully", "gracefully", "gratefully", "greatly", "greedily", "happily", "hastily", "healthily", "heavily", "helpfully", "helplessly", "highly", "honestly", "hopelessly", "hourly", "hungrily", "immediately", "innocently", "inquisitively", "instantly", "intensely", "intently", "interestingly", "inwardly", "irritably", "jaggedly", "jealously", "joshingly", "jovially", "joyfully", "joyously", "jubilantly", "judgementally", "justly", "keenly", "kiddingly", "kindheartedly", "kindly", "kissingly", "knavishly", "knottily", "knowingly", "knowledgeably", "kookily", "lazily", "less", "lightly", "likely", "limply", "lively", "loftily", "longingly", "loosely", "loudly", "lovingly", "loyally", "madly", "majestically", "meaningfully", "mechanically", "merrily", "miserably", "mockingly", "monthly", "more", "mortally", "mostly", "mysteriously", "naturally", "nearly", "neatly", "needily", "nervously", "never", "nicely", "noisily", "not", "obediently", "obnoxiously", "oddly", "offensively", "officially", "often", "only", "openly", "optimistically", "overconfidently", "owlishly", "painfully", "partially", "patiently", "perfectly", "physically", "playfully", "politely", "poorly", "positively", "potentially", "powerfully", "promptly", "properly", "punctually", "quaintly", "quarrelsomely", "queasily", "queerly", "questionably", "questioningly", "quicker", "quickly", "quietly", "quirkily", "quizzically", "rapidly", "rarely", "readily", "really", "reassuringly", "recklessly", "regularly", "reluctantly", "repeatedly", "reproachfully", "restfully", "righteously", "rightfully", "rigidly", "roughly", "rudely", "sadly", "safely", "scarcely", "scarily", "searchingly", "sedately", "seemingly", "seldom", "selfishly", "separately", "seriously", "shakily", "sharply", "sheepishly", "shrilly", "shyly", "silently", "sleepily", "slowly", "smoothly", "softly", "solemnly", "solidly", "sometimes", "soon", "speedily", "stealthily", "sternly", "strictly", "successfully", "suddenly", "surprisingly", "suspiciously", "sweetly", "swiftly", "sympathetically", "tenderly", "tensely", "terribly", "thankfully", "thoroughly", "thoughtfully", "tightly", "tomorrow", "too", "tremendously", "triumphantly", "truly", "truthfully", "ultimately", "unabashedly", "unaccountably", "unbearably", "unethically", "unexpectedly", "unfortunately", "unimpressively", "unnaturally", "unnecessarily", "upbeat", "upliftingly", "upright", "upside-down", "upward", "upwardly", "urgently", "usefully", "uselessly", "usually", "utterly", "vacantly", "vaguely", "vainly", "valiantly", "vastly", "verbally", "very", "viciously", "victoriously", "violently", "vivaciously", "voluntarily", "warmly", "weakly", "wearily", "well", "wetly", "wholly", "wildly", "willfully", "wisely", "woefully", "wonderfully", "worriedly", "wrongly", "yawningly", "yearly", "yearningly", "yesterday", "yieldingly", "youthfully"]