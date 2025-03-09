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
import { useNavigate, useSearchParams } from "react-router-dom";
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
import Pagination from "../../components/Pagination";
import useLoading from "../../store/useLoading";

export default function Drive() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [data, setData] = useState([]);
  const [emails, setEmails] = useState([""]);
  const buttonRefs = useRef([]);
  const triggerRefs = useRef([]);
  const [selectedFolderForDelete, setSelectedFolderForDelete] = useState(null);
  const [selectedFolderForShare, setSelectedFolderForShare] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const { setIsLoading } = useLoading();
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const handleCreateFolder = async () => {
    if (!folderName) {
      toast.error("Please enter a folder name");
      return;
    }
    try {
      await api.post("/folder", { name: folderName });
      toast.success("Folder created successfully");
      setFolderName("");
      setIsCreateFolderOpen(false);
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
      await Promise.all(
        emails.map((email) =>
          api.post("/drive-invitation", {
            folderId: selectedFolderForShare.id,
            email,
          })
        )
      );

      setSelectedFolderForShare(null);
      setEmails([""]);
      toast.success("Invitations sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send some invitations");
    }
  };

  const getData = async () => {
    setIsLoading(true);
    const res = await api.get(
      `/folder?page=${paginationData.currentPage}&limit=${paginationData.pageSize}`
    );
    setPaginationData({
      ...paginationData,
      totalPages: res.data.data.total,
    });
    setData(res.data.data.data);
    setIsLoading(false);
  };

  const handlePageChange = (page) => {
    setPaginationData((prevData) => ({
      ...prevData,
      currentPage: page,
    }));
  };

  useEffect(() => {
    getData();
  }, [paginationData.currentPage]);

  const handleSearch = () => {
    if (search) {
      setSearchParams({ query: search });
    } else {
      setSearchParams({});
    }
  };

  const handleButtonClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
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

        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
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
              {/* <Input
                type='email'
                placeholder='Write email'
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              /> */}
              <Input
                type='text'
                placeholder='Folder Name'
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
    {data.length > 0 ? (
        <div className='auto-grid'>
        {data.map((item) => (
          <ContextMenu key={item.id} modal={false}>
            <ContextMenuTrigger
              ref={(el) => (triggerRefs.current[item.id] = el)}
              onClick={() => navigate(`/portfolio/drive/${item.id}`)}
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
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
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
              {/* <ContextMenuItem
                onClick={() => navigator.clipboard.writeText(item.name)}
              >
                Copy Link
              </ContextMenuItem> */}
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
    ) : (
      <div className="flex justify-center items-center h-72">
      <p className="text-text3Medium text-primary2-500">No folders found</p>
    </div>
    )}
      <div className='w-full flex justify-end'>
        <Pagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
