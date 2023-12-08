"use client";
import {useQuery} from "@tanstack/react-query";
import {Command, CommandInput, CommandList} from "./command";
import {useState} from "react";
import axios from "axios";
import {Prisma, Subreddit} from "@prisma/client";

type Props = {};

function SearchBar({}: Props) {
  const [input, setInput] = useState("");
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];

      const {data} = await axios.get(`/api/search?q=${input}`);
      return data as Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      };
    },
    queryKey: ["search-query"],
    enabled: false,
  });
  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          
        </CommandList>
      ) : null}
    </Command>
  );
}

export default SearchBar;
