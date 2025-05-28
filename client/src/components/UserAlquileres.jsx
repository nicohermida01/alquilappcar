import FieldCard from "./FieldCard"

function UserAlquileres() {
    const results = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Bab', email: 'bab@example.com' },
        { id: 4, name: 'Beb', email: 'beb@example.com' },
        { id: 4, name: 'Beb', email: 'beb@example.com' },
        { id: 4, name: 'Beb', email: 'beb@example.com' },
        { id: 4, name: 'Beb', email: 'beb@example.com' },
    ];

    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                {results.map(user => (
                <FieldCard field={user.id} value={user.name}/>
                ))}
            </ul>
        </div>
    )
}

export default UserAlquileres;
