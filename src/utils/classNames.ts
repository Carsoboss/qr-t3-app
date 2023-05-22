// by tailwindcss docs for classNames by booleans
export default function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Example usage:

// className={({ selected }) =>
//   classNames(
//     selected
//       ? "border-indigo-600 text-indigo-600"
//       : "border-transparent text-gray-900",
//     "flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium"
//   )
// }

// {({ open }) => (
//   <>
//     <div className="relative flex">
//       <Popover.Button
//         className={classNames(
//           open
//             ? "border-indigo-600 text-indigo-600"
//             : "border-transparent text-gray-700 hover:text-gray-800",
//           "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
//         )}
//       >
//         {category.name}
//       </Popover.Button>
//     </div>
//   </>
// )}
