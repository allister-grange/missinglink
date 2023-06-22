import { Action } from "@/hooks/useServiceApi";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  error?: boolean;
  dispatch: React.Dispatch<Action>;
}

export const Toast: React.FC<ToastProps> = ({ error, dispatch }) => {
  if (error) {
    toast.info(
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
    dispatch({ type: "REJECTED", error: false });
  }

  return <ToastContainer limit={1} style={{ fontSize: "1.8rem" }} />;
};

export default Toast;
