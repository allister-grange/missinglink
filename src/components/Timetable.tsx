import { Bus } from "@/types/BusTypes";
import React from "react";
import styles from "@/styles/Timetable.module.css";
import convertSecondsToMinutes from "@/helpers/convertSecondsToMinutes";
import { useTable, useSortBy } from "react-table";

interface TimetableProps {
  busDataToDisplay: Bus[];
}

interface DisplayBusData {
  delay: string;
  routeShortName: string;
  routeLongName: string;
}

export const Timetable: React.FC<TimetableProps> = ({ busDataToDisplay }) => {
  const data: DisplayBusData[] = React.useMemo(
    () =>
      busDataToDisplay.map((bus) => ({
        delay: convertSecondsToMinutes(bus.delay, true),
        routeLongName: bus.routeLongName,
        routeShortName: bus.routeShortName,
      })),
    [busDataToDisplay]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Bus Route Number",
        accessor: "routeShortName" as const,
      },
      {
        Header: "Bus Route Description",
        accessor: "routeLongName" as const,
      },
      {
        Header: "Delay",
        accessor: "delay" as const,
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ↓'
                          : ' ↑'
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
          rows.map((row, idx) => {
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
  );
};
