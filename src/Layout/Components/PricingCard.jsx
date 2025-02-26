import React from "react";
import Button from "./Button"; 
import "./styles/Card.css";

const PricingCard = ({ title, price, description, features, buttonLabel }) => {
  return (
    <div className="pricing-card">
      <div className="card-header">
      <h2 className="card-title">{title}</h2>
      <span className="pricing">{price}</span>
      </div>
      <p className="card-description">{description}</p>
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="card-action">
        <Button text={buttonLabel} />
      </div>
    </div>
  );
};

export default PricingCard;
