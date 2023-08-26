import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

export default function TableWorkshifts({ workshifts, onCheckIn, onCheckOut }) {
  const [checkOutTime, setCheckOutTime] = useState("0001-01-01T00:00:00");

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Worksheet ID</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Time</TableCell>
            <TableCell align="left">Check In</TableCell>
            <TableCell align="left  ">Check Out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workshifts.map((workshift) => {
            return (
              <TableRow key={workshift.id}>
                <TableCell component="th" scope="row">
                  {workshift.id}
                </TableCell>
                <TableCell align="left">
                  {workshift.startDate.split("T")[0]}
                </TableCell>
                <TableCell align="left">
                  {workshift.startDate.split("T")[1]}
                </TableCell>
                <TableCell align="left">
                  {workshift.checkinCheckout === null && (
                    <button
                      onClick={() => onCheckIn(workshift.id)}
                      className="btn"
                    >
                      Check In
                    </button>
                  )}
                  {workshift.checkinCheckout !== null && (
                    <>
                      You checked in at{" "}
                      {workshift.checkinCheckout.checkinTime.split("T")[1]}
                    </>
                  )}
                </TableCell>
                <TableCell align="left">
                  {workshift.checkinCheckout === null && <>Check In first</>}
                  {workshift.checkinCheckout !== null && (
                    <>
                      <button
                        onClick={() => onCheckOut(workshift.id)}
                        className="btn"
                        disabled={
                          workshift.checkinCheckout.checkoutTime !==
                            "0001-01-01T00:00:00" && true
                        }
                      >
                        Check Out
                      </button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
