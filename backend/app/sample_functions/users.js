export function createUsersArray() {
    return [
        {
            username: "Nightblade",
            email: "nightblade@example.com",
            password: "password",
            avatar: 'default.png'
        },
        {
            username: "Wildheart",
            email: "wildheart@example.com",
            password: "password",
            avatar: "default.png"
        },
        {
            username: "Ironclad",
            email: "ironclad@example.com",
            password: "password",
            avatar: "default.png"
        },
        {
            username: "Moonlance",
            email: "moonlance@example.com",
            password: "password",
            avatar: "default.png"
        },
        {
            username: "Stormbringer",
            email: "stormbringer@example.com",
            password: "password",
            avatar: "default.png"
        },
        // Add more users as needed
    ];
}

// Example usage
const users = createUsersArray();
console.log(users);
