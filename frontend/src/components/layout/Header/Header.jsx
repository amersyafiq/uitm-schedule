import { Link, useLocation } from "react-router";
import { formatPath, gettLastPath } from "../../../utils/path";
import { Fragment } from "react";

export function Header() {
    const location = useLocation();
    const path = formatPath(location.pathname)

    return (
        <header className= " w-full flex items-center justify-between">
            <div className="flex flex-col p-3">
                <h1 className="text-white font-bold text-lg">{gettLastPath(location.pathname)}</h1>
                <div className="flex items-center gap-2 text-xs bg-white py-0.5 px-2 pr-3 rounded-lg mt-0.5 w-fit">
                    <Link to="/" className="cursor-pointer">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd"/>
                        </svg>
                    </Link>
                    {path.map((p, index) => {
                        const fullPath = "/" + path.slice(0, index + 1).map(x => x.toLowerCase()).join("/");
                        return (
                            <Fragment key={p}>
                                <p className="select-none">/</p>
                                <Link to={fullPath}>{p}</Link>
                            </Fragment>
                        );
                    })}
                </div>
            </div>

        </header>
    );
}