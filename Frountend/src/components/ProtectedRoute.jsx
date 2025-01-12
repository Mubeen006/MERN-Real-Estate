import { useSelector } from "react-redux";
// outlet mean its child , useNaviage is hook , Navigata is component
import { Outlet, Navigate } from "react-router-dom";
const ProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/signup" />;
};

export default ProtectedRoute;
