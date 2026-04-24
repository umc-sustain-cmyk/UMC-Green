import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const handleQuickLinkHover = (event, isHovering) => {
    event.currentTarget.style.color = isHovering ? 'white' : '#ccc';
    event.currentTarget.style.transform = isHovering ? 'translateX(4px)' : 'translateX(0)';
  };

  return (
    <footer style={{
      background: 'var(--dark-green)',
      color: 'white',
      padding: '2rem 0 1rem'
    }}>
      <div className="container">
        <div className="grid grid-3">
          {/* Company Info */}
          <div>
            <div className="flex gap-2 mb-3">
              <img src="/logo.png" alt="GreenMarket Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <h3 style={{ color: 'white', margin: 0 }}>GreenMarket</h3>
            </div>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              A campus donation and item-sharing platform connecting UMN Crookston 
              students and faculty to reduce waste and build community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
            <div className="flex-column gap-1">
              <a
                href="/"
                style={{ color: '#ccc', textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseOver={(event) => handleQuickLinkHover(event, true)}
                onMouseOut={(event) => handleQuickLinkHover(event, false)}
                onFocus={(event) => handleQuickLinkHover(event, true)}
                onBlur={(event) => handleQuickLinkHover(event, false)}
              >
                Home
              </a>
              <a
                href="/marketplace"
                style={{ color: '#ccc', textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseOver={(event) => handleQuickLinkHover(event, true)}
                onMouseOut={(event) => handleQuickLinkHover(event, false)}
                onFocus={(event) => handleQuickLinkHover(event, true)}
                onBlur={(event) => handleQuickLinkHover(event, false)}
              >
                Donations
              </a>
              <a
                href="/about"
                style={{ color: '#ccc', textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseOver={(event) => handleQuickLinkHover(event, true)}
                onMouseOut={(event) => handleQuickLinkHover(event, false)}
                onFocus={(event) => handleQuickLinkHover(event, true)}
                onBlur={(event) => handleQuickLinkHover(event, false)}
              >
                About Us
              </a>
              <a
                href="/contact"
                style={{ color: '#ccc', textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseOver={(event) => handleQuickLinkHover(event, true)}
                onMouseOut={(event) => handleQuickLinkHover(event, false)}
                onFocus={(event) => handleQuickLinkHover(event, true)}
                onBlur={(event) => handleQuickLinkHover(event, false)}
              >
                Contact
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact Us</h4>
            <div className="flex-column gap-2">
              <div className="flex gap-2">
                <Mail size={16} color="var(--accent-green)" />
                <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  greenmarket@crk.umn.edu
                </span>
              </div>
              <div className="flex gap-2">
                <Phone size={16} color="var(--accent-green)" />
                <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  UMN Crookston Campus
                </span>
              </div>
              <div className="flex gap-2">
                <MapPin size={16} color="var(--accent-green)" />
                <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  2900 University Ave, Crookston, MN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #4a7c4a',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
            © {new Date().getFullYear()} GreenMarket. All rights reserved. 
            Building a sustainable campus community. 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
