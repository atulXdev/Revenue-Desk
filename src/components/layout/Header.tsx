import { Bell } from "lucide-react"

type HeaderProp = {
    title: string
}

const Header = ({title}: HeaderProp) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

        <div className="flex items-center gap-5">
            <button className="relative text-gray-600 hover:text-blue-600">
                <Bell size={18} />
            </button>

            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    AS
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-800">Atul Singh</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header
