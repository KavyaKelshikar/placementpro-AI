import { useEffect } from 'react';

function useDocumentTitle(title) {
  useEffect(() => {
    const defaultTitle = 'PlacementPro AI';
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
  }, [title]);
}

export default useDocumentTitle;
