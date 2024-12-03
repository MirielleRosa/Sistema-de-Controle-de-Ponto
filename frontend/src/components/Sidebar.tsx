import React from "react";
import { Col } from "react-bootstrap";
import { CiLogin } from "react-icons/ci";
import { BsHouse } from "react-icons/bs";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();

    const handleLogout = () => {
        navigate("/");
    };

    const isDashboard = location.pathname === `/${userId}`;
    const isHistorico = location.pathname === `/history/${userId}`;

    return (
        <Col 
        className="bg-dark text-white d-flex flex-column justify-content-between"
        style={{ minHeight: '880px', height: '100vh' }}
        >
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <div className="mb-4">
                    <img
                        src="/img/imagem-perfil.png"
                        className="rounded-circle"
                        alt="Corretor"
                        width="75"
                        height="75"
                    />
                </div>
                <span className="text-center text-user-gray fw-bold">Usuário</span>
                <span className="text-center">#{userId}</span>
            </div>
            <ul className="nav flex-column mt-2">
                <li className="nav-item w-100">
                    <Link
                        to={`/${userId}`}
                        className={`nav-link text-white d-flex justify-content-center align-items-center w-100 ${
                            isDashboard ? "bg-dark-gradiant" : ""
                        }`}>
                        <BsHouse className="m-1 fs-4" />
                        <span className="d-none d-md-inline me-3">Home</span>
                    </Link>
                </li>
                <li className="nav-item w-100">
                    <Link
                        to={`/history/${userId}`}
                        className={`nav-link text-white d-flex justify-content-center align-items-center w-100 ${
                            isHistorico ? "bg-dark-gradiant" : ""
                        }`}>
                        <CiCalendar    className="m-1 fs-4" />
                        <span className="d-none d-md-inline">Histórico</span>
                    </Link>
                </li>
            </ul>
            <div className="d-flex justify-content-center mt-auto mb-3 w-100">
                <button
                    className="btn btn-link text-white d-flex justify-content-center align-items-center w-100 rounded-0"
                    onClick={handleLogout}>
                    <CiLogin className="m-2 fs-3" />
                </button>
            </div>
        </Col>
    );
};

export default Sidebar;
