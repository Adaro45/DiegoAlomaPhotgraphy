"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Instagram, MessageSquare } from "lucide-react"
import "./styles/Contact.css"
import Footer from "../Components/Footer"
import Button from "../Components/Button"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      setIsSubmitting(false)
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <>
      <div className="contact-page">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/images/BlackLogo.png" alt="Diego Aloma Photography" className="contact-logo" />
          <h1 className="contact-title">Let's Create Magic Together</h1>
          <p className="contact-subtitle">
            I'd love to hear about your photography needs and how I can help capture your special moments
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info-container"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact-card">
              <h2 className="card-title">Get in Touch</h2>

              <div className="contact-info">
                <div className="contact-item">
                  <div className="icon-container">
                    <Mail size={20} />
                  </div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <a href="mailto:alomadiego302@gmail.com">alomadiego302@gmail.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="icon-container">
                    <Phone size={20} />
                  </div>
                  <div className="contact-details">
                    <h3>Phone</h3>
                    <a href="tel:+18623618242">+1 (862) 361-8242</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="icon-container">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-details">
                    <h3>Location</h3>
                    <p>New Jersey, USA</p>
                    <p className="text-sm">Available for travel worldwide</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <a
                  href="https://www.instagram.com/diegoaloma_photos/"
                  className="social-link instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={20} />
                  <span>@diegoaloma_photos</span>
                </a>

                <a
                  href="https://wa.me/+18623618242"
                  className="social-link whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare size={20} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="availability-card">
              <h3>Availability</h3>
              <p>Currently booking for 2025-2026 weddings and portrait sessions.</p>
              <p>Limited dates available for peak season (May-October).</p>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="form-card">
              <h2 className="card-title">Send a Message</h2>

              {formStatus === "success" ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <Button text="Send Another Message" onClick={() => setFormStatus(null)} variant="secondary" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Wedding Photography Inquiry"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell me about your event, date, location, and any specific requirements..."
                      rows="5"
                    ></textarea>
                  </div>

                  <Button
                    text={isSubmitting ? "Sending..." : "Send Message"}
                    variant="primary"
                    size="large"
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  />
                </form>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="cta-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="cta-title">Your Story Deserves to be Remembered</h2>
          <p className="cta-text">Let's capture moments that will become your legacy</p>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default ContactPage

