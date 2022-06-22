/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import { createTheme } from "@mui/material";

export const tableTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          top: "-1rem !important",
          boxShadow: "none !important",
          backgroundColor: "transparent !important",
          backgroundImage: "none !important"
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "white !important",
          fontFamily: "NexaBold",
          fontSize: "0.95rem !important",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "rgba(43, 225, 98,1.0) !important",
          },
          "&:focus": {
            color: "rgba(43, 225, 98,1.0) !important",
          },
          "&.Mui-active": {
            color: "rgba(43, 225, 98,1.0) !important",
          },
        },
        icon: {
          color: "rgba(43, 225, 98,1.0) !important"
        }
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});
