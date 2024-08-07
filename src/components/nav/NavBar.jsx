import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { iconList } from "./NavIcon";
import { useLocation, useNavigate } from "react-router-dom";
import diaryImg from "../../assets/images/diary.png";
import Logout from "../auth/Logout";
import img1 from "../../assets/images/img1.jpg";
import axiosInstance from "../../utils/axios-config";

const NavBar = ({ setState }) => {
  const [navbar, setNavbar] = useState(true);
  const [user, setUser] = useState({
    username: "",
    name: "",
    contact: "",
    diaryName: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const navBar = sessionStorage.getItem("navbar");
  console.log(navBar);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          console.log("로그아웃상태");
        } else {
          const res = await axiosInstance.get("/api/auth/profile");
          setUser(res.data);
        }
      } catch (error) {
        console.error(error.response ? error.response.data : "Error fetching profile");
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const hideNavbar = () => {
    setNavbar((prevState) => !prevState);
    setState((prevState) => !prevState);
  };

  useEffect(() => {
    const savedNavbarState = sessionStorage.getItem("navbar");
    if (savedNavbarState !== null) {
      setNavbar(savedNavbarState === "true");
    }
  }, []);

  // 상태가 변경될 때 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem("navbar", navbar);
  }, [navbar]);

  const toggleMenu = (menuName, path) => {
    if (path) {
      navigate(path);
    }
    sessionStorage.setItem("pathName", path);
    sessionStorage.setItem("name", menuName);
  };

  return (
    <div className={`nav-wrapper ${navbar ? "" : "hide"}`}>
      <div className="nav-header">
        <div className="profile-box">
          <div className="hide-btn" onClick={hideNavbar}>
            {navbar ? <ArrowBackIosNewIcon /> : <ArrowForwardIosOutlinedIcon />}
          </div>
          <div className="img-box">
            <div
              className="img"
              style={{
                backgroundImage: user.profileImage === "none" ? `url(${img1})` : `url(${user.profileImage})`,
              }}
            ></div>
          </div>
          <div className="text-box">
            <span>{user.diaryName}</span>
          </div>
        </div>
      </div>
      <div className="nav-menu">
        {iconList.map((menu) => (
          <ul
            key={menu.path}
            className={`menu-list ${location.pathname.includes(menu.path) ? "menu" : ""}`}
            onClick={() => toggleMenu(menu.name, menu.path)}
          >
            <li>
              <div className="icon" style={{ color: "#c69d33" }}>
                {menu.icon}
              </div>
              <div className="text">{menu.title}</div>
            </li>
          </ul>
        ))}
      </div>
      <div className="nav-footer">
        <Logout />
        <img src={diaryImg} alt="diary" />
      </div>
    </div>
  );
};

export default NavBar;
