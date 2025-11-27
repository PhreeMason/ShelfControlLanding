"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopBooks } from "@/lib/actions/admin-analytics";
import { Book } from "lucide-react";
import Image from "next/image";

export function TopBooksChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["top-books"],
    queryFn: () => getTopBooks(10),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No book data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((book, index) => (
        <div
          key={book.book_id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="text-muted-foreground font-medium w-6 text-right">
            {index + 1}
          </span>

          <div className="relative w-10 h-[60px] flex-shrink-0 rounded overflow-hidden bg-muted">
            {book.cover_image_url ? (
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Book className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{book.title}</p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {book.deadline_count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
