'use client'

import React from 'react'

interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  // This component processes and renders the blog post content
  // For now, we'll render it as HTML, but in production you might want to use a markdown renderer
  // like react-markdown or a custom renderer

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-brand-600 prose-blockquote:bg-brand-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}