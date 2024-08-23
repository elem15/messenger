import { ComponentPropsWithoutRef, ElementType } from 'react'

import s from './AvatarSmallView.module.scss'

import SmileImg from '../../assets/SmileImg.png'
import clsx from 'clsx'

export type AvatarProps<T extends ElementType = 'img'> = {
  width?: number
  height?: number
  avatarOwner?: string
} & ComponentPropsWithoutRef<T>

export const AvatarSmallView = ({
  avatarOwner,
  width = 36,
  height = 36,
  className,
}: AvatarProps) => {
  return (
    <img
      src={avatarOwner || SmileImg}
      width={width}
      height={height}
      alt="Owner's avatar"
      className={clsx(s.smallAvatar, className)}
    />
  )
}
