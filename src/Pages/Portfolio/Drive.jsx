import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { FcFolder } from "react-icons/fc";
import { EllipsisVertical, Plus } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../components/ui/context-menu";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { isValidEmail } from "../../utils";
import toast from "react-hot-toast";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

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
  const [emails, setEmails] = useState([""]);
  const buttonRefs = useRef([]);
  const triggerRefs = useRef([]);
  const [selectedFolderForDelete, setSelectedFolderForDelete] = useState(null);
  const [selectedFolderForShare, setSelectedFolderForShare] = useState(null);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName) {
      toast.error("Please enter a folder name");
      return;
    }
    try {
      await api.post("/folder", { name: folderName });
      toast.success("Folder created successfully");
      setFolderName("");
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleShare = async () => {
    if (!emails.every(isValidEmail)) {
      toast.error("Please enter valid email addresses");
      return;
    }
    try {
      // await api.post("/api/v1/portfolio/folders/share", {
      //   folder_id: selectedFolderForShare.id,
      //   emails,
      // });
      setSelectedFolderForShare(null);
      setEmails([""]);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const res = await api.get("/folder");
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = () => {
    if (search) {
      setSearchParams({ query: search });
    } else {
      setSearchParams({});
    }
  };

  // const handleButtonClick = (e) => {
  //   e.preventDefault();
  //   if (triggerRef.current && buttonRef.current) {
  //     triggerRef.current.dispatchEvent(
  //       new MouseEvent("contextmenu", {
  //         bubbles: true,
  //         clientX: e.clientX,
  //         clientY: e.clientY + 14,
  //       })
  //     );
  //   }
  // };

  const handleButtonClick = (e, index) => {
    e.preventDefault();
    if (triggerRefs.current[index] && buttonRefs.current[index]) {
      const buttonRect = buttonRefs.current[index].getBoundingClientRect();
      triggerRefs.current[index].dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: buttonRect.left,
          clientY: buttonRect.bottom + 5,
        })
      );
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/folder/${selectedFolderForDelete.id}`);
      toast.success("Folder deleted successfully");
      getData();
      setSelectedFolderForDelete(null);
    } catch (error) {
      console.log(error);
    }
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant='secondary' className='text-text4Medium'>
              Create Folder
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-xl max-w-[90%] px-12 py-8'>
            <DialogHeader>
              <DialogTitle className='!text-text2Medium text-primary2-500'>
                Folder Name
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className='hidden'>
              Share this folder with others by entering their email addresses
              below:
            </DialogDescription>
            <div className='flex flex-col gap-4 mt-2 mb-3'>
              <Input
                type='email'
                placeholder='Write email'
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogTrigger>
              <Button variant='secondary' onClick={handleCreateFolder}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className='auto-grid'>
        {mockData.map((item) => (
          <ContextMenu key={item.id} modal={false}>
            <ContextMenuTrigger
              ref={(el) => (triggerRefs.current[item.id] = el)}
            >
              <div
                key={item.id}
                className='flex gap-4 border rounded-lg border-neutral-100 px-3 py-4 items-center justify-between'
              >
                <div className='flex gap-4 items-center'>
                  <FcFolder className='text-5xl' />
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='text-text4Medium text-primary2-500 line-clamp-1'>
                            {item.name}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p> {item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className='text-text5 text-neutral-200'>
                      {item.created_at}
                    </div>
                  </div>
                </div>
                <Button
                  className='size-8 hover:bg-neutral-50 p-0'
                  onClick={(e) => handleButtonClick(e, item.id)}
                  ref={(el) => (buttonRefs.current[item.id] = el)}
                >
                  <EllipsisVertical className='text-neutral-400 scale-125' />
                </Button>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setSelectedFolderForShare(item)}>
                Share
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => navigator.clipboard.writeText(item.name)}
              >
                Copy Link
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setSelectedFolderForDelete(item)}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}

        <Dialog
          open={selectedFolderForShare}
          onOpenChange={(open) => {
            if (!open) setSelectedFolderForShare(null);
          }}
        >
          <DialogContent className='sm:max-w-xl max-w-[90%] px-12 py-8'>
            <DialogHeader>
              <DialogTitle className='!text-text2Medium text-primary2-500'>
                {`Share "${selectedFolderForShare?.name}" Folder`}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className='hidden'>
              Share this folder with others by entering their email addresses
              below:
            </DialogDescription>
            <div className='flex flex-col gap-4 mt-2 mb-3'>
              {emails.map((email, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='email'
                    placeholder='Write email'
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  <Button
                    onClick={() => setEmails([...emails, ""])}
                    variant='secondary'
                    size='icon'
                  >
                    <Plus className='scale-150' />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSelectedFolderForShare(null);
                    setEmails([""]);
                  }}
                >
                  Cancel
                </Button>
              </DialogTrigger>
              <Button variant='secondary' onClick={handleShare}>
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={selectedFolderForDelete}
          onOpenChange={(open) => {
            if (!open) setSelectedFolderForDelete(null);
          }}
        >
          <DialogContent className='sm:max-w-md max-w-[90%] px-12 py-8'>
            <DialogHeader>
              <DialogTitle className='!text-text2Medium text-primary2-500'>
                Are you sure?
              </DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-2 pt-2 pb-3'>
              <DialogDescription>
                Do you really want to delete?
              </DialogDescription>
              <p className='text-gray-600'>This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogTrigger>
              <Button variant='destructive' onClick={handleDelete}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
