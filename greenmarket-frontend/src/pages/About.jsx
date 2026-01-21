import React from 'react';
import { Leaf, Users, Target, Award, Heart, Lightbulb } from 'lucide-react';

function About() {
  const team = [
    {
      name: 'Campus Team',
      role: 'Founders & Organizers',
      bio: 'Passionate students and faculty building a sustainable campus community',
      image: '👥'
    },
    {
      name: 'Student Leaders',
      role: 'Volunteers & Coordinators',
      bio: 'Dedicated to connecting the campus community through item sharing',
      image: '🎓'
    },
    {
      name: 'Faculty Advisors',
      role: 'Sustainability Champions',
      bio: 'Supporting environmental initiatives and campus engagement',
      image: '👨‍🎓'
    },
    {
      name: 'Community Members',
      role: 'Active Participants',
      bio: 'Donors and recipients making GreenMarket a thriving platform',
      image: '🤝'
    }
  ];

  const values = [
    {
      icon: <Leaf size={48} color="var(--accent-green)" />,
      title: 'Sustainability',
      description: 'Reduce waste and promote reuse within our campus community.'
    },
    {
      icon: <Users size={48} color="var(--accent-green)" />,
      title: 'Community First',
      description: 'We believe in the power of sharing and supporting each other.'
    },
    {
      icon: <Heart size={48} color="var(--accent-green)" />,
      title: 'Generosity',
      description: 'Helping students and faculty access items they need freely.'
    },
    {
      icon: <Lightbulb size={48} color="var(--accent-green)" />,
      title: 'Impact',
      description: 'Creating positive environmental and social change at UMN Crookston.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Items Available', icon: '📦' },
    { number: '100+', label: 'Active Donors', icon: '👥' },
    { number: '1,000+', label: 'Community Members', icon: '🌱' },
    { number: '50%', label: 'Waste Reduction', icon: '♻️' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-green), var(--light-green))',
        color: 'white',
        padding: '4rem 0'
      }}>
        <div className="container">
          <div className="text-center">
            <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.5rem' }}>
              About GreenMarket
            </h1>
            <p style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              GreenMarket is a campus donation platform where UMN Crookston students and faculty 
              can post extra items they no longer need. Other community members can browse, reserve items, 
              and contact donors to arrange pickup—reducing waste and building community connections.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <div className="flex gap-2 mb-3">
                <Target size={32} color="var(--primary-green)" />
                <h2>Our Mission</h2>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                GreenMarket provides a simple, centralized platform for our campus community to 
                reduce waste and help each other. Students and faculty can post items they no longer 
                need as donations, and community members can browse available items, reserve what they 
                need, and contact donors for convenient pickup arrangements.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-light)' }}>
                By using GreenMarket, you're making a real environmental impact—extending the life of 
                items that might otherwise end up in landfills, while strengthening connections within 
                our UMN Crookston community. It's a win-win for people and the planet.
              </p>
            </div>
            <div style={{ textAlign: 'center', fontSize: '12rem' }}>
              🌍
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Our Core Values</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              How we create impact on campus
            </p>
          </div>
          
          <div className="grid grid-2">
            {values.map((value, index) => (
              <div key={index} className="card">
                <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '0.5rem' }}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 1rem 0' }}>{value.title}</h3>
                    <p style={{ color: 'var(--text-light)', margin: 0, lineHeight: '1.6' }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Our Community Impact</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              The difference we're making together at UMN Crookston
            </p>
          </div>

          <div className="grid grid-4">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {stat.icon}
                </div>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: 'var(--primary-green)',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Community Members</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              The students and faculty making GreenMarket work
            </p>
          </div>

          <div className="grid grid-4">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  {member.image}
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{member.name}</h3>
                <div className="badge badge-success mb-2">{member.role}</div>
                <p style={{ 
                  color: 'var(--text-light)', 
                  fontSize: '0.9rem',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Our Journey</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              From idea to impact - how GreenMarket came to life
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card text-center">
              <div className="flex-center" style={{
                width: '60px',
                height: '60px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                2023
              </div>
              <h3>The Beginning</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Founded to promote sustainability and community giving across campus through item reuse.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex-center" style={{
                width: '60px',
                height: '60px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                2024
              </div>
              <h3>Growing Community</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Reached 1,000 active users and partnered with 100+ local sustainable 
                businesses across 10 states.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex-center" style={{
                width: '60px',
                height: '60px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
              2025
              </div>
              <h3>Expanding Impact</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Launching in 25 states with enhanced features for carbon tracking 
                and community rewards programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <Award size={48} color="var(--primary-green)" style={{ margin: '0 auto 1rem' }} />
            <h2>Recognition & Awards</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              Honored to be recognized for our environmental and social impact
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h4>Best Green Startup 2024</h4>
              <p style={{ color: 'var(--text-light)' }}>
                Sustainable Business Awards
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
              <h4>Community Choice Award</h4>
              <p style={{ color: 'var(--text-light)' }}>
                Local Business Excellence
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💚</div>
              <h4>Environmental Impact Leader</h4>
              <p style={{ color: 'var(--text-light)' }}>
                Green Technology Initiative
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--dark-green), var(--primary-green))',
        color: 'white',
        padding: '3rem 0'
      }}>
        <div className="container text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            Join Our Mission
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Whether you're a conscious consumer or a sustainable business owner, 
            there's a place for you in the GreenMarket community.
          </p>
          <div className="flex-center gap-3">
            <a href="/register" className="btn btn-accent">
              Become a Member
            </a>
            <a href="/marketplace" className="btn" style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white'
            }}>
              Explore Donations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;