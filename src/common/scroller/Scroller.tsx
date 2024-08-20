import { ReactNode } from 'react'

import * as ScrollArea from '@radix-ui/react-scroll-area'

import s from './Scroller.module.scss'
import clsx from 'clsx'

export type ScrollerOrientation = 'vertical' | 'horizontal'

export type ScrollerProps = Readonly<{
  orientation?: ScrollerOrientation
  children: ReactNode
  customHeight?: string
  customWidth?: string
  className?: string
}>

export const Scroller = (props: ScrollerProps) => {
  return (
    <ScrollArea.Root
      scrollHideDelay={100_000}
      className={clsx(s.scrollAreaRoot)}
      style={{
        height: props.customHeight,
        width: props.customWidth,
      }}
    >
      <ScrollArea.Viewport className={clsx(s.scrollAreaViewport, props.className)}>
        {props.children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={s.scrollAreaScrollbar} orientation="vertical">
        <ScrollArea.Thumb className={s.scrollAreaThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className={s.scrollAreaScrollbar} orientation="horizontal">
        <ScrollArea.Thumb className={s.scrollAreaThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={s.scrollAreaCorner} />
    </ScrollArea.Root>
  )
}
