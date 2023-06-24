import { Service } from "@/types/ServiceTypes";
import React from "react";
import styles from "@/styles/Timetable.module.css";
import convertSecondsToMinutes from "@/helpers/convertors";
import { useTable, useSortBy, usePagination } from "react-table";

interface TimetableProps {
  serviceDataToDisplay: Service[];
}

interface DisplayServiceData {
  delay: string;
  routeShortName: string;
  routeLongName: string;
}

export const Timetable: React.FC<TimetableProps> = ({
  serviceDataToDisplay,
}) => {
  const data: DisplayServiceData[] = React.useMemo(
    () =>
      serviceDataToDisplay.map((service) => ({
        delay: convertSecondsToMinutes(service.delay, true),
        routeLongName: service.routeLongName,
        routeShortName: service.routeShortName,
      })),
    [serviceDataToDisplay]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Route Number",
        accessor: "routeShortName" as const,
      },
      {
        Header: "Route Description",
        accessor: "routeLongName" as const,
      },
      {
        Header: "Delay",
        accessor: "delay" as const,
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 15 } },
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <div className={styles.table_card}>
      <table {...getTableProps()} className={styles.timetable}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {
                        // Render the header
                        column.render("Header")
                      }
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ↓"
                            : " ↑"
                          : ""}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            page.map((row, idx) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, idx) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <div className={styles.pagination}>
        <div className={styles.pagination_button_container}>
          <button
            className={styles.pagination_button}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>
          <button
            className={styles.pagination_button}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          <button
            className={styles.pagination_button}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>
          <button
            className={styles.pagination_button}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          className={styles.pagination_page_select}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[15, 30, 45, 60].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
