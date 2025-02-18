import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"
import styles from './markdown-content.module.css'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn(styles.markdown, className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
