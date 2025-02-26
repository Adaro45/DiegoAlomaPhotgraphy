import React from 'react';
import './styles/Contact.css';
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlinePhoneCallback } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { SiWhatsapp } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";
import Footer from "../Components/Footer";
const ContactPage = () => {
  return (
<>
<div className="contact-page">
      {/* Logo Section */}
      <div className="logo-container">
        <img src="/images/BlackLogo.png" alt="Photography Logo" className="brand-logo" />
      </div>

      {/* Contact Container */}
      <div className="contact-container">
        <h2 className="contact-title">Let's Create Magic Together</h2>
        
        <div className="contact-info">
          <div className="contact-item">
          <IoIosMail />
            <div>
              <h3>Email</h3>
              <p>alomadiego302@gmail.com</p>
            </div>
          </div>

          <div className="contact-item">
          <MdOutlinePhoneCallback />
            <div>
              <h3>Phone</h3>
              <p>+1 (862) 361 -8242</p>
            </div>
          </div>

          <div className="contact-item">
          <FaLocationDot />
            <div>
              <h3>Location</h3>
              <p>New Yersey, USA</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="social-links">
          <a href="https://www.instagram.com/diegoaloma_photos/" className="social-button instagram" target='_blank'>
          <FaInstagram />
            <span>@diegoaloma_photos</span>
          </a>
          
          <a href="https://wa.me/+18623618242" className="social-button whatsapp" target='_blank'>
          <SiWhatsapp />
            <span>Chat Directly</span>
          </a>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="cta-section">
        <h3 className="cta-text">Your Story Deserves to be Remembered</h3>
        <p className="cta-subtext">Let's capture moments that will become your legacy</p>
      </div>

      {/* Alternative Contact Form */}
      {/* <div className="contact-form">
        <h3>Or Send Me a Message</h3>
        <form>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <input type="text" placeholder="Subject" />
          <textarea placeholder="How can I help you?"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div> */}
    </div>
    <Footer/>
    </>
  );
};

export default ContactPage;