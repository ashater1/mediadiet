import { Link } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useMemo } from "react";
import DataCell from "~/components/table/DataCell";
import {
  BookIcon,
  FavoriteHeart,
  MovieIcon,
  ReviewIcon,
  StarsDisplay,
  TvShowIcon,
} from "~/features/v2/list/icons/icons";
import { usePendingDeletions } from "../hooks/useGetPendingDeletions";
import { MediaType } from "@prisma/client";
import { FormattedReview } from "~/features/v2/list/entries.server";

function TableRow({
  isSelf,
  mediaType,
  reviewId,
  children,
}: React.HTMLProps<HTMLTableRowElement> & {
  isSelf: boolean;
  mediaType: MediaType;
  reviewId: string;
}) {
  const pendingDeletions = usePendingDeletions();
  const isBeingDeleted = pendingDeletions.includes(reviewId);

  return (
    <Link to={`${reviewId}`} prefetch="intent" className="contents">
      <tr className={classNames(isBeingDeleted && "pulse opacity-25")}>
        {children}
      </tr>
    </Link>
  );
}

const columnHelper = createColumnHelper<FormattedReview>();

export function UserEntriesTable({ entries }: { entries: FormattedReview[] }) {
  // const { listOwner, isSelf } = useListOwnerContext();
  let isSelf = true;
  let listOwner = {
    soderberghMode: false,
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("consumedDate", {
        id: "consumedDate",
        header: "Date",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center text-xs md:text-sm">
            {`${props.getValue()}`}
          </div>
        ),
      }),
      columnHelper.accessor("MediaItem.mediaType", {
        id: "mediaType",
        header: "Type",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() === "BOOK" ? (
              <BookIcon />
            ) : props.getValue() === "MOVIE" ? (
              <MovieIcon />
            ) : props.getValue() === "TV" ? (
              <TvShowIcon />
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor("MediaItem.title", {
        id: "title",
        header: "Title",
        cell: (props) => {
          return (
            <div className="flex items-center gap-x-5">
              <div className="flex flex-shrink-0 items-center justify-center md:hidden">
                {props.row.getValue("mediaType") === "BOOK" ? (
                  <BookIcon />
                ) : props.row.getValue("mediaType") === "MOVIE" ? (
                  <MovieIcon />
                ) : props.row.getValue("mediaType") === "TV" ? (
                  <TvShowIcon />
                ) : null}
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-semibold line-clamp-2 md:text-sm">
                  {props.getValue() as string}
                </div>

                <div className="flex items-center gap-x-2">
                  <div className="mt-0.5 text-xs text-gray-500 line-clamp-2 md:text-xs">
                    {props.row.getValue("creator")}
                  </div>
                </div>
              </div>

              <div className="ml-auto inline-flex flex-col flex-shrink-0 items-center gap-2 md:hidden">
                {typeof props.row.getValue("stars") === "number" && (
                  <div className="flex">
                    <StarsDisplay
                      size={5}
                      stars={props.row.getValue("stars")}
                    />
                  </div>
                )}
                <div className="ml-auto flex gap-2">
                  {props.row.getValue("hasReview") ? <ReviewIcon isOn /> : null}
                  {props.row.getValue("favorited") ? (
                    <FavoriteHeart isOn />
                  ) : null}
                </div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("MediaItem.releaseYear", {
        id: "releaseYear",
        header: "Year",
        cell: ({ getValue }) => (
          <div className="flex h-full w-full items-center justify-center text-sm">
            {`${getValue()}`}
          </div>
        ),
      }),
      columnHelper.accessor("MediaItem.creator", {
        id: "creator",
        header: "Creator",
      }),
      columnHelper.accessor("stars", {
        header: "Rating",
        cell: (props) => {
          const stars = props.getValue();
          if (typeof stars === "number") {
            return (
              <div className="flex items-center">
                <StarsDisplay stars={stars} />
              </div>
            );
          }
        },
      }),
      columnHelper.accessor("id", { header: "ID" }),
      columnHelper.accessor("favorited", {
        header: "Favorited",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() ? <FavoriteHeart isOn /> : null}
          </div>
        ),
      }),
      columnHelper.accessor("hasReview", {
        header: "Review",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() ? <ReviewIcon isOn /> : null}
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: entries as any,
    columns,
    groupedColumnMode: "remove",
    initialState: {
      columnVisibility: {
        stars: !listOwner.soderberghMode,
        creator: false,
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <table className="w-full" key="table">
      <thead className="sr-only md:not-sr-only">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  className={classNames(
                    header.id !== "title" ? "hidden md:table-cell" : null,
                    "px-3 py-1 text-sm"
                  )}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow
              isSelf={isSelf}
              mediaType={row.getValue("mediaType")}
              reviewId={row.getValue("id")}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <DataCell
                    className={
                      !["title", "consumedDate"].includes(cell.column.id)
                        ? "hidden md:table-cell"
                        : ""
                    }
                    {...{
                      key: cell.id,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </DataCell>
                );
              })}
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
}
