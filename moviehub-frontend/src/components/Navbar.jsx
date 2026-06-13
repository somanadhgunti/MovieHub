import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (

        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 30px",
                borderBottom: "1px solid gray"
            }}
        >
            <h2>MovieHub</h2>

            <button onClick={handleLogout}>
                Logout
            </button>

        </nav>
    );
}

export default Navbar;