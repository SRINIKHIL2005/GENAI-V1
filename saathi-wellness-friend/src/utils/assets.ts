/**
 * Get the correct asset path for GitHub Pages deployment
 */
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

/**
 * Get the correct video path for GitHub Pages deployment
 */
export const getVideoPath = (filename: string): string => {
  return getAssetPath(`Videos/${filename}`);
};

/**
 * Get the correct public asset path for GitHub Pages deployment
 */
export const getPublicAssetPath = (filename: string): string => {
  return getAssetPath(filename);
};

/**
 * Get the correct CSS background image URL for GitHub Pages deployment
 */
export const getCSSBackgroundUrl = (path: string): string => {
  return `url('${getAssetPath(path)}')`;
};
