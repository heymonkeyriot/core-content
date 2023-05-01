import { useState } from 'react';
import { Courier_Prime } from 'next/font/google'
const courierPrime = Courier_Prime({ weight: '400', style: 'normal', subsets: ['latin'] });

export interface RedactRow {
    id: number;
    searchString: string;
    replaceString: string;
}

interface RedactRowsProps {
    onRedact: (text: string) => void;
    text: string;
}

const RedactRows: React.FC<RedactRowsProps> = ({ onRedact, text }) => {
    const [rows, setRows] = useState<RedactRow[]>([{ id: 0, searchString: '', replaceString: '' }]);
    const [replaceMessage, setReplaceMessage] = useState('');

    const handleChange = (index: number, field: 'searchString' | 'replaceString', value: string) => {
        const updatedRows = rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
        setRows(updatedRows);
    };

    const isSearchStringFound = (search: string, replace: string, text: string): boolean => {
        if (search === '' || replace === '') return false;

        const searchStringLowerCase = search.toLowerCase();
        const textLowerCase = text.toLowerCase();
        return textLowerCase.includes(searchStringLowerCase);
    };

    const searchInputStyle = (searchString: string, replaceString: string) =>
        isSearchStringFound(searchString, replaceString, text) ? '' : '';


    const handleRedact = (row: RedactRow) => {
        const occurrences = text.split(row.searchString).length - 1;
        const newText = text.split(row.searchString).join(row.replaceString);
        onRedact(newText);
        setRows([{ id: 0, searchString: '', replaceString: '' }]);
        setReplaceMessage(`'${row.searchString}' replaced ${occurrences} times by '${row.replaceString}'`);

        setTimeout(() => {
            setReplaceMessage('');
        }, 5000);
    };

    const handleButtonClick = (index: number) => {
        const row = rows[index];
        handleRedact(row);
    };

    return (
        <div className="mb-3 border-b border-teal pb-3">
            <h3 className={"text-lg tracking-wide mb-2 " + courierPrime.className}>Redact</h3>
            {rows.map((row, index) => (
                <div
                    key={row.id}
                    className="md:grid md:grid-cols-2 md:gap-1 mb-2 items-start"
                >
                    <input
                        type="text"
                        className={`${searchInputStyle(row.searchString, row.replaceString)
                            } border bg-darkBlue border-teal md:col-span-3`}
                        placeholder="Search"
                        value={row.searchString}
                        onChange={(e) => handleChange(index, "searchString", e.target.value)}
                    />
                    <input
                        type="text"
                        className="flex-1 border bg-darkBlue border-teal text-teal md:col-span-2"
                        placeholder="Replace"
                        value={row.replaceString}
                        onChange={(e) => handleChange(index, "replaceString", e.target.value)}
                    />
                    <button
                        onClick={() => handleButtonClick(index)}
                        disabled={!isSearchStringFound(row.searchString, row.replaceString, text)}
                        className={`w-10 p-2 border ${!isSearchStringFound(row.searchString, row.replaceString, text)
                                ? "bg-accent-400 text-accent-500 border-teal"
                                : "bg-teal border-teal text-darkBlue"
                            } md:col-span-1`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                            />
                        </svg>
                    </button>
                </div>
            ))}

            {replaceMessage && <p className="text-sm text-accent-600">{replaceMessage}</p>}
        </div>
    );
};

export default RedactRows;
