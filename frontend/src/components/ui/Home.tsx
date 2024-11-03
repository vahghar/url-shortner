import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, X, Trash2, Plus, Menu } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import {Link} from "react-router-dom"

type ShortenedURL = {
  original: string
  shortened: string
}

type Toast = {
  title: string
  description: string
}

export default function Home() {
  const [urls, setUrls] = useState<ShortenedURL[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [urls])

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
        setUrls([...urls, { original: inputUrl, shortened: shortenedUrl }]);
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
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-gray-900 text-white`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">URL Shortener</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <Button variant="outline" className="mx-4 mb-4">
          <Plus className="mr-2 h-4 w-4" />
          New URL
        </Button>
        <ScrollArea className="flex-grow">
          {urls.map((url, index) => (
            <div key={index} className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
              <p className="text-sm truncate">{url.original}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark mode</span>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="flex items-center space-x-4">
            <Link to="/signup">
              <Button variant="ghost">Sign Up</Button>
            </Link>
            <Link to='/signin'>
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {urls.map((url, index) => (
              <div key={index} className={`mb-4 p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original URL:</p>
                    <p className="break-all mb-2">{url.original}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Shortened URL:</p>
                    <a href={url.shortened} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                      {url.shortened}
                    </a>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(url.shortened)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </main>
        <footer className="p-4 border-t dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              type="url"
              placeholder="Enter URL to shorten"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow dark:bg-gray-700 dark:text-white"
            />
            <Button type="submit" variant="default">
              Shorten
            </Button>
          </form>
        </footer>
      </div>
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
  )
}