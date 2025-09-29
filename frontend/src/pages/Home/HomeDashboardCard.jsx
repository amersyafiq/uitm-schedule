export default function HomeDashboardCard({ bgColor, icon, value, label, labelColor, isLoading }) {
    return (
        <div className={`h-30 flex flex-1 rounded-xl overflow-hidden select-none ${bgColor}`}>
            <div className="relative h-full w-2/5">
                <img src={icon} alt={`${label} Icon`} className="opacity-35 h-28 absolute -bottom-2 -left-3" />
            </div>
            <div className="h-full flex-1 flex flex-col justify-center items-center mr-4">
                {isLoading ? (
                    <l-tailspin size="40" stroke="5" speed="0.9" color="white" />
                ) : (
                    <h1 className="text-white font-light text-4xl">{value}</h1>
                )}
                <p className={`font-bold text-center text-sm mt-2 leading-4 ${labelColor}`}>
                    {label}
                </p>
            </div>
        </div>
    );
}
