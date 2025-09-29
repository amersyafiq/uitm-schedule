export function SidebarNotice({ text, type, isVisible, setIsVisible}) {
    return (
        <div className={`bg-blue-100 select-none shadow-sm p-3.5 rounded-sm relative transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <span className='bg-blue-300 px-3 py-0.5 rounded-sm text-sm text-white'>{type}</span>
            <svg onClick={() => { setIsVisible(false) }}
                className="w-2.5 h-2.5 absolute top-5 right-6 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <p className='leading-5 mt-2 '>{text}</p>
        </div>
    );
}