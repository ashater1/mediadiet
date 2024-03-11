import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { Link, useFetcher } from "@remix-run/react";
import { useMemo } from "react";
import DataCell from "~/components/table/DataCell";
import {
  BookIcon,
  FavoriteHeart,
  MovieIcon,
  ReviewIcon,
  StarsDisplay,
  TvShowIcon,
} from "~/features/list/icons/icons";
import { UserData } from "~/routes/$username._index";
import { usePendingDeletions } from "../hooks/useGetPendingDeletions";
import { MediaType } from "../types";
import { ListOwnerContextType, useListOwnerContext } from "~/routes/$username";

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

  const { submit } = useFetcher();

  const onDeleteClick = () => {
    submit(
      { id: reviewId },
      { method: "post", action: `/list/${mediaType}/delete` }
    );
  };

  return (
    <Link to={`${reviewId}`} prefetch="intent" className="contents">
      <tr className={classNames(isBeingDeleted && "pulse opacity-25")}>
        {children}
      </tr>
    </Link>
  );
}

export function UserEntriesTable({ entries }: { entries: UserData }) {
  const { listOwner, isSelf } = useListOwnerContext();
  const columns: ColumnDef<UserData>[] = useMemo(
    () => [
      {
        accessorKey: "consumedDate",
        header: "Date",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center text-xs md:text-sm">
            {`${props.getValue()}`}
          </div>
        ),
      },
      {
        accessorKey: "mediaType",
        header: "Type",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() === "book" ? (
              <BookIcon />
            ) : props.getValue() === "movie" ? (
              <MovieIcon />
            ) : props.getValue() === "tv" ? (
              <TvShowIcon />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (props) => {
          const showDot =
            props.row.getValue("creators") && props.row.getValue("releaseYear");

          return (
            <div className="flex items-center gap-x-5">
              <div className="flex flex-shrink-0 items-center justify-center md:hidden">
                {props.row.getValue("mediaType") === "book" ? (
                  <BookIcon />
                ) : props.row.getValue("mediaType") === "movie" ? (
                  <MovieIcon />
                ) : props.row.getValue("mediaType") === "tv" ? (
                  <TvShowIcon />
                ) : null}
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-semibold line-clamp-2 md:text-sm">
                  {props.getValue() as string}
                </div>

                <div className="flex items-center gap-x-2">
                  <div className="mt-0.5 text-xs text-gray-500 line-clamp-2 md:text-xs">
                    {props.row.getValue("creators")}
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
      },
      {
        accessorKey: "releaseYear",
        header: "Year",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center text-sm">
            {`${props.getValue()}`}
          </div>
        ),
      },
      { accessorKey: "creators", header: "Creators" },
      {
        accessorKey: "stars",
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
      },
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "favorited",
        header: "Favorited",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() ? <FavoriteHeart isOn /> : null}
          </div>
        ),
      },
      {
        accessorKey: "hasReview",
        header: "Review",
        cell: (props) => (
          <div className="flex h-full w-full items-center justify-center">
            {props.getValue() ? <ReviewIcon isOn /> : null}
          </div>
        ),
      },
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
        creators: false,
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
