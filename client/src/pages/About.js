import React, { useEffect, useState } from 'react';
import '../css/about.scss'; // Ensure this path is correct

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading spinner

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer Logic for animations
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
            } else {
              // Optional: remove 'animated' class if you want elements to re-animate on scroll back up
              // entry.target.classList.remove('animated');
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
          rootMargin: '0px 0px -50px 0px'
        }
      );

      const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
      elementsToAnimate.forEach((element) => observer.observe(element));

      return () => {
        elementsToAnimate.forEach((element) => observer.unobserve(element));
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="page-spinner-container">
        <svg
          className="animate-spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="50"
          height="50"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="about-page-wrapper">
      <div className="container py-5"> {/* Adjusted top padding since no banner */}
        <section className="about-intro text-center">
          <h1 className='mb-3 animate-on-scroll slide-in-bottom'>About Spot-Savers</h1> {/* Moved heading here */}
          <p className='lead animate-on-scroll slide-in-bottom delay-1'>
            Spot-Savers aims to establish a platform that connects parking owners within the community with users in search of affordable parking spaces. Our web application assists parking owners in effectively renting out their additional parking spaces, providing them with an opportunity to earn extra income. Additionally, Spot-Savers facilitates users in finding cost-effective parking spaces.
          </p>
        </section>

        <section className="about-section mt-5 animate-on-scroll fade-in">
          <div className='row align-items-center mb-5 feature-row'>
            <div className='col-md-6 order-md-2'>
              <img src='./seeker.jpg' className='img-fluid rounded shadow-lg animate-on-scroll zoom-in' alt="Parking Seeker" />
            </div>
            <div className='col-md-6 order-md-1 d-flex align-items-center text-md-end'>
              <div>
                <h3 className='animate-on-scroll slide-in-left'>Parking Seekers</h3>
                <p className='animate-on-scroll slide-in-left delay-2'>
                  Parking Seekers can utilize the Spot-Savers web application to search for available parking spots that meet their specific needs. By selecting a suitable parking spot, users can reserve it by making the desired payment. Once the reservation is confirmed, users can park their cars by following the provided instructions. Our user-friendly platform ensures a seamless and convenient experience for Parking Seekers, allowing them to easily find and secure parking spaces that suit their requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section mt-5 animate-on-scroll fade-in">
          <div className='row align-items-center feature-row'>
            <div className='col-md-6'>
              <img src='./owner.jpg' className='img-fluid rounded shadow-lg animate-on-scroll zoom-in' alt="Parking Owner" />
            </div>
            <div className='col-md-6 d-flex align-items-center text-md-start'>
              <div>
                <h3 className='animate-on-scroll slide-in-right'>Parking Owners</h3>
                <p className='animate-on-scroll slide-in-right delay-2'>
                  The Spot-Savers web application offers a professional service for parking owners from the community, enabling them to efficiently rent out their extra parking spaces and generate additional income. Our platform lets parking owners easily list their available spots, provide essential details, and set competitive rental prices. Our user-friendly interface ensures a seamless experience, allowing owners to manage their listings, communicate with potential renters, and finalize bookings. With Spot-Savers, parking owners can maximize the utilization of their parking spaces and unlock a new source of revenue. Start utilizing our platform today and experience the benefits of hassle-free and profitable parking space management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;