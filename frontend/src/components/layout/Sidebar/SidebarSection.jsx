import { SidebarItem } from "./SidebarItem";

export function SidebarSection({ title, items, selected, setSelected }) {
    return (
        <>
            <h1 className='font-bold text-black text-sm'>{title}</h1>
            <ul className='mt-2 flex flex-col gap-1'>
                {items.map((item) => {
                    return (
                        <SidebarItem key={item.item} item={item} selected={selected} setSelected={setSelected}/>
                    );
                })}
            </ul>
        </>
    );
}