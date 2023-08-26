import Webcam from "react-webcam";

export default function TakePhoto({ webcamRef, imgSrc, setImgSrc, capture }) {
  return (
    <>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam
          mirrored={true}
          height={500}
          width={500}
          ref={webcamRef}
          className="center"
        />
      )}
      <div className="btn-container">
        {imgSrc ? (
          <button className="btn" onClick={() => setImgSrc(null)}>
            Retake photo
          </button>
        ) : (
          <button className="btn" onClick={capture}>
            Capture photo
          </button>
        )}
      </div>
    </>
  );
}
