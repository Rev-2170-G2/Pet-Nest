import React from 'react'
import { Link } from 'react-router-dom'
import "./NavBar.css";

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            PetNest
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Homepage
                </Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/events">
                  Events
                </Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/pets">
                  Pets
                </Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/join">
                  Join
                </Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar