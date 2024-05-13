import type { RichTextElement } from '@payloadcms/richtext-slate'

import video from './video'

const elements: RichTextElement[] = [
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'link',
  video,
  'upload',
  'ul',
  'ol',
]

export default elements
