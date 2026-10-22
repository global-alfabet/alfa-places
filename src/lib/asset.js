// Address of a file in /public. Works whether the site runs at the domain root or under a sub-path (previews).
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
