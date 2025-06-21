import { useState } from 'react';
import { createMeme } from '../utils/api';
import {
  UploadCloud,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function MemeForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const DEFAULT_IMAGE_URL = 'https://i.imgur.com/placeholder.png';

    const meme = {
      title,
      image_url: imageUrl.trim() || DEFAULT_IMAGE_URL,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    try {
      const result = await createMeme(meme);
      if (onCreated) onCreated(result);

      setTitle('');
      setImageUrl('');
      setTags('');
      window.scrollTo(0, 0);
      setStatus('success');
    } catch (error) {
      console.error('Meme upload failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 flex items-center justify-center gap-2">
          <UploadCloud className="text-blue-500" />
          Upload Your Meme
        </h2>

        {/* Title Field */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <label htmlFor="title" className="w-1/3 text-sm font-medium text-gray-900 dark:text-white">
            Meme Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. When Wi-Fi dies"
            className="w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 p-2.5 
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Image URL Field */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <label htmlFor="imageUrl" className="w-1/3 text-sm font-medium text-gray-900 dark:text-white">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://i.imgur.com/example.jpg"
            className="w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 p-2.5 
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* Tags Field */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <label htmlFor="tags" className="w-1/3 text-sm font-medium text-gray-900 dark:text-white">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="funny,tech,sarcasm"
            className="w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 p-2.5 
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                      focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                      dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Status Message */}
        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium pt-2">
            <CheckCircle className="w-5 h-5" />
            Meme uploaded successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium pt-2">
            <XCircle className="w-5 h-5" />
            Meme upload failed. Check the console for details.
          </div>
        )}
      </form>
    </div>
  );
}
