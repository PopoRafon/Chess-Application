import { Link } from 'react-router-dom';

export default function NavigationLink({ title, href, imagePrefix }) {
    return (
        <li>
            <Link
                to={href}
                className="nav-link"
            >
                <img
                    className="nav-link-image"
                    src={`/static/images/icons/navigation/${imagePrefix}_icon.png`}
                    alt={imagePrefix}
                />
                {title}
            </Link>
        </li>
    );
}