import React, { useEffect, useState } from "react";
import { TableDataProps } from "../../../types/Tables/types";
import axios from "axios";
import { accessToken } from "../token";

interface TableProps {
  tableData: any[];
  columns: { key: string; name: string }[];
}


function TableData(props: TableProps) {
  const { tableData, columns } = props;
  const [data, setData] = useState<any>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let headers = {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       };
  //       const response = await axios.get(
  //         "http://localhost:8081/api/sensor_data/dmrData?startDate=2023-05-02&endDate=2023-04-27&type=yardConsumption",
  //         {
  //           headers: headers,
  //         }
  //       );
  //       setData(response.data);
  //       console.log("tabdata", response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <table>
      <thead>
        <tr>
          {columns.map(
            (column: {
              key: React.Key | null | undefined;
              name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
            }) => (
              <th key={column.key}>{column.name}</th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableData;
