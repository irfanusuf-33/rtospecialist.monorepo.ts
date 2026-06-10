interface ProductMainMenu {
  _id: string;
  name: string;
}

interface EcommerceSideLinksProps {
  productMainMenu: ProductMainMenu;
  isActive: boolean;
  onSelect: (_id: string) => void;
}

const getPackagePrefix = (name: string) => {
  const trimmedName = name.trim();
  const uppercasePrefix = trimmedName.match(/^[A-Z0-9]+/)?.[0];
  return uppercasePrefix || trimmedName.split(/\s+/)[0] || trimmedName;
};

export default function EcommerceSideLinks ({ productMainMenu, isActive, onSelect }: EcommerceSideLinksProps) {
  return (
    <label
      className={`flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left text-[14px] font-medium transition ${
        isActive
          ? "text-slate-950 dark:text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
      }`}
    >
      <input
        type="checkbox"
        checked={isActive}
        onChange={() => onSelect(productMainMenu._id)}
        className="h-4 w-4 rounded-[3px] border-2 border-slate-400 text-[#35b24a] focus:ring-[#35b24a] dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-[#35b24a]"
      />
      <span className="leading-none">{getPackagePrefix(productMainMenu.name)}</span>
    </label>
  );
}
