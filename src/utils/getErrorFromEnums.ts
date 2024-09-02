// Function to check if any enum key is a substring of the given string
export function containsEnumKey<T>(enumType: T, str: string) {
    const keys = Object.keys(enumType) as Array<keyof T>;
    const contraint = keys.find(key => str.includes(key as string));
    return contraint
}
