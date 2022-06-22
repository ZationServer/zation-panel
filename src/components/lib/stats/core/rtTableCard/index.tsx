/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, { useEffect, useState } from "react";
import RTCard, { RTCardHandle } from "../../../cards/rtCard";
import classes from "./index.module.css";
import MaterialTable, { Action, Column } from "@material-table/core";
import { tableTheme } from "./theme";
import { ThemeProvider } from "@mui/material";

interface RTTableCardProps<RowData extends object> {
  title?: string;
  tooltip?: string;
  columns: Column<RowData>[];
  fetchData: () => RowData[];
  interval?: number;
  actions?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
  onRowClick?: (event?: React.MouseEvent, rowData?: RowData) => void;
}

export default function RTTableCard<T extends object>({
  title,
  tooltip,
  columns,
  fetchData,
  interval = 1000,
  actions,
  onRowClick,
}: RTTableCardProps<T>) {
  const rtCardRef = React.useRef<RTCardHandle>(null);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    update(true);
  }, []);

  const update = (force?: boolean) => {
    const update = force || rtCardRef.current!.isRunning();
    if (!update) return;
    setData(fetchData());
  };

  useEffect(() => {
    const intervalTicker = setInterval(() => update(), interval);
    return () => clearInterval(intervalTicker);
  }, [interval]);

  return (
    <RTCard
      ref={rtCardRef}
      value={title}
      onRunningStateChange={(state) => state && update(true)}
      big
      flexibleHeight
      green
      valueInfoTooltip={tooltip}
    >
      <div className={classes.tableWrapper}>
        <ThemeProvider theme={tableTheme}>
          <MaterialTable
            actions={actions}
            columns={columns}
            data={data}
            onRowClick={onRowClick}
            options={{
              paging: false,
              toolbar: false,
              doubleHorizontalScroll: true,
              headerStyle: { backgroundColor: "rgba(0,0,0,0)" },
            }}
          />
        </ThemeProvider>
      </div>
    </RTCard>
  );
}
