import { Link } from 'react-router';

export function SidebarItem({ item, selected, setSelected }) {
  const isActive = selected === item.item;

  return (
    <li>
      <Link
        to={item.path}
        onClick={() => setSelected(item.item)}
        className={`flex items-center px-4 py-2 rounded-lg hover:cursor-pointer ${isActive ? "bg-stone-600 text-white" : "hover:bg-gray-200 "}`}
      >
        {item.svg}
        <span className='font-light'>{item.item}</span>
      </Link>
    </li>
  );
}
