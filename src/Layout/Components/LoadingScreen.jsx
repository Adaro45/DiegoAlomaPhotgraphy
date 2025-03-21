import "./styles/LoadingScreen.css"

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src="/images/BlackLogo.png" alt="Diego Aloma Photography" className="loading-logo" />
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
        <p className="loading-text">Capturing moments...</p>
      </div>
    </div>
  )
}

export default LoadingScreen

