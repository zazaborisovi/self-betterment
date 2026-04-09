import {useState} from "react"
import { useUser } from "../contexts/userContext"

const Choices = () =>{
    const {setUserOptions} = useUser()
    const choiceArr = [
        {value: "Pushups" , type: "body"},
        {value: "Morning Jog" , type: "body"},
        {value: "Plank" , type: "body"},
        {value: "Read Book" , type: "mind"},
        {value: "Coding Sprint" , type: "mind"},
        {value: "Logic Puzzles" , type: "mind"},
        {value: "Meditation" , type: "soul"},
        {value: "Journal Entry" , type: "soul"},
        {value: "Digital Detox" , type: "soul"}
    ]

    const [selectedChoices, setSelectedChoices] = useState([])

    const handleChoice = (choiceVal) => {
        if(selectedChoices.includes(choiceVal)){
            setSelectedChoices(selectedChoices.filter(c => c !== choiceVal))
        }else{
            setSelectedChoices([...selectedChoices , choiceVal])
        }
    }

    const handleSubmit = async() =>{
        await setUserOptions(selectedChoices)
    }

    return(
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-300 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 mb-15 tracking-tight">
                    Select Ones You'd Like To Do Everyday
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
                    {choiceArr.map((choice , index) => {
                        const isSelected = selectedChoices.includes(choice.value);

                        return (
                            <div 
                                key={index} 
                                onClick={() => handleChoice(choice.value)}
                                className={`
                                    relative cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 ease-in-out
                                    bg-white dark:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1
                                    ${isSelected 
                                        ? 'ring-4 ring-purple-400 dark:ring-purple-500 shadow-purple-400/30 dark:shadow-purple-500/30 scale-105' 
                                        : 'ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
                                    }
                                `}
                            >
                                <input 
                                    type="checkbox" 
                                    value={choice.value}
                                    name={choice.type}
                                    className="hidden" 
                                    checked={isSelected}
                                    onChange={() => {}}
                                />
                                
                                <span className={`uppercase tracking-widest text-xs font-bold mb-2 ${isSelected ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {choice.type}
                                </span>
                                <span className={`text-xl font-bold text-center ${isSelected ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {choice.value}
                                </span>

                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-purple-500 dark:text-purple-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button 
                    onClick={handleSubmit}
                    className="px-8 py-4 rounded-xl text-white font-bold tracking-wide transition-all shadow-lg hover:shadow-purple-500/40 bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 hover:from-indigo-500 hover:via-purple-500 hover:to-blue-400 active:scale-95 text-lg"
                >
                    Submit Choices
                </button>
            </div>
        </div>
    )
}

export default Choices