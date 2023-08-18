import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import CheckAttendanceForm from "../pages/CheckAttendance";
import { AuthContext } from "../context/AuthContext";
import CheckAttendance from "../pages/CheckAttendance";
import axios from "axios";

function Capture() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    console.log("imgSrc:", imgSrc); // Log the imgSrc when it changes
  }, [imgSrc]);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div className="container">
      {currentUser ? (
        <>
          <CheckAttendance imgSrc={imgSrc} />
          {imgSrc ? (
            <img src={imgSrc} alt="webcam" />
          ) : (
            <Webcam
              height={600}
              width={600}
              ref={webcamRef}
              className="center"
            />
          )}
          <div className="btn-container">
            {imgSrc ? (
              <button onClick={retake}>Retake photo</button>
            ) : (
              <button onClick={capture}>Capture photo</button>
            )}
          </div>
        </>
      ) : (
        <h2>Login to check in</h2>
      )}
    </div>
  );
}

export default Capture;
