import React from 'react'
import { OurCompanies } from './OurCompanies'
import heroImage from '../../assets/img/logo.jpeg'

export const Hero = () => {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="our-companies">
          <ul className="company-list">
            <li>
              <div className="company-item">
                <img 
                  className="company-logo"
                  src={heroImage} 
                  alt="company logo" 
                />
              </div>
            </li>
            {/* ... other list items */}
          </ul>
        </div>
      </div>
    </div>
  )
}
