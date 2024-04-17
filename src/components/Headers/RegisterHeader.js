//import { Container, Row, Col } from "reactstrap";
import React from "react";

const RegisterHeader = () => {
  return (
    <>
      <div
        className="header d-flex align-items-center"
        style={{
          minHeight: "350px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
      </div>
    </>
  );
};

export default RegisterHeader;
