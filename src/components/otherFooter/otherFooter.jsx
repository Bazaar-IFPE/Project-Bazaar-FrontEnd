import React from "react";
import { BsInstagram } from "react-icons/bs";

import "./otherFooter.css";
import LogoBranca from "../../assets/logo-laranja.png";

export default function Footer() {
  return (
    <div className="back-footer">
      <a
        href="https://www.instagram.com/bazaarofc/"
        target="_blank"
        rel="noreferrer"
      >
        <BsInstagram className="icon-insta" />
      </a>
      <p className="paragraph">
        Uma plataforma feita por alunos do <br />
        IFPE-CAMPUS JABOATÃO DOS GUARARAPES
      </p>
      <img
        src={LogoBranca}
        alt="logo branca do bazaar"
        className="logo-branca"
      />
    </div>
  );
}
