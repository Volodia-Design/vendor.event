import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { FcFolder } from "react-icons/fc";
import { EllipsisVertical } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../components/ui/context-menu";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";

const mockData = [
  { id: 1, name: "Jane's birthday", created_at: "10/11/2024" },
  { id: 2, name: "John's wedding", created_at: "10/11/2024" },
  { id: 3, name: "Doe's graduation", created_at: "10/11/2024" },
  { id: 4, name: "Smith's anniversary", created_at: "10/11/2024" },
  { id: 5, name: "Brown's family reunion", created_at: "10/11/2024" },
  { id: 6, name: "Taylor's retirement party", created_at: "10/11/2024" },
  { id: 7, name: "Wilson's baby shower", created_at: "10/11/2024" },
  { id: 8, name: "Moore's housewarming", created_at: "10/11/2024" },
  { id: 9, name: "Anderson's engagement", created_at: "10/11/2024" },
  { id: 10, name: "Thomas's graduation", created_at: "10/11/2024" },
  { id: 11, name: "Jackson's birthday", created_at: "10/11/2024" },
  { id: 12, name: "White's wedding", created_at: "10/11/2024" },
  { id: 13, name: "Harris's anniversary", created_at: "10/11/2024" },
  { id: 14, name: "Martin's family reunion", created_at: "10/11/2024" },
  { id: 15, name: "Thompson's retirement party", created_at: "10/11/2024" },
];

export default function Drive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [data, setData] = useState([]);
  const buttonRef = useRef(null);
  const triggerRef = useRef(null);

  const getData = async () => {
    const res = await api.get("/api/v1/portfolio/folders");
    setData(res.data);
  };

  useEffect(() => {
    // getData()
  }, []);

  const handleSearch = () => {
    if (search) {
      setSearchParams({ query: search });
    } else {
      setSearchParams({});
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (triggerRef.current && buttonRef.current) {
      triggerRef.current.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: e.clientX,
          clientY: e.clientY + 14,
        })
      );
    }
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  const handleCopyLink = () => {
    console.log("Copy Link clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  return (
    <div className='flex flex-col gap-4 sm:gap-8'>
      <div className='flex-col sm:flex-row flex gap-4 sm:gap-6 justify-end items-end'>
        <div className='search-container w-full'>
          <input
            type='text'
            placeholder='Search'
            className='search-input h-[42px]'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button className='search-button duration-300' onClick={handleSearch}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='white'
              className='search-icon'
            >
              <path d='M21.71 20.29l-5.4-5.39a8 8 0 10-1.42 1.42l5.4 5.4a1 1 0 001.42-1.42zM10 16a6 6 0 110-12 6 6 0 010 12z' />
            </svg>
          </button>
        </div>

        <Button className='bg-secondary-700 hover:bg-secondary-800 !text-white rounded-lg px-6 py-2 text-text4Medium'>
          Create Folder
        </Button>
      </div>
      <div className='auto-grid'>
        {mockData.map((item) => (
          <ContextMenu key={item.id} modal={false}>
            <ContextMenuTrigger ref={triggerRef}>
              <div
                key={item.id}
                className='flex gap-4 border rounded-lg border-neutral-100 px-3 py-4 items-center justify-between'
              >
                <div className='flex gap-4 items-center'>
                  <FcFolder className='text-5xl' />
                  <div>
                    <div className='text-text4Medium text-primary2-500'>
                      {item.name}
                    </div>
                    <div className='text-text5 text-neutral-200'>
                      {item.created_at}
                    </div>
                  </div>
                </div>
                <Button
                  className='size-8 hover:bg-neutral-50 p-0'
                  onClick={handleButtonClick}
                  ref={buttonRef}
                >
                  <EllipsisVertical className='text-neutral-400 scale-125' />
                </Button>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleShare}>Share</ContextMenuItem>
              <ContextMenuItem onClick={handleCopyLink}>
                Copy Link
              </ContextMenuItem>
              <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
}
