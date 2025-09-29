export function gettLastPath(pathname) {
    let name

    if (pathname === "/" || pathname === "/home" ) {
        name = "Home"
    } else if (pathname === "/course") {
        name = "Find Courses"
    } else if (pathname === "/generate") {
        name = "Generate Schedule"
    } else if (pathname === "/history") {
        name = "Schedule History"
    } else if (pathname === "/profile") {
        name = "User Profile"
    } else if (pathname === "/users") {
        name = "User Management"
    }

    return name.toUpperCase()
}

export function formatPath(pathname) {
    const path = pathname.split("/").filter(Boolean)
    return path.map(p => p.toUpperCase())
}