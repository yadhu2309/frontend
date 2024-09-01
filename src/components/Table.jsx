import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UpdateModal from "./UpdateModal";
import DeleteConfirmModal from "./DeleteModal";

const convertToReadableFormat = (isoString) => {
  // Create a Date object from the ISO string
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date-time string");
  }

  // Extract the components
  const day = date.toLocaleString("en-US", { weekday: "short" }); // Thu
  const month = date.toLocaleString("en-US", { month: "short" }); // Aug
  const dayOfMonth = date.getDate().toString().padStart(2, "0"); // 29
  const year = date.getFullYear(); // 2024
  const time = date.toLocaleTimeString("en-US", { hour12: false }); // 10:37:30

  // Format as "Thu Aug 29 2024 10:37:30"
  return `${day} ${month} ${dayOfMonth} ${year} ${time}`;
};

export default function TableEvent({ rows }) {
    // modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // delete modal
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(rows[event]);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">
                {convertToReadableFormat(row.start)}
              </TableCell>

              <TableCell align="right">
                {convertToReadableFormat(row.end)}
              </TableCell>
              <TableCell align="right">
                <button
                  onClick={() => {
                    handleSelectEvent(index);
                    handleOpen(true)
                  }}
                >
                  Edit
                </button>
              </TableCell>
              <TableCell align="right">
                <button
                  onClick={() => {
                    handleSelectEvent(index);
                    handleModalOpen()
                  }}
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleClose={handleClose}
        open={open}
        setOpen={setOpen}
      />
      <DeleteConfirmModal
      selectedEvent={selectedEvent}
      setSelectedEvent={setSelectedEvent}
      handleClose={handleModalClose}
      open={modalOpen}
      setOpen={setModalOpen}
       />
    </TableContainer>
  );
}
