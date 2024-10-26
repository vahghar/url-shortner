import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, ExternalLink, Sun, Moon, X, Trash2, User, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"

type ShortenedURL = {
  original: string
  shortened: string
}

type Toast = {
  title: string
  description: string
}

export default function Component() {
  const [urls, setUrls] = useState<ShortenedURL[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      try {
        const response = await axios.post('http://localhost:8000/', { url: inputUrl });
        if(response.data.exists){
          setToast({
            title: "URL Exists",
            description: "This URL has already been shortened.",
          });
          return;
        }
        const shortenedUrl = response.data.shortUrl;
        setUrls([{ original: inputUrl, shortened: shortenedUrl }, ...urls]);
        setInputUrl('');
        setToast({
          title: "URL Shortened",
          description: "Your shortened URL has been created.",
        });
      } catch (error) {
        console.error("Error shortening URL:", error);
        setToast({
          title: "Error",
          description: "There was an error shortening the URL.",
        });
      }
    }
  };

  const handleDelete = async (shortenedUrl: string) => {
    const urlObject = urls.find(url => url.shortened === shortenedUrl);

    if (!urlObject) {
      setToast({
        title: "Error",
        description: "URL not found.",
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/`, {
        data: { url: urlObject.original}
      });
      setUrls(urls.filter(url => url.shortened !== shortenedUrl));
      setToast({
        title: "URL Deleted",
        description: "The shortened URL has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting URL:", error);
      
      setToast({
        title: "Error",
        description: "There was an error deleting the URL.",
      });
    }
  };
  

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col w-1/5 bg-white dark:bg-gray-800 p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Shortened URLs</h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode" className="sr-only">
              Dark mode
            </Label>
            {darkMode ? (
              <Moon className="h-4 w-4 text-gray-400" />
            ) : (
              <Sun className="h-4 w-4 text-gray-600" />
            )}
          </div>
        </div>
        <ScrollArea className="flex-grow pr-4">
          {urls.map((url, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <a href={url.original} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                  {url.shortened}
                </a>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(url.shortened)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 break-all">{url.original}</p>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-8 relative">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className='cursor-pointer'>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Link className="mr-2 h-4 cursor-pointer w-4" />
                <span>My URLs</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <LogOut className="mr-2 h-4 cursor-pointer w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h1 className="text-4xl font-bold mb-8 dark:text-white">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="url"
              placeholder="Enter URL to shorten"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow dark:bg-gray-800 dark:text-white"
            />
            <Button type="submit" variant="default">
              <Link className="mr-2 h-4 w-4" />
              Shorten
            </Button>
          </div>
        </form>
        {toast && (
          <Alert className="fixed bottom-4 right-4 w-72 animate-in slide-in-from-right">
            <AlertTitle>{toast.title}</AlertTitle>
            <AlertDescription>{toast.description}</AlertDescription>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setToast(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}
      </div>
    </div>
  )
}