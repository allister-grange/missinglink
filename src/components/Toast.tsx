import React, { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  error?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ error }) => {
  const shownToast = useRef(false);

  if (error && !shownToast.current) {
    toast.error(
      "There's an error with either my API or Metlink's, please try again later",
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    shownToast.current = true;
  }

  return <ToastContainer limit={1} style={{ fontSize: "1.8rem" }} />;
};

export default Toast;
