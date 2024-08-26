import {useRef} from "react";

export const useGeneralInputRef = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectPhotoHandler = () => {
    inputRef && inputRef.current?.click()
  }

  return {
    inputRef,
    selectPhotoHandler,
  }
}