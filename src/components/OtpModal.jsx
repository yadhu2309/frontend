import * as React from "react";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AppContext } from "../utils/AppContext";
import { useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';

import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function OtpModal({
  open,
  handleClose,
  email,
  handleOpen,
  setError,
}) {
  const { client, setAuthToken } = React.useContext(AppContext);
  const [sendOtpStatus, setSendOtpStatus] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  // configuration for the request, including headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      //   Authorization: `Bearer ${authToken}`,
    },
  };

  const [otp, setOtp] = React.useState("");
  const handleOtpSend = async () => {
    console.log("sending");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://3.24.168.183/user/send-otp/",
        {
          email: email,
        },
        config
      );
      console.log("data", response);
      if (response.status === 200) {
        console.log(response);
        setSuccessMessage("OTP sent to your email.");
        setSendOtpStatus(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
      setIsLoading(false);
    }
  };
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await client.post("/user/otp-login/", {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        console.log(response.data);

        localStorage.setItem("token", response.data.access);
        // localStorage.setItem('refresh', response.data.refresh)
        setAuthToken(response.data.access);
        // setRefreshToken(response.data.refresh)

        handleClose();
        navigate("/");
        setError("");
        setSendOtpStatus(false);
        setOtp("");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send Login. Please try again.");
      // setMessage('Failed to send OTP. Please try again.');
      handleClose();
    }
  };
  const handleCloseModal =()=>{
    setSuccessMessage('')
    setIsLoading(false)
    setSendOtpStatus(false)
    handleClose()
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            OTP LOGIN
          </Typography>
          {successMessage && (
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, color: "green" }}
            >
              {successMessage}
            </Typography>
          )}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {sendOtpStatus ? (
              <>
                <>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                    }}
                    // readOnly
                    style={{ width: "300px", marginRight: "10px" }}
                  />

                  <button
                    type="submit"
                    disabled={otp.length === 6 ? false : true}
                    onClick={handleOtpLogin}
                  >
                    Login
                  </button>
                </>
              </>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{ width: "100%" }}
                />

                <LoadingButton
                  style={{ marginTop: "10px" }}
                  onClick={handleOtpSend}
                  loading={isLoading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                >
                  Send OTP
                </LoadingButton>
                {/* <button onClick={handleOtpSend}>Send OTP</button> */}
              </>
            )}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
