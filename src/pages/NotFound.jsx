import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
    <div className="text-8xl font-bold text-white/5 mb-2">404</div>
    <h1 className="text-2xl font-bold mb-2 -mt-8">Page not found</h1>
    <p className="text-white/40 text-sm mb-8">
      The page you're looking for doesn't exist or was moved.
    </p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
