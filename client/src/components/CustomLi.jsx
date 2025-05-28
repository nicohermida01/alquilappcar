export default function CustomLi({ campo, value }) {
    return (
        <div>
            <li className="font-bold text-4xl">{campo}</li>
            <p>{value}</p>
        </div>
    )
}
