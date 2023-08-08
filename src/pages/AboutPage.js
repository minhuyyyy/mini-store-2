import React from 'react'
import 'materialize-css/dist/css/materialize.min.css'
import { Icon } from 'react-materialize'
import M from 'materialize-css'

export default function AboutPage() {
  // Initialize the collapsible component on page load
  React.useEffect(() => {
    const elems = document.querySelectorAll('.collapsible')
    const options = {}
    M.Collapsible.init(elems, options)
  }, [])

  return (
    <div className="center" style={{paddingTop:75, paddingBottom:375, color: 'black', backgroundColor: 'white'}}>
      <ul className="collapsible" data-collapsible="accordion">
        <li>
          <div className="collapsible-header" style={{color: 'black', backgroundColor: 'white'}}><Icon>info</Icon>About Us</div>
          <div className="collapsible-body" style={{color: 'black', backgroundColor: 'white'}}><span>We are a company that specializes in creating amazing web applications.</span></div>
        </li>
        <li>
          <div className="collapsible-header" style={{color: 'black', backgroundColor: 'white'}}><Icon>assignment</Icon>Our Mission</div>
          <div className="collapsible-body" style={{color: 'black', backgroundColor: 'white'}}><span>Our mission is to help businesses and individuals achieve their goals through technology.</span></div>
        </li>
        <li>
          <div className="collapsible-header" style={{color: 'black', backgroundColor: 'white'}}><Icon>people</Icon>Our Team</div>
          <div className="collapsible-body" style={{color: 'black', backgroundColor: 'white'}}><span>We have a team of experienced developers, designers, and project managers who work together to create top-notch web applications.</span></div>
        </li>
        <li>
          <div className="collapsible-header" style={{color: 'black', backgroundColor: 'white'}}><Icon>contact_mail</Icon>Contact Us</div>
          <div className="collapsible-body" style={{color: 'black', backgroundColor: 'white'}}>
            <ul>
              <li>Phone: 555-555-5555</li>
              <li>Email: unknown@companyplace.com</li>
              <li>Address: 1010 Side St, Unktnown</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  )
}