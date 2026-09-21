import { ZAHRA_CHARACTER_IMAGES, ZahraCharacterImage } from "../data/zahraImages";

const STORAGE_PREFIX = "zahra_custom_img_";

type ImageChangeListener = () => void;

class ZahraImageManager {
  private listeners: ImageChangeListener[] = [];

  public getImageUrl(filenameOrId: string): string {
    const item = ZAHRA_CHARACTER_IMAGES.find(
      (img) => img.filename === filenameOrId || img.id === filenameOrId
    );

    const filename = item ? item.filename : filenameOrId;

    // Check localStorage first
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${filename}`);
      if (stored) {
        return stored;
      }
    } catch {
      // ignore
    }

    // Default public path
    return `/images/zahra/${filename}`;
  }

  public hasStoredImage(filename: string): boolean {
    try {
      return !!localStorage.getItem(`${STORAGE_PREFIX}${filename}`);
    } catch {
      return false;
    }
  }

  public saveImage(filename: string, dataUrl: string) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${filename}`, dataUrl);
      this.notify();
    } catch (e) {
      console.error("Failed to save image to localStorage:", e);
    }
  }

  public removeImage(filename: string) {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${filename}`);
      this.notify();
    } catch {
      // ignore
    }
  }

  public clearAllCustomImages() {
    try {
      ZAHRA_CHARACTER_IMAGES.forEach((img) => {
        localStorage.removeItem(`${STORAGE_PREFIX}${img.filename}`);
      });
      this.notify();
    } catch {
      // ignore
    }
  }

  public subscribe(listener: ImageChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const zahraImageManager = new ZahraImageManager();
